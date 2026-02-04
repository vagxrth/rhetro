"use client"

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce'

const Searchbar = () => {

    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathName = usePathname();

    const debouncedValue = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedValue) {
            router.push(`/discover?search=${debouncedValue}`)
        } else if (!debouncedValue && pathName !== '/discover') {
            router.push('/discover')
        }
    }, [router, pathName, debouncedValue])

    return (
        <div className='relative block'>
            <div className='relative'>
                <svg
                    className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <Input
                    className='w-full bg-black-2 border border-black-4 rounded-apple-lg px-4 py-4 pl-12 text-white-1 placeholder:text-gray-1 focus:outline-none focus:border-purple-1 focus:ring-1 focus:ring-purple-1 transition-all duration-200 text-[15px]'
                    placeholder='Search for podcasts...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onLoad={() => setSearch('')}
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-3 flex items-center justify-center hover:bg-gray-1 transition-colors'
                    >
                        <svg className='w-3 h-3 text-white-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Searchbar
