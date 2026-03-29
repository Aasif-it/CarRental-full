import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); scrollTo(0,0)}} className='group rounded-2xl overflow-hidden bg-white border border-borderColor/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full'>
      
      <div className='relative h-56 overflow-hidden'> 
        <img src={car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'/>

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

        {car.isAvaliable ? (
          <p className='absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg'>Available</p>
        ) : (
          <p className='absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg'>Booked</p>
        )}

        <div className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-xl shadow-lg border border-white/20 font-bold'>
            <span className='text-lg'>{currency}{car.pricePerDay}</span>
            <span className='text-[10px] text-gray-500 font-medium'> / day</span>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <div className='flex justify-between items-start mb-4'>
            <div>
                <h3 className='text-xl font-bold text-gray-800 group-hover:text-primary transition-colors'>{car.brand} {car.model}</h3>
                <div className='flex items-center gap-2 mt-1'>
                  {car.averageRating > 0 ? (
                    <div className='flex items-center gap-1'>
                      <div className='flex text-accent text-xs'>
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.round(car.averageRating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className='text-[11px] text-gray-400 font-medium'>({car.totalReviews} reviews)</span>
                    </div>
                  ) : (
                    <span className='text-[11px] text-gray-400 italic'>New listing</span>
                  )}
                </div>
            </div>
            <div className='bg-light p-2 rounded-lg group-hover:bg-primary/10 transition-colors'>
                <img src={assets.arrow_icon} alt="" className='w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500'/>
            </div>
        </div>

        <div className='mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-borderColor/30'>
            <div className='flex items-center text-xs text-gray-500 font-medium'>
                <div className='w-7 h-7 rounded-full bg-light flex items-center justify-center mr-2'>
                    <img src={assets.users_icon} alt="" className='h-3.5 opacity-70'/>
                </div>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-xs text-gray-500 font-medium'>
                <div className='w-7 h-7 rounded-full bg-light flex items-center justify-center mr-2'>
                    <img src={assets.fuel_icon} alt="" className='h-3.5 opacity-70'/>
                </div>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-xs text-gray-500 font-medium'>
                <div className='w-7 h-7 rounded-full bg-light flex items-center justify-center mr-2'>
                    <img src={assets.car_icon} alt="" className='h-3.5 opacity-70'/>
                </div>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-xs text-gray-500 font-medium text-ellipsis overflow-hidden whitespace-nowrap'>
                <div className='w-7 h-7 rounded-full bg-light flex items-center justify-center mr-2'>
                    <img src={assets.location_icon} alt="" className='h-3.5 opacity-70'/>
                </div>
                <span>{car.location}</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
