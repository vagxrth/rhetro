'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { useAudio } from '@/providers/AudioProvider'

const LeftSidebar = () => {

    const pathName = usePathname();
    const router = useRouter();

    const { signOut } = useClerk();

    const { audio } = useAudio();

    return (
        <section className={cn('left_sidebar h-[calc(100vh-5px)]', { 'h-[calc(100vh-140px)]': audio?.audioURL })}>
            <nav className='flex flex-col gap-6'>
                <Link href='/' className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
                    <Image src="/icons/rhetro.png" alt='logo' width={23} height={27} className='mr-2'/>
                    <h1 className='text-24 font-extrabold text-white max-lg:hidden'>Rhetro</h1>
                </Link>

                {sidebarLinks.map(({ route, label, imgURL }) => {
                    const isActive = pathName === route || pathName.startsWith(`${route}/`);
                    return <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {
                        'bg-nav-focus border-r-4 border-orange-1': isActive
                    })}>
                        <Image src={imgURL} alt={label} width={24} height={24} />
                        <p className='font-bold'>
                            {label}
                        </p>
                    </Link>
                })}
            </nav>
            <SignedOut>
                <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
                    <Button asChild className='text-16 w-full bg-black-2 hover:bg-orange-1 font-bold'>
                        <Link href='/signin'>
                            Sign in
                        </Link>
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
                    <Button className='text-16 w-full bg-black-2 hover:bg-orange-1 font-bold' onClick={() => signOut(() => router.push('/'))}>
                        Sign out
                    </Button>
                </div>
            </SignedIn>
        </section>
    )
}

export default LeftSidebar