"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-8 flex flex-col animate-fade-in">
      {/* Profile Header - Apple Podcasts Channel Style */}
      <div className="relative mb-10">
        {/* Background gradient */}
        <div className="absolute inset-0 h-[200px] bg-gradient-to-b from-purple-1/20 to-transparent rounded-apple-xl -z-10" />

        <div className="pt-8">
          <ProfileCard
            podcastData={podcastsData!}
            imageURL={user?.imageURL!}
            userFirstName={user?.name!}
          />
        </div>
      </div>

      {/* All Podcasts Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h1 className="section-header">Top Shows</h1>
          <svg className='w-5 h-5 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>

        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid animate-stagger">
            {podcastsData?.podcasts
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imageURL={podcast.imageURL!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
