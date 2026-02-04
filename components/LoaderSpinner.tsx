import { Loader } from 'lucide-react'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <div className='flex-center h-screen w-full'>
      <div className='relative'>
        <Loader className='animate-spin text-purple-1' size={32}/>
      </div>
    </div>
  )
}

export default LoaderSpinner
