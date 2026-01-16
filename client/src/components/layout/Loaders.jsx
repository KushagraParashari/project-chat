import React from 'react'
import { Skeleton } from '@mui/material'

const LayoutLoader = () => {
  return (
    <div className="flex h-[calc(100vh-4px)] gap-4">
      {/* Left Div - hidden on extra-small screens */}
      <div className="hidden sm:block sm:w-1/3 md:w-1/4 h-full bg-gray-100">
        <Skeleton variant="rectangular" height={"100vh"} />
      </div>

      {/* Center Div - full width on xs, grows on larger screens */}
      <div className="w-full sm:w-2/3 md:w-5/12 lg:w-1/2 h-full bg-white">
        <Skeleton variant="rectangular" />
      </div>

      {/* Right Div - hidden on small screens */}
      <div className="hidden md:block md:w-1/3 lg:w-1/2 h-full bg-gray-200 p-8">
        <Skeleton variant="rectangular" height={"100vh"} />
      </div>
    </div>
  )
}

export const TypingLoader =()=>{
  return "Loading..."
}

export default LayoutLoader