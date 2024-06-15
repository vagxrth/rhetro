"use client";
import PodcastCard from '@/components/PodcastCard'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


const Home = () => {

  const podcasts = useQuery(api.podcasts.getPremierPodcasts);

  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Premier Podcasts</h1>

        <div className='podcast_grid'>
          {podcasts?.map(({ _id, podcastTitle, podcastDescription, imageURL }) => (
            <PodcastCard key={_id} imgURL={imageURL} title={podcastTitle} description={podcastDescription} podcastId={_id} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home