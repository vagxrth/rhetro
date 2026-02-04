import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const Header = ({ headerTitle, titleClassName, showSeeAll = true }: { headerTitle?: string, titleClassName?: string, showSeeAll?: boolean }) => {
  return (
    <header className='flex items-center justify-between mb-4'>
      {headerTitle ? (
        <h1 className={cn('text-[18px] font-semibold text-white-1 tracking-tight', titleClassName)}>
          {headerTitle}
        </h1>
      ) : (
        <div />
      )}
      {showSeeAll && (
        <Link
          href="/discover"
          className='flex items-center gap-1 text-[14px] font-medium text-purple-1 hover:text-purple-2 transition-colors'
        >
          See all
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Link>
      )}
    </header>
  )
}

export default Header
