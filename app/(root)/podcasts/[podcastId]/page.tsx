"use client"

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastPlayerDetails from '@/components/PodcastPlayerDetails'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const PodcastDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {

  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId })

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId });

  const isOwner = user?.id === podcast?.authorId;

  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  return (
    <section className='flex w-full flex-col animate-fade-in'>
      {/* Podcast Detail Header */}
      <div className='mt-8'>
        <PodcastPlayerDetails isOwner={isOwner} {...podcast} podcastId={podcast._id} />
      </div>

      {/* Description Section */}
      <div className='mt-10 pt-8 border-t border-black-4'>
        <p className='text-[16px] leading-relaxed text-white-2'>
          {podcast?.podcastDescription}
        </p>
      </div>

      {/* Transcription Section */}
      <div className='mt-10 flex flex-col gap-4'>
        <h2 className='text-[18px] font-semibold text-white-1'>
          Transcription
        </h2>
        <div className='p-5 bg-black-2 rounded-apple-lg border border-black-4'>
          <p className='text-[15px] leading-relaxed text-white-2'>
            {podcast?.voicePrompt}
          </p>
        </div>
      </div>

      {/* Similar Podcasts Section */}
      <section className='mt-12 flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <h1 className='section-header'>Similar Podcasts</h1>
          <svg className='w-5 h-5 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className='podcast_grid animate-stagger'>
            {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageURL }) => (
              <PodcastCard key={_id} imageURL={imageURL} title={podcastTitle} description={podcastDescription} podcastId={_id} />
            ))}
          </div>
        ) : (
          <EmptyState title="No similar podcasts" buttonLink="/discover" buttonText="Discover Podcasts" />
        )}
      </section>
    </section>
  )
}

export default PodcastDetails
