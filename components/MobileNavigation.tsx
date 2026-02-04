"use client"

import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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

const MobileNavigation = () => {

  const pathName = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <div className='w-10 h-10 rounded-full bg-black-2 flex items-center justify-center'>
            <svg className='w-5 h-5 text-white-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className='border-none bg-black-1 w-[280px]'>
          <Link href='/' className='flex items-center gap-2 pb-10 pl-2'>
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-purple-1'>
              <Image src="/icons/rhetro.png" alt='logo' width={18} height={18} className='brightness-200' />
            </div>
            <h1 className='text-[22px] font-bold text-white-1 tracking-tight'>Rhetro</h1>
          </Link>
          <div className='flex h-[calc(100vh-120px)] flex-col justify-between overflow-y-auto'>
            <SheetClose asChild>
              <nav className='flex h-full flex-col gap-1 text-white-1'>
                {sidebarNavItems.map(({ route, label, icon: Icon }) => {
                  const isActive = pathName === route || (route !== "/" && pathName.startsWith(`${route}/`));
                  const isHomeActive = route === "/" && pathName === "/";
                  const active = isActive || isHomeActive;

                  return (
                    <SheetClose asChild key={route}>
                      <Link
                        href={route}
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
                    </SheetClose>
                  )
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

    </section>
  )
}

export default MobileNavigation
