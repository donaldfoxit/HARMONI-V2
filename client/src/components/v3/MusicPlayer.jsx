import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = '5F5dgg1eeGE';

const MusicPlayer = ({ autoStart = false }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const playerRef = useRef(null);
    const hasAutoStarted = useRef(false);

    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Initialize player when API is ready
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: YOUTUBE_VIDEO_ID,
                playerVars: {
                    autoplay: 1,
                    loop: 1,
                    playlist: YOUTUBE_VIDEO_ID,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    mute: 1
                },
                events: {
                    onReady: (event) => {
                        setIsReady(true);
                        event.target.setVolume(30);
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    }
                }
            });
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    // Auto-start when autoStart prop becomes true
    useEffect(() => {
        if (autoStart && isReady && !hasAutoStarted.current && playerRef.current) {
            hasAutoStarted.current = true;
            playerRef.current.unMute();
            playerRef.current.playVideo();
            setIsMuted(false);
            setShowPrompt(false);
        }
    }, [autoStart, isReady]);

    const toggleMute = () => {
        if (!playerRef.current) return;

        if (isMuted) {
            playerRef.current.unMute();
            playerRef.current.playVideo();
            setShowPrompt(false);
        } else {
            playerRef.current.mute();
        }
        setIsMuted(!isMuted);
    };

    return (
        <>
            {/* Hidden YouTube Player */}
            <div className="fixed -top-[9999px] -left-[9999px] w-0 h-0 overflow-hidden pointer-events-none opacity-0">
                <div id="youtube-player" />
            </div>

            {/* Mute/Unmute Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                onClick={toggleMute}
                className="fixed bottom-6 right-6 z-[9999] group"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
                <div className="relative p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    )}

                    {/* Pulse indicator when unmuted */}
                    {!isMuted && (
                        <motion.div
                            className="absolute inset-0 rounded-full border border-white/30"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                </div>

                {/* "Click to play music" prompt */}
                <AnimatePresence>
                    {showPrompt && isMuted && isReady && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                        >
                            <span className="text-white/40 text-xs font-montserrat tracking-wide">
                                ♪ Play music
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
};

export default MusicPlayer;
