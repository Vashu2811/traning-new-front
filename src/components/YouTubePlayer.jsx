import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from 'services/socket';
import { getUserId } from 'services/api';

const YouTubeIframe = ({ videoUrl, width, height, styles, currentPercentage = 0}) => {
    const iframeRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false); // State to track if the video is playing
    const [videoDuration, setVideoDuration] = useState(0); // Video total duration
    const lastTime = useRef(0); // Store the last time to calculate
    const { moduleId, lessonId, courseId } = useParams();
    console.log('currentPercentage', currentPercentage);
    
    useEffect(() => {
        // Check if the YouTube API script is already loaded
        if (!window.YT || !window.YT.Player) {
            if (!document.getElementById('youtube-iframe-api')) {
                const script = document.createElement('script');
                script.id = 'youtube-iframe-api';
                script.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(script);
            }

            // Assign the global callback dynamically if not already set
            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            // API is already loaded, directly initialize the player
            initializePlayer();
        }

        return () => {
            // Cleanup if needed (e.g., destroy the player instance)
            if (player) {
                player.destroy();
            }
        };
    }, []); // This effect runs once when the component is mounted

    const initializePlayer = () => {
        const newPlayer = new window.YT.Player(iframeRef.current, {
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
                // onPlaybackQualityChange: onPlaybackQualityChange,
                // onError: onError
            }
        });
        setPlayer(newPlayer);
    };

    const onPlayerReady = (event) => {
        setVideoDuration(event.target.getDuration()); // Set video duration once player is ready
    };

    const onPlayerStateChange = (event) => {
        const playerStatus = event.data;
        // changeBorderColor(playerStatus);

        if (playerStatus === 1) {
            // Video is playing
            setIsPlaying(true);
        } else if (playerStatus === 2) {
            // Video is paused
            setIsPlaying(false);
        }else if (playerStatus === 0) {
            // Video is end
            sendWatchTimeToBackend(100);
        }
    };

    useEffect(() => {
        
        // Track watch time only when the video is playing
        const interval = setInterval(() => {
            if (isPlaying && player) {
                // Get the current playback time of the video in seconds
                const currentTime = player.getCurrentTime();
                
                const timeDelta = currentTime > lastTime.current ? currentTime : lastTime.current;
                
                if (timeDelta > 0 && timeDelta !== lastTime.current) {
                    const percentage = videoDuration > 0 ? Math.min((timeDelta / videoDuration) * 100, 100).toFixed(0) : 0;
                    if(percentage > currentPercentage){
                        sendWatchTimeToBackend(percentage);
                    }
                    lastTime.current = timeDelta;
                }
            }
        }, 5000); // Update every 5 second

        return () => {
            clearInterval(interval); // Cleanup the interval on component unmount
        };
    }, [isPlaying, player]);

    const sendWatchTimeToBackend = async (progress) => {
        try {
            const user_id = getUserId();
            socket.emit('upsert_trainee_progresss', JSON.stringify({ user_id, module_id: moduleId, lesson_id: lessonId, course_id: courseId, progress }));
        } catch (error) {
            console.error('Error sending watch time to backend:', error);
        }
    };

    return (
        <iframe
            ref={iframeRef}
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}?enablejsapi=1`}
            frameBorder="0"
            style={styles}
            title="YouTube Video"
        />
    );
};

export default YouTubeIframe;
