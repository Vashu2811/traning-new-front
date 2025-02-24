import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { FaTrashAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Files() {
    const [files, setFiles] = useState([]);  
    const [selectedFile, setSelectedFile] = useState(null);  
    const [userId, setUserId] = useState(null);  
    const fileInputRef = useRef(null);  

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("auth"));
        if (authData && authData.user && authData.user.userId) {
            setUserId(authData.user.userId);
        } else {
            toast.error("User not authenticated!");
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);
            toast.info('File ready to upload.');
        } else {
            toast.error('Only .txt and .docx files are allowed.');
            fileInputRef.current.value = "";  
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);
            toast.info('File ready to upload.');
        } else {
            toast.error('Only .txt and .docx files are allowed.');
        }
    };

    const validateFile = (file) => {
        const allowedExtensions = ['.txt', '.docx'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.warning("Please select a file first!");
            return;
        }
        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folderName", "uploads");
        formData.append("userId", userId);  // 🔹 Include User ID in API request

        try {
            const fileUploadPromise = axios.post(
                "https://coreutilities.hcomb.ai/v1/aws/uploadFile",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const response = await toast.promise(
                fileUploadPromise,
                {
                    pending: "Uploading file, please wait...",
                    success: "File uploaded successfully!",
                    error: "Upload failed. Please try again.",
                },
                { autoClose: 3000 }
            );

            setFiles([...files, { id: files.length + 1, name: selectedFile.name, url: response.data.data }]);
            setSelectedFile(null);
            fileInputRef.current.value = "";
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = "";  
        toast.info('File selection cleared.');
    };

    const handleDelete = (id) => {
        setFiles(files.filter((file) => file.id !== id));
        toast.success('File deleted successfully!');
    };

    return (
        <>
            <ToastContainer />
            <nav className="flex mx-12 my-4 lg:mt-20 md:mt-20 max-sm:mt-20 sm:mt-20" aria-label="Breadcrumb">
                Files
            </nav>

            <div className="flex justify-end px-8 mb-4 ">

                <input ref={fileInputRef} id="file-input" type="file" className="hidden" onChange={handleFileChange} />

                {!selectedFile && (
                    <div
                        className="w-full border-2 border-dashed border-[#5B52E7] rounded-lg p-8 text-center bg-[#201F30] cursor-pointer hover:bg-[#252438]"
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <label htmlFor="file-input" className="cursor-pointer">
                            <FaCloudUploadAlt className="text-4xl text-gray-600 mx-auto mb-2" color='#5B52E7' />
                            <p className="text-white font-semibold">Drag and drop a file here, or click to select a file</p>
                            <p className="text-white text-xs mt-2">Supported Format: TXT, DOCX</p>
                        </label>
                    </div>
                )}
                {selectedFile && (
                    <div className="w-full mt-4 flex items-center justify-between bg-[#201F30] p-4 rounded-md border border-[#5B52E7]">
                        <p className="text-white">{selectedFile.name}</p>
                        <div>
                            <button
                                onClick={handleFileUpload}
                                className="px-4 py-2 bg-[#5b52e7] text-white rounded-md hover:bg-[#5247e2] mr-2"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={handleClearFile}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                <FaTrashAlt className="inline-block h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
            <div className="px-2 bg-[#1A1C1E] m-5 rounded-md p-4">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-[#2B2E31] text-white">
                            <th className="px-4 py-2 text-[#BABABB]">ID</th>
                            <th className="px-4 py-2 text-left text-[#BABABB]">File</th>
                            <th className="px-4 py-2 text-[#BABABB]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id} className="border-b border-[#303234]">
                                <td className="px-4 py-2 text-center text-[#B0B2B3] text-sm">{file.id}</td>
                                <td className="px-4 py-2 text-[#B0B2B3] text-sm">
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {file.name}
                                    </a>
                                </td>
                                <td className="px-4 py-2 text-[#B0B2B3] text-center text-sm">
                                    <button
                                        className="px-2 py-1 text-red-600 rounded-md transition-colors duration-300"
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        <FaTrashAlt className="inline-block h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Files;
