'use client'

import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { useAudio } from '@/providers/AudioProvider'

// Custom icons with exact #7225D8 color
const HomeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#7225D8">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
)

const DiscoverIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7225D8" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
)

const CreateIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#7225D8">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
)

const sidebarNavItems = [
    {
        route: "/",
        label: "Home",
        icon: HomeIcon,
    },
    {
        route: "/discover",
        label: "Discover",
        icon: DiscoverIcon,
    },
    {
        route: "/create",
        label: "Create Podcast",
        icon: CreateIcon,
    },
]

const LeftSidebar = () => {

    const pathName = usePathname();
    const router = useRouter();

    const { signOut } = useClerk();

    const { audio } = useAudio();

    return (
        <section className={cn('left_sidebar h-[calc(100vh-5px)]', { 'h-[calc(100vh-140px)]': audio?.audioURL })}>
            <div className='flex flex-col'>
                {/* Logo */}
                <Link href='/' className='flex cursor-pointer items-center gap-2 px-6 pb-10'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-purple-1'>
                        <Image src="/icons/rhetro.png" alt='logo' width={18} height={18} className='brightness-200'/>
                    </div>
                    <h1 className='text-[22px] font-bold text-white-1 tracking-tight'>Rhetro</h1>
                </Link>

                {/* Navigation */}
                <nav className='flex flex-col gap-1 px-4'>
                    {sidebarNavItems.map(({ route, label, icon: Icon }) => {
                        const isActive = pathName === route || (route !== "/" && pathName.startsWith(`${route}/`));
                        const isHomeActive = route === "/" && pathName === "/";
                        const active = isActive || isHomeActive;

                        return (
                            <Link
                                href={route}
                                key={label}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-[10px] text-[15px] font-medium text-white-1 transition-all duration-200',
                                    active
                                        ? 'bg-[#3D3D3F]'
                                        : 'bg-transparent hover:bg-[#2A2A2C]'
                                )}
                            >
                                <Icon />
                                <span>{label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Sign In/Out Button */}
            <div className='px-4 pb-6'>
                <SignedOut>
                    <Button asChild className='w-full bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full h-10 transition-all duration-200 shadow-button'>
                        <Link href='/signin' className='flex items-center justify-center gap-2'>
                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                            Sign In
                        </Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <Button
                        className='w-full bg-black-2 hover:bg-purple-1 text-white-1 font-semibold rounded-full h-10 border border-black-4 transition-all duration-200'
                        onClick={() => signOut(() => router.push('/'))}
                    >
                        <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                        </svg>
                        Sign Out
                    </Button>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar
