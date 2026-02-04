import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const PodcastCard = ({ title, description, imageURL, podcastId }: PodcastCardProps) => {

  const router = useRouter();

  const handleViews = () => {
    router.push(`/podcasts/${podcastId}`, {
      scroll: true
    })
  }

  return (
    <div className='podcast-card cursor-pointer group' onClick={handleViews}>
      <figure className='flex flex-col gap-3'>
        <div className='relative overflow-hidden rounded-apple-lg shadow-card'>
          <Image
            src={imageURL}
            width={200}
            height={200}
            alt={title}
            className='podcast-card-image aspect-square w-full object-cover transition-all duration-300 group-hover:scale-105'
          />
          {/* Play button overlay on hover */}
          <div className='absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300'>
            <div className='w-12 h-12 rounded-full bg-purple-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-button'>
              <svg className='w-5 h-5 text-white-1 ml-0.5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1 px-0.5'>
          <h1 className='text-[14px] font-semibold text-white-1 truncate group-hover:text-purple-1 transition-colors duration-200'>
            {title}
          </h1>
          <h2 className='text-[12px] font-normal text-gray-1 truncate capitalize'>
            {description}
          </h2>
        </div>
      </figure>
    </div>
  )
}

export default PodcastCard
