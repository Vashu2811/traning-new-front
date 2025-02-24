import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getConversation, getUserId } from "services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from "../../../data/logo-ico.svg";
import ThreeDotAnimation from "../../../components/ThreeDotAnimation";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

const ProfileDisplay = ({ mentor }) => {
  // If there's no mentor data, return null or a default display
  if (!mentor) return null;

  // Get first letter of name for fallback
  const firstLetter = mentor?.name ? mentor?.name.charAt(0).toUpperCase() : "";

  return (
    <>
      {mentor?.profile_image ? (
        <img
          src={mentor?.profile_image}
          alt={mentor?.name}
          className="w-8 h-8 rounded-full mr-2 object-cover "
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-black font-bold mr-2"
        style={{ display: mentor?.profile_image ? "none" : "flex" }}
      >
        {firstLetter}
      </div>
    </>
  );
};

const ChatUI = () => {
  const location = useLocation();
  const mentor = location.state?.mentor;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);

  const messageContainerRef = useRef(null);
  const chatListRef = useRef(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async (threadId) => {
    setIsLoadingMessages(true);
    try {
      const { status, data } = await getConversation(threadId);
      if (
        status === 200 &&
        data.thread_messages &&
        data.thread_messages.length
      ) {
        const sortedMessages = data.thread_messages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setSelectedThread(threadId);
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return; // Prevent sending empty messages
    let threadId = selectedThread;

    const userId = getUserId();
    setIsSending(true);

    // Temporarily add the user's message to the UI
    const tempMessage = {
      id: Date.now(),
      user_text: inputMessage,
      bot_text: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage("");
    setIsResponseLoading(true);
    try {
      const response = await fetch(
        "https://api.hcomb.ai/v1/open-ai/chat/send-message",
        {
          method: "POST",
          headers: {
            "x-no-compression": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_id: threadId,
            user_text: tempMessage.user_text,
            user_id: userId,
            assistant_id: mentor.assistance_id,
          }),
        }
      );
      setIsResponseLoading(false);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newThreadId = response.headers.get("x-thread-id");
      setSelectedThread(newThreadId);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botResponse += decoder.decode(value);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, bot_text: botResponse } : msg
          )
        );
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      if (!selectedThread) {
        chatListRef.current && chatListRef.current.fetchThreads();
      }
      setIsSending(false);
    }
  };

  const MarkUp = ({ message }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.children}
            </a>
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold mb-2" {...props} />
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    );
  };

  const handleNewChat = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setMessages([]);
    setInputMessage("");
    setSelectedThread(null);
  };

  return (
    <>
      <ToastContainer />
     

<div className=" text-gray-100 flex flex-col h-screen">
      <div className="flex flex-1 gap-4 overflow-hidden md:flex-row flex-col">
        {/* Sidebar */}
        <div className="w-full md:w-[25%] bg-[#1A1C1E] rounded-lg flex flex-col md:max-h-full h-[40vh] md:h-auto ">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 bg-[#3D3D3D] rounded text-sm text-gray-200 outline-none"
            />
          </div>
          <div className="flex-1 overflow-y-auto border-t-2 border-[#37383A] mt-2">
            <div className="h-full p-4">
              <ChatList ref={chatListRef} fetchConversation={fetchConversation} onNewChat={handleNewChat} />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col w-full bg-[#1A1C1E] rounded-lg overflow-hidden shadow-lg">
          {/* Header */}
          <div className="p-2 flex items-center justify-between border-b-2 border-[#37383A] bg-[#1A1C1E]">
            <div className="flex items-center space-x-3">
              <ProfileDisplay mentor={mentor} />
              <div>
                <h2 className="text-white font-semibold">{mentor?.name}</h2>
                <p className="text-sm text-gray-400">{mentor?.user_details?.role}</p>
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="px-4 py-1 bg-[#5b52e7] text-white rounded-sm hover:bg-[#5247e2]"
            >
              + New Chat
            </button>
          </div>

          {/* Messages */}
          <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {isLoadingMessages ? (
              <LoadingSpinner />
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <React.Fragment key={message.id}>
                  {message.user_text && (
                    <ChatBubble
                      sender="user"
                      message={message.user_text}
                      time={new Date(message.created_at).toLocaleTimeString()}
                      profilePic={mentor?.profile_image}
                      mentor={mentor}
                    />
                  )}
                  {message.bot_text && (
                    <ChatBubble
                      sender="assistant"
                      message={<MarkUp message={message.bot_text} />}
                      time={new Date(message.created_at).toLocaleTimeString()}
                      profilePic={logo}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="text-center text-gray-400">No messages yet.</p>
            )}
            {isResponseLoading && (
              <ChatBubble sender="assistant" message={""} time={""} profilePic={logo} showLoader={true} />
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t-2 border-[#37383A] bg-[#1A1C1E]">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter Message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-2 rounded-lg bg-[#3D3D3D] text-white outline-none placeholder-gray-400 focus:ring-2"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  isSending ? "bg-gray-500" : "bg-[#5b52e7] hover:bg-[#5247e2]"
                }`}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const ChatList = forwardRef(({ fetchConversation, onNewChat }, ref) => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const location = useLocation();
  const mentor = location.state?.mentor;

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/threads?user_id=${getUserId()}&assistance_id=${
          mentor.assistance_id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setThreads(data.threads);
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadSelect = (threadId) => {
    setSelectedThreadId(threadId);
    fetchConversation(threadId);
  };

  useEffect(() => {
    if (mentor?.assistance_id) {
      fetchThreads();
    }
  }, [mentor]);

  useImperativeHandle(ref, () => ({
    fetchThreads,
  }));

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      {threads &&
        threads.length > 0 &&
        threads?.map((thread) => (
          <ChatItem
            key={thread.id}
            threadName={thread.thread_name}
            threadId={thread.id}
            fetchThreadId={thread.thread_id}
            onSelect={handleThreadSelect}
            fetchThreads={fetchThreads}
            isSelected={selectedThreadId === thread.thread_id}
            onNewChat={onNewChat}
          />
        ))}
    </>
  );
});

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1C1E] rounded-lg p-6 w-96 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatItem = ({
  threadName,
  threadId,
  onSelect,
  fetchThreads,
  fetchThreadId,
  isSelected,
  onNewChat,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newThreadName, setNewThreadName] = useState(threadName);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Handle click outside of menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Auto focus input when editing starts
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (newThreadName.trim() === threadName) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(
        `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/threads`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: threadId, thread_name: newThreadName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update thread name");
      }
      fetchThreads();
      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming thread:", error);
    }
  };

  
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/threads`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: threadId,
            is_deleted: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }
      fetchThreads();
      setIsDeleteModalOpen(false);
      onNewChat();
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer rounded ${
          isSelected ? "bg-gray-600" : "hover:bg-gray-700"
        }`}
        onClick={() => onSelect(fetchThreadId)}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={newThreadName}
            onChange={(e) => setNewThreadName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyPress={(e) => e.key === "Enter" && handleRenameSubmit()}
            className="flex-1 p-2 bg-gray-800 rounded text-gray-200 outline-none"
          />
        ) : (
          <span className="flex-1">{threadName}</span>
        )}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ⋮
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded shadow-lg z-10">
              <button
                onClick={handleRename}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left"
              >
                Rename
              </button>
              <button
                onClick={handleDeleteClick}
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Thread"
        message="Are you sure you want to delete this thread? This action cannot be undone."
      />
    </>
  );
};

const ChatBubble = ({
  sender,
  message,
  time,
  profilePic,
  showLoader,
  mentor,
}) => {
  // Format the time to exclude seconds
  const formattedTime = time.replace(/:\d{2}\s/, " ");

  return (
    <div
      className={`flex ${
        sender === "assistant" ? "justify-start" : "justify-end"
      } items-end`}
    >
      {sender === "assistant" && (
        <img
          src={profilePic}
          alt="Profile"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div className={`max-w-[60%] p-3 rounded-md bg-[#242728] text-white`}>
        <p className="whitespace-pre-wrap">
          {showLoader ? <ThreeDotAnimation /> : message}
        </p>
        <p className="text-xs text-gray-400 mt-2 text-right">{formattedTime}</p>
      </div>
      {sender === "user" && (
        <div className="ml-2">
          <ProfileDisplay mentor={mentor} />
        </div>
      )}
    </div>
  );
};

export default ChatUI;
