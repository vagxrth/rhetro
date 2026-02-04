"use client"

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {

  const podcastData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });

  return (
    <div className='mt-8 flex flex-col gap-8 animate-fade-in'>
      <Searchbar />

      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <h1 className='section-header'>
            {!search ? 'Discover Podcasts' : 'Search results for '}
            {search && <span className='text-purple-1'>&ldquo;{search}&rdquo;</span>}
          </h1>
        </div>

        {podcastData ? (
          <>
            {podcastData.length > 0 ? (
              <div className='podcast_grid animate-stagger'>
                {podcastData?.map(({ _id, podcastTitle, podcastDescription, imageURL }) => (
                  <PodcastCard key={_id} imageURL={imageURL!} title={podcastTitle} description={podcastDescription} podcastId={_id} />
                ))}
              </div>
            ) : (
              <EmptyState title="No results found" search />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  )
}

export default Discover
