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
