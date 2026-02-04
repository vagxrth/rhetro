import { EmptyStateProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ({ title, search, buttonLink, buttonText }: EmptyStateProps) => {
    return (
        <section className='flex-center size-full flex-col gap-6 py-12'>
            <div className='w-24 h-24 rounded-full bg-black-2 flex items-center justify-center'>
                <svg className='w-12 h-12 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
                </svg>
            </div>
            <div className='flex-center w-full max-w-[300px] flex-col gap-3'>
                <h1 className='text-[16px] text-center font-semibold text-white-1'>
                    {title}
                </h1>
                {search && (
                    <p className='text-[14px] text-center text-gray-1'>
                        Try adjusting your search to find more podcasts
                    </p>
                )}
                {buttonLink && (
                    <Button className='mt-2 bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full px-6 h-10 transition-all duration-200 shadow-button'>
                        <Link href={buttonLink} className='gap-2 flex items-center'>
                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                            <span className='text-[14px] font-semibold'>
                                {buttonText}
                            </span>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}

export default EmptyState
