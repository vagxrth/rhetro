"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

import { Progress } from "./ui/progress";

const PodcastPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const { audio } = useAudio();

    const togglePlayPause = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted((prev) => !prev);
        }
    };

    const forward = () => {
        if (
            audioRef.current &&
            audioRef.current.currentTime &&
            audioRef.current.duration &&
            audioRef.current.currentTime + 5 < audioRef.current.duration
        ) {
            audioRef.current.currentTime += 5;
        }
    };

    const rewind = () => {
        if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener("timeupdate", updateCurrentTime);

            return () => {
                audioElement.removeEventListener("timeupdate", updateCurrentTime);
            };
        }
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audio?.audioURL) {
            if (audioElement) {
                audioElement.play().then(() => {
                    setIsPlaying(true);
                });
            }
        } else {
            audioElement?.pause();
            setIsPlaying(true);
        }
    }, [audio]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div
            className={cn("sticky bottom-0 left-0 flex size-full flex-col z-50", {
                hidden: !audio?.audioURL || audio?.audioURL === "",
            })}
        >
            {/* Progress Bar */}
            <div className="w-full h-1 bg-black-4">
                <div
                    className="h-full bg-purple-1 transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                />
            </div>

            {/* Player Content */}
            <section className="glassmorphism-black flex h-[90px] w-full items-center justify-between px-6 shadow-player max-md:justify-center max-md:gap-5 md:px-10">
                <audio
                    ref={audioRef}
                    src={audio?.audioURL}
                    className="hidden"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                />

                {/* Left: Track Info */}
                <div className="flex items-center gap-4 max-md:hidden">
                    <Link href={`/podcast/${audio?.podcastId}`}>
                        <Image
                            src={audio?.imageURL!}
                            width={56}
                            height={56}
                            alt="player"
                            className="rounded-apple object-cover"
                        />
                    </Link>
                    <div className="flex flex-col min-w-[140px]">
                        <h2 className="text-[14px] font-semibold text-white-1 truncate">
                            {audio?.title}
                        </h2>
                        <p className="text-[12px] text-gray-1">{audio?.author}</p>
                    </div>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex items-center gap-6">
                    {/* Rewind */}
                    <button
                        onClick={rewind}
                        className="flex items-center gap-1 text-gray-1 hover:text-white-1 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                        </svg>
                        <span className="text-[11px] font-medium">15</span>
                    </button>

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlayPause}
                        className="w-12 h-12 rounded-full bg-white-1 hover:bg-white-5 flex items-center justify-center transition-all duration-200"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 text-black-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-black-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Forward */}
                    <button
                        onClick={forward}
                        className="flex items-center gap-1 text-gray-1 hover:text-white-1 transition-colors"
                    >
                        <span className="text-[11px] font-medium">15</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                        </svg>
                    </button>
                </div>

                {/* Right: Volume & Time */}
                <div className="flex items-center gap-6 max-md:hidden">
                    {/* Time Display */}
                    <div className="flex items-center gap-2 text-[13px] text-gray-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Volume Control */}
                    <button
                        onClick={toggleMute}
                        className="text-gray-1 hover:text-white-1 transition-colors"
                    >
                        {isMuted ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        )}
                    </button>

                    {/* Queue Icon */}
                    <button className="text-gray-1 hover:text-white-1 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PodcastPlayer;
