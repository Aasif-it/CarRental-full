import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'

const Hero = () => {

    const {pickupLocation, setPickupLocation, pickupDate, setPickupDate, returnDate, setReturnDate, navigate} = useAppContext()

    const handleSearch = (e)=>{
        e.preventDefault()
        if (new Date(returnDate) <= new Date(pickupDate)) {
            toast.error("Return date must be after pickup date")
            return
        }
        navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
    }

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className='min-h-screen flex flex-col items-center justify-center gap-14 bg-light text-center relative overflow-hidden px-6 pt-20'>
        
        {/* Background Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
            <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]'></div>
        </div>

        <div className='max-w-4xl mx-auto'>
            <motion.h1 initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            className='text-5xl md:text-7xl font-bold leading-tight'>
                Drive Your <span className='text-gradient'>Dreams</span> <br/> 
                With Premium Style
            </motion.h1>
            
            <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className='text-gray-500 text-lg md:text-xl mt-6 max-w-2xl mx-auto'>
                Experience the ultimate in luxury and comfort with our curated fleet of world-class vehicles.
            </motion.p>
        </div>
      
      <motion.form
      initial={{ scale: 0.95, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}

       onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-2 rounded-2xl md:rounded-full w-full max-w-80 md:max-w-4xl bg-white shadow-[0px_15px_50px_rgba(0,0,0,0.08)] border border-borderColor/50'>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-6 w-full px-6 py-4 md:py-0'>
            <div className='flex flex-col items-start gap-1 flex-1 w-full'>
                <label className='text-[10px] font-bold text-primary uppercase tracking-wider ml-1'>Location</label>
                <select required value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)} className='w-full outline-none text-gray-700 font-medium bg-transparent cursor-pointer'>
                    <option value="">Select Location</option>
                    {cityList.map((city)=> <option key={city} value={city}>{city}</option>)}
                </select>
            </div>
            
            <div className='w-px h-10 bg-borderColor hidden md:block'></div>

            <div className='flex flex-col items-start gap-1 flex-1 w-full'>
                <label className='text-[10px] font-bold text-primary uppercase tracking-wider ml-1' htmlFor='pickup-date'>Pick-up</label>
                <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='w-full outline-none text-gray-700 font-medium bg-transparent cursor-pointer' required/>
            </div>

            <div className='w-px h-10 bg-borderColor hidden md:block'></div>

            <div className='flex flex-col items-start gap-1 flex-1 w-full'>
                <label className='text-[10px] font-bold text-primary uppercase tracking-wider ml-1' htmlFor='return-date'>Return</label>
                <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id="return-date" className='w-full outline-none text-gray-700 font-medium bg-transparent cursor-pointer' required/>
            </div>
            
        </div>
            <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex items-center justify-center gap-2 px-10 py-4 w-full md:w-auto bg-primary hover:bg-primary-dull text-white rounded-xl md:rounded-full cursor-pointer shadow-lg shadow-primary/30 transition-all font-semibold'>
                <img src={assets.search_icon} alt="search" className='brightness-300 w-4 h-4'/>
                Find Cars
            </motion.button>
      </motion.form>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.8, delay: 0.6 }}
       className='relative w-full max-w-5xl mt-10'
      >
        <div className='absolute inset-0 bg-gradient-to-t from-light via-transparent to-transparent z-10'></div>
        <img src={assets.main_car} alt="car" className='w-full h-auto object-contain'/>
      </motion.div>
    </motion.div>
  )
}

export default Hero
