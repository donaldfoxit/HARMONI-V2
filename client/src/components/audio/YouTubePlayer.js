import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, ExternalLink } from "lucide-react";

export const YouTubePlayer = ({ videoId, isPlaying, onToggle }) => {
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // Ensure the container is rendered first
        if (!containerRef.current) return;

        const initializePlayer = () => {
            const playerElement = document.getElementById('youtube-player');
            if (!playerElement) {
                console.error('YouTube player element not found');
                return;
            }

            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.log('Error destroying player:', e);
                }
            }

            try {
                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId: videoId,
                    playerVars: {
                        autoplay: isPlaying ? 1 : 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoId,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        enablejsapi: 1,
                    },
                    events: {
                        onReady: (event) => {
                            console.log('YouTube player ready');
                            event.target.setVolume(25);
                            setPlayerReady(true);
                            if (isPlaying) {
                                setTimeout(() => {
                                    event.target.playVideo();
                                }, 100);
                            }
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                event.target.playVideo();
                            }
                        },
                        onError: (event) => {
                            console.error('YouTube player error:', event.data);
                        },
                    },
                });
            } catch (e) {
                console.error('Error creating YouTube player:', e);
            }
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube API ready');
                setTimeout(initializePlayer, 100);
            };
        } else if (window.YT.Player) {
            setTimeout(initializePlayer, 100);
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                    playerRef.current = null;
                } catch (e) {
                    console.log('Error in cleanup:', e);
                }
            }
        };
    }, [videoId, isPlaying]);

    useEffect(() => {
        if (playerReady && playerRef.current) {
            try {
                if (typeof playerRef.current.playVideo === 'function' && typeof playerRef.current.pauseVideo === 'function') {
                    if (isPlaying) {
                        playerRef.current.playVideo();
                    } else {
                        playerRef.current.pauseVideo();
                    }
                }
            } catch (e) {
                console.error('Error toggling playback:', e);
            }
        }
    }, [isPlaying, playerReady]);

    return (
        <div ref={containerRef} className="fixed bottom-4 right-4 z-40" style={{ zIndex: 9999 }}>
            <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500/30 to-indigo-500/30 backdrop-blur-lg rounded-full px-4 py-2.5 border border-white/40 shadow-xl">
                <button
                    onClick={onToggle}
                    className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-md hover:scale-110"
                    title={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {isPlaying ? (
                        <Volume2 className="w-4 h-4" />
                    ) : (
                        <VolumeX className="w-4 h-4" />
                    )}
                </button>
                <a
                    href={`https://youtu.be/${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-all duration-200 shadow-md hover:scale-110"
                    title="Open in YouTube"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
            <div id="youtube-player" style={{
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                visibility: 'hidden'
            }}></div>
        </div>
    );
};
