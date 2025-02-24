
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
// Set the workerSrc to the correct path
import packageJson from '../../package.json';

const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];




const PdfViewer = ({filename}) => {
    // Replace with the URL or path to your PDF file
    const pdfUrl = `/files/${filename}`;

    return (
        <div style={{ height: '100vh' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfUrl} />
            </Worker>
        </div>
    );
};

export default PdfViewer;
