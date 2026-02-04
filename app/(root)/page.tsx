"use client";
import PodcastCard from '@/components/PodcastCard'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from '@/components/LoaderSpinner';
import Image from 'next/image';


const Home = () => {

  const podcasts = useQuery(api.podcasts.getPremierPodcasts);

  if (!podcasts) return <LoaderSpinner />

  return (
    <div className='mt-8 flex flex-col gap-10 animate-fade-in'>
      {/* Featured Section - Apple Podcasts Style */}
      {podcasts && podcasts.length > 0 && (
        <section className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h1 className='section-header'>New</h1>
          </div>

          {/* Featured Cards - Large Format */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {podcasts.slice(0, 2).map((podcast, index) => (
              <div
                key={podcast._id}
                className='featured-card group cursor-pointer overflow-hidden'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='relative aspect-[16/10] overflow-hidden'>
                  <Image
                    src={podcast.imageURL}
                    alt={podcast.podcastTitle}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                  <div className='absolute bottom-0 left-0 right-0 p-5'>
                    <span className='featured-label mb-2 block'>Featured</span>
                    <p className='text-[14px] text-white-2 line-clamp-2'>{podcast.podcastDescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Shows Grid */}
      <section className='flex flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <h1 className='section-header'>Top Shows</h1>
          <svg className='w-5 h-5 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>

        <div className='podcast_grid animate-stagger'>
          {podcasts?.map(({ _id, podcastTitle, podcastDescription, imageURL }) => (
            <PodcastCard
              key={_id}
              imageURL={imageURL}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
