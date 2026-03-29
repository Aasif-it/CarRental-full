import React from 'react'
import { motion } from 'motion/react'

const Loader = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[70vh] gap-4'>
        <div className='relative'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary/10 border-t-primary'></div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className='absolute inset-0 flex items-center justify-center'
          >
            <div className='h-2 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(93,95,239,0.5)]'></div>
          </motion.div>
        </div>
        <p className='text-sm font-medium text-gray-400 tracking-widest uppercase animate-pulse'>Loading Experience...</p>
    </div>
  )
}

export default Loader
