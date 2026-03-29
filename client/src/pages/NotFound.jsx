import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const NotFound = () => {
  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-6 text-center'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-9xl font-bold text-primary opacity-20'>404</h1>
        <div className='-mt-20 relative z-10'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Oops! Page Not Found</h2>
          <p className='text-gray-500 max-w-md mx-auto mb-8'>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className='inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dull transition-all shadow-lg shadow-primary/30'
          >
            Go Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
