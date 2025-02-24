import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from 'services/socket';
import { getUserId } from 'services/api';
import ReactPlayer from 'react-player'


const YouTubeIframeV2 = ({ videoUrl, width, height, styles, currentPercentage = 0}) => {
    const { moduleId, lessonId, courseId } = useParams();
    const [videoDuration, setVideoDuration] = useState(null);
    const [videoPercentage, setVideoPercentage] = useState(currentPercentage);
    const [startDuration, setStartDuration] = useState(null)

    const onDuration = (value) =>{
        setVideoDuration(value)
        setStartDuration(Math.min((currentPercentage / 100) * value).toFixed(0))
    }
    const sendWatchTimeToBackend = async (progress) => {
        try {
            // const progressTime = Math.min((progress.playedSeconds).toFixed(0))
            const percentage = videoDuration > 0 ? Math.min((progress.playedSeconds / videoDuration) * 100, 100).toFixed(0) : 0;
            
            if(percentage > videoPercentage){
                console.log('then and then only store the value in the database');
                setVideoPercentage(percentage)
                const user_id = getUserId();
                socket.emit('upsert_trainee_progresss', JSON.stringify({ user_id, module_id: moduleId, lesson_id: lessonId, course_id: courseId, progress: percentage }));
            }
        } catch (error) {
            console.error('Error sending watch time to backend:', error);
        }
    };

    return (
        <ReactPlayer url={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}?enablejsapi=1`}
        progressInterval={5000}
        width={'100%'}
        height={'100%'}
        onDuration={onDuration}
        onProgress={sendWatchTimeToBackend}
        style={styles}
        config={{
          youtube:{
            playerVars:{start : startDuration, controls: 1, rel: 0}
          }
        }}
        />

    );
};

export default YouTubeIframeV2;
