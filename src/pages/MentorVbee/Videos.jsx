import React, { useState } from 'react';
import { FaTrashAlt, FaYoutube } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Videos() {
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState('');

    // Validate YouTube URL
    const isValidYouTubeUrl = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return youtubeRegex.test(url);
    };

    // Extract video ID from YouTube URL
    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };

    const handleVideoUpload = () => {
        if (newVideo.trim() === '') {
            toast.error('Please enter a YouTube URL');
            return;
        }

        if (!isValidYouTubeUrl(newVideo)) {
            toast.error('Please enter a valid YouTube URL');
            return;
        }

        const videoId = getYouTubeVideoId(newVideo);
        if (videos.some(video => getYouTubeVideoId(video.name) === videoId)) {
            toast.error('This video has already been added');
            return;
        }

        setVideos([...videos, { id: videos.length + 1, name: newVideo }]);
        setNewVideo('');
        toast.success('Video added successfully!');
    };

    const handleDelete = (id) => {
        setVideos(videos.filter((video) => video.id !== id));
        toast.success('Video deleted successfully!');
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVideoUpload();
        }
    };

    return (
        <>
            <ToastContainer />
            <nav
                className="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20"
                aria-label="Breadcrumb"
            >
                Add Videos
            </nav>
            <div className="flex justify-end px-6 mb-4 items-center">
                <div className="relative flex-grow max-w-2xl mr-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <FaYoutube className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md mr-2 focus:outline-none focus:ring focus:ring-[#5b52e7] w-full"
                        placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <button
                    className="px-6 py-2 bg-[#5b52e7] text-white rounded-md hover:bg-[#5247e2] whitespace-nowrap"
                    onClick={handleVideoUpload}
                >
                    Add Video
                </button>
            </div>
            <div className="px-2 bg-[#1A1C1E] m-5 rounded-md p-4">
                <div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-[#2B2E31] text-white">
                                <th className="px-4 py-2 text-[#BABABB]">ID</th>
                                <th className="px-4 py-2 text-left text-[#BABABB]">Video URL</th>
                                <th className="px-4 py-2 text-[#BABABB]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* https://www.youtube.com/watch?v=n0ywym5CUdA
                        https://www.youtube.com/watch?v=RJVWGjsQU6k */}
                            {videos.map((video) => (
                                <tr key={video.id} className="border-b border-[#333333]">
                                    <td className="px-4 py-2 text-center">{video.id}</td>
                                    <td className="px-4 py-2 break-all">
                                        <a
                                            href={video.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-500"
                                        >
                                            {video.name}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="px-2 py-1 text-red-600 rounded-md transition-colors duration-300"
                                            onClick={() => handleDelete(video.id)}
                                        >
                                            <FaTrashAlt className="inline-block h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Videos;