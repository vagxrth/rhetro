"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { useAudio } from '@/providers/AudioProvider';
import { PodcastDetailPlayerProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const PodcastDetailPlayer = ({
  audioURL,
  podcastTitle,
  author,
  imageURL,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageURL,
  authorId,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioURL,
      imageURL,
      author,
      podcastId,
    });
  };

  if (!imageURL || !authorImageURL) return <LoaderSpinner />;

  return (
    <div className="flex w-full justify-between max-md:flex-col max-md:items-center">
      <div className="flex gap-8 max-md:flex-col max-md:items-center">
        {/* Podcast Artwork */}
        <div className="relative group">
          <Image
            src={imageURL}
            width={230}
            height={230}
            alt="Podcast image"
            className="rounded-apple-lg shadow-card"
          />
        </div>

        {/* Podcast Info */}
        <div className="flex flex-col justify-center gap-4 max-md:items-center max-md:text-center">
          {/* Episode Meta */}
          <div className="flex items-center gap-2 text-[12px] text-gray-1 uppercase tracking-wider">
            <span>6 days ago</span>
            <span>•</span>
            <span>Episode</span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-bold text-white-1 tracking-tight leading-tight max-w-[500px]">
            {podcastTitle}
          </h1>

          {/* Author */}
          <div
            className="flex items-center gap-2 cursor-pointer group/author"
            onClick={() => router.push(`/profile/${authorId}`)}
          >
            <span className="text-[17px] font-medium text-purple-1 hover:underline">
              {author}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <Button
              onClick={handlePlay}
              className="bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full px-8 h-11 transition-all duration-200 shadow-button"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Button>

            <span className="text-[14px] text-gray-1">Premium Only</span>
          </div>
        </div>
      </div>

      {/* More Options */}
      {isOwner && (
        <div className="relative max-md:mt-6">
          <button
            onClick={() => setIsDeleting((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-black-2 hover:bg-black-4 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white-1" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="18" r="2" />
            </svg>
          </button>

          {isDeleting && (
            <div
              ref={menuRef}
              className="absolute right-0 top-12 z-10 w-40 rounded-apple-lg bg-black-2 border border-black-4 shadow-card overflow-hidden"
            >
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black-4 transition-colors"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-[14px] text-red-500 font-medium">Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
