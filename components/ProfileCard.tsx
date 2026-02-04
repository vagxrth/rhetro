"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/providers/AudioProvider";
import { PodcastProps, ProfileCardProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";

const ProfileCard = ({
  podcastData,
  imageURL,
  userFirstName,
}: ProfileCardProps) => {
  const { setAudio } = useAudio();

  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);

  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);

    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };

  useEffect(() => {
    if (randomPodcast) {
      setAudio({
        title: randomPodcast.podcastTitle,
        audioURL: randomPodcast.audioURL || "",
        imageURL: randomPodcast.imageURL || "",
        author: randomPodcast.author,
        podcastId: randomPodcast._id,
      });
    }
  }, [randomPodcast, setAudio]);

  if (!imageURL) return <LoaderSpinner />;

  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Profile Image */}
      <div className="relative">
        <Image
          src={imageURL}
          width={140}
          height={140}
          alt="Podcaster"
          className="rounded-apple-xl object-cover shadow-card"
        />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-[28px] font-bold text-white-1 tracking-tight">
          {userFirstName}
        </h1>
        <div className="flex items-center gap-2 text-gray-1">
          <span className="text-[14px]">Channel</span>
          <span className="text-[14px]">•</span>
          <span className="text-[14px]">{podcastData?.podcasts.length || 0} Shows</span>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black-2 border border-black-4">
        <svg className="w-4 h-4 text-purple-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        <span className="text-[13px] font-medium text-white-2">Verified Creator</span>
      </div>

      {/* Play Button */}
      {podcastData?.podcasts.length > 0 && (
        <Button
          onClick={playRandomPodcast}
          className="bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full px-8 h-11 transition-all duration-200 shadow-button"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play Random
        </Button>
      )}
    </div>
  );
};

export default ProfileCard;
