import React, { useState, useRef, useEffect } from 'react';
import { Send as SendIcon, Mic as MicIcon, AttachFile as AttachFileIcon, Delete, Edit } from '@mui/icons-material';
import {
    Box,
    Typography,
    IconButton,
    TextField,
    AppBar,
    Toolbar,
    Avatar,
    ListItemButton,
    ListItemText,
    List,
    Divider,
    ListItem,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { toast } from 'react-toastify';
import { createThread, getUserId, getConversation } from 'services/api';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { useLocation } from 'react-router-dom';
import ThreeDotAnimation from '../../components/ThreeDotAnimation';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
            dark: '#2c3e50'
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
            secondary: '#242728'
        },
        text: {
            primary: '#e0e0e0',
            secondary: '#a0a0a0'
        }
    }
});

const Mentor = () => {
    const [messages, setMessages] = useState([]);
    const [chatThreads, setChatThreads] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [aiMessage, setAiMessage] = useState('');
    const [selectedThread, setSelectedThread] = useState(null);
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const mentor = location.state?.mentor;
    const [userMessage, setUserMessage] = useState('')
    const [isResponseLoading, setIsResponseLoading] = useState(false);

    // Function to scroll to the last message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, aiMessage, userMessage]);

    const resetChatState = () => {
        setMessages([]);
        setAiMessage('');
        setInputMessage('');
        setSelectedThread(null);
    };

    useEffect(() => {
        getThreadName();
    }, []);

    const getThreadName = async () => {
        const response = await fetch(`https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/threads?user_id=${getUserId()}&assistance_id=${mentor.assistance_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setChatThreads(data.threads || []);
    };

    const handleThreadSelection = (thread) => {
        setSelectedThread(thread?.thread_id);
        //getThreadMessage(thread?.thread_id);
        fetchConversation(thread?.thread_id);
    };

    const fetchConversation = async (threadId) => {
        const { status, data } = await getConversation(threadId);
        if (status === 200 && data.thread_messages && data.thread_messages.length) {
            setMessages(data.thread_messages);
        }
    };

    // const getThreadMessage = async (threadId) => {
    //     try {
    //         const response = await fetch(`https://api.hcomb.ai/v1/open-ai/chat/get-thread-message?thread_id=${threadId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response) {
    //             const data = await response.json();
    //             const extractedData = data?.data?.data
    //                 ?.map((message) => ({
    //                     role: message.role,
    //                     text: message.content[0]?.text.value || '' // Using optional chaining to avoid errors
    //                 }))
    //                 .reverse();
    //             if (threadId) {
    //                 setMessages(extractedData);
    //             }
    //         }
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         const details = await response.json();
    //         setAiMessage(details?.data?.data[0]?.content[0]?.text?.value);
    //         console.log('response', await response.json());
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //     } finally {
    //     }
    // };

    const handleNewChat = async (e) => {
        e.preventDefault();
        resetChatState();
    };

    const handleSendMessage = async () => {
        let threadId = selectedThread; // Default to the selected thread

        // Validate input message
        if (!inputMessage.trim()) {
            toast.error('Please enter a message');
            return;
        }
        setInputMessage('');
        setUserMessage(inputMessage.trim())
        setIsResponseLoading(true)
        try {
            // Send the message to the API
            const response = await fetch('https://api.hcomb.ai/v1/open-ai/chat/send-message', {
                method: 'POST',
                headers: {
                    'x-no-compression': 'true',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    thread_id: threadId, // Use the resolved thread ID
                    user_text: inputMessage,
                    user_id: getUserId(),
                    assistant_id: mentor.assistance_id
                })
            });
            setIsResponseLoading(false)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const NewThreadId = response.headers.get('x-thread-id');
            setSelectedThread(NewThreadId)
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let text = '';
            const streamProcessor = async () => {
                let result;
                let textBuffer = '';

                // Loop through the stream chunks
                while (!(result = await reader.read()).done) {
                    const chunk = decoder.decode(result.value, { stream: true });
                    textBuffer += chunk; // Append the chunk to a buffer
                    setAiMessage(textBuffer);
                    text = textBuffer;

                    // Optionally, handle each chunk (you can break it into lines if necessary)
                    console.log('Streamed chunk:', chunk);
                }
                // Final processing once the stream is complete
                console.log('Stream complete, final text:', textBuffer);
            };

            // Start processing the stream
            setIsMessageComplete(true);
            await streamProcessor();
            setIsMessageComplete(false);
            setAiMessage('');
            setUserMessage('')
            const newMessage = { user_text: inputMessage , bot_text: text };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputMessage('');
            await getThreadName();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const MarkUp = ({ message }) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                    a: ({ node, ...props }) => (
                        <a {...props} className="text-blue-500 hover:text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
                            {props.children}
                        </a>
                    ),
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />
                }}>
                {message}
            </ReactMarkdown>
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    display: 'flex',
                    backgroundColor: darkTheme.palette.background.default,
                    color: darkTheme.palette.text.primary
                }}>
                <Box
                    sx={{
                        width: 300,
                        bgcolor: darkTheme.palette.background.paper,
                        borderRight: '1px solid #333',
                        height: '100vh',
                        overflow: 'auto'
                    }}>
                    <IconButton
                        onClick={handleNewChat}
                        sx={{
                            mt: 4,
                            width: '90%', // Use percentage width instead of fixed pixels
                            maxWidth: 300, // Optional: set a maximum width
                            mx: 'auto', // Center the button
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: darkTheme.palette.text.primary,
                            borderRadius: 2,
                            padding: 2,
                            bgcolor: darkTheme.palette.primary.main,
                            '&:hover': {
                                bgcolor: darkTheme.palette.primary.dark,
                                color: darkTheme.palette.text.primary,
                                transform: 'scale(1.05)',
                                transition: 'all 0.3s ease-in-out'
                            },
                            fontWeight: 'bold'
                        }}>
                        New Chat +
                    </IconButton>
                    <List>
                        {chatThreads.map((chat) => (
                            <ListItem
                                key={chat.id}
                                onClick={() => handleThreadSelection(chat)}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    border: `1px solid ${selectedThread === chat.id ? darkTheme.palette.primary.main : darkTheme.palette.text.secondary}`,
                                    backgroundColor: selectedThread === chat.id ? darkTheme.palette.action.hover : 'inherit',
                                    color: selectedThread === chat.id ? 'black' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: darkTheme.palette.action.hover,
                                        cursor: 'pointer',
                                        border: `1px solid ${darkTheme.palette.primary.main}`
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={chat?.thread_name}
                                    primaryTypographyProps={{
                                        color: darkTheme.palette.text.primary
                                    }}
                                    secondaryTypographyProps={{
                                        color: darkTheme.palette.text.secondary
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box
                    sx={{
                        width: 1330,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        backgroundColor: darkTheme.palette.background.default
                    }}>
                    {/* Sticky Header */}
                    <AppBar
                        position="sticky"
                        sx={{
                            top: 35,
                            zIndex: 1000,
                            backgroundColor: darkTheme.palette.background.paper,
                            boxShadow: '0 2px 4px rgba(255,255,255,0.1)'
                        }}>
                        <Toolbar>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexGrow: 1
                                }}>
                                <Avatar
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        backgroundColor: darkTheme.palette.primary.main,
                                        mr: 2
                                    }}>
                                    MN
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="inherit" sx={{ fontWeight: 600 }}>
                                        Mentor Name
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ color: darkTheme.palette.text.secondary }}>
                                        Intro
                                    </Typography>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {/* Messages Container */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            marginTop: 5,
                            backgroundColor: darkTheme.palette.background.default,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                        {messages.map((message, index) => (
                            <Box key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mb: 2
                                    }}>
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            bgcolor: darkTheme.palette.primary.main,
                                            color: darkTheme.palette.primary.contrastText
                                        }}>
                                        <MarkUp message={message?.user_text} />
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        mb: 2
                                    }}>
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            bgcolor: darkTheme.palette.background.secondary,
                                            color: darkTheme.palette.text.primary
                                        }}>
                                        <MarkUp message={message?.bot_text} />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        {userMessage &&(
                            <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mb: 2
                            }}>
                            <Box
                                sx={{
                                    maxWidth: '70%',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    bgcolor: darkTheme.palette.primary.main,
                                    color: darkTheme.palette.primary.contrastText
                                }}>
                                <MarkUp message={userMessage} />
                            </Box>
                        </Box>
                        )}
                        {((isMessageComplete && aiMessage) || isResponseLoading) && (
                            <div className={'flex justify-start'}>
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        bgcolor: darkTheme.palette.background.secondary,
                                        color: darkTheme.palette.text.primary
                                    }}>
                                        {isResponseLoading ? <ThreeDotAnimation /> : <MarkUp message={aiMessage} />}
                                    
                                </Box>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Sticky Input Area */}
                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            zIndex: 1000,
                            p: 2,
                            backgroundColor: darkTheme.palette.background.paper,
                            borderTop: '1px solid',
                            borderColor: darkTheme.palette.divider,
                            boxShadow: '0 -2px 4px rgba(255,255,255,0.1)'
                        }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                size="small"
                                sx={{
                                    flexGrow: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 4,
                                        backgroundColor: darkTheme.palette.background.default
                                    },
                                    '& .MuiInputBase-input': {
                                        color: darkTheme.palette.text.primary
                                    }
                                }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                sx={{
                                    bgcolor: darkTheme.palette.primary.main,
                                    color: darkTheme.palette.primary.contrastText,
                                    '&:hover': {
                                        bgcolor: darkTheme.palette.primary.dark
                                    }
                                }}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Mentor;
