"use client"

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from './Header';
import Carousel from './Carousel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpinner from './LoaderSpinner';
import { useAudio } from '@/providers/AudioProvider';
import { cn } from '@/lib/utils';

const RightSidebar = () => {

  const { user } = useUser();

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);

  const router = useRouter();

  const { audio } = useAudio();

  if (!topPodcasters) return <LoaderSpinner />

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]', { 'h-[calc(100vh-140px)]': audio?.audioURL })}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className='flex items-center gap-3 p-3 rounded-apple-lg bg-black-2 hover:bg-black-4 transition-all duration-200 mb-8'>
          <UserButton appearance={{
            elements: {
              avatarBox: 'w-10 h-10'
            }
          }} />
          <div className='flex flex-1 items-center justify-between'>
            <div className='flex flex-col'>
              <h1 className='text-[15px] font-semibold text-white-1 truncate'>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className='text-[12px] text-gray-1'>View Profile</p>
            </div>
            <svg className='w-5 h-5 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </Link>
      </SignedIn>

      <section className='mb-8'>
        <Header headerTitle="People also like" />
        <Carousel podcasters={topPodcasters!} />
      </section>

      <section className='flex flex-col gap-4'>
        <Header headerTitle='Top Podcasters' showSeeAll={false} />
        <div className='flex flex-col gap-2'>
          {topPodcasters?.slice(0, 5).map((podcaster, index) => (
            <div
              key={podcaster._id}
              className='flex cursor-pointer items-center justify-between p-3 rounded-apple hover:bg-black-2 transition-all duration-200 group'
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <div className='flex items-center gap-3'>
                <span className='text-[13px] font-medium text-gray-1 w-4'>{index + 1}</span>
                <Image
                  src={podcaster.imageURL}
                  alt={podcaster.name}
                  width={44}
                  height={44}
                  className='rounded-apple object-cover'
                />
                <div className='flex flex-col'>
                  <h2 className='text-[14px] font-semibold text-white-1 group-hover:text-purple-1 transition-colors'>
                    {podcaster.name}
                  </h2>
                  <p className='text-[12px] text-gray-1'>
                    {podcaster.totalPodcasts} {podcaster.totalPodcasts === 1 ? 'Show' : 'Shows'}
                  </p>
                </div>
              </div>
              <svg className='w-4 h-4 text-gray-1 opacity-0 group-hover:opacity-100 transition-opacity' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar
