import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import CarCard from '../components/CarCard'
import { Helmet } from 'react-helmet-async'

const CarDetails = () => {
  const { id } = useParams()
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedCars, setRelatedCars] = useState([])
  const currency = import.meta.env.VITE_CURRENCY

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/user/reviews/${id}`)
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(()=>{
    const currentCar = cars.find(car => car._id === id)
    setCar(currentCar)
    if(currentCar) {
      const related = cars.filter(c => c.category === currentCar.category && c._id !== id).slice(0, 3)
      setRelatedCars(related)
    }
    fetchReviews()
    window.scrollTo(0,0)
  },[cars, id])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be after pickup date")
      return
    }
    try {
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate, 
        returnDate
      })

      if (data.success){
        toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <Helmet>
        <title>{`${car.brand} ${car.model} | CarRental`}</title>
        <meta name="description" content={`Rent the ${car.brand} ${car.model} (${car.year}) for only ${currency}${car.pricePerDay} per day. Check availability and book now.`} />
      </Helmet>
      
       <div className='flex flex-col lg:flex-row gap-12'>
          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
              <motion.div className='space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <div className='flex items-center gap-2'>
                    <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                    {reviews.length > 0 && (
                      <div className='flex items-center gap-1 text-yellow-500'>
                        <span className='text-lg font-bold'>★</span>
                        <span className='text-gray-700 font-medium'>
                          {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                        </span>
                        <span className='text-gray-400 text-sm'>({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.location},
                    {icon: assets.car_icon, text: `${car.quantity} Available`},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                      <img src={icon} alt="" className='h-5 mb-2'/>
                      {text}
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500'>{car.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h1 className='text-xl font-medium mb-3'>Features</h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    {
                      ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item)=>(
                        <li key={item} className='flex items-center text-gray-500'>
                          <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                  <div className='mt-10'>
                    <h1 className='text-xl font-medium mb-4'>Customer Reviews</h1>
                    <div className='space-y-6'>
                      {reviews.map((review) => (
                        <div key={review._id} className='border-b border-borderColor pb-6'>
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                              {review.user.image ? (
                                <img src={review.user.image} alt="" className='w-full h-full object-cover' />
                              ) : (
                                <span className='text-lg font-bold text-gray-400'>{review.user.name[0]}</span>
                              )}
                            </div>
                            <div>
                              <p className='font-medium'>{review.user.name}</p>
                              <div className='flex text-yellow-400 text-sm'>
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                ))}
                              </div>
                            </div>
                            <p className='text-xs text-gray-400 ml-auto'>{review.createdAt.split('T')[0]}</p>
                          </div>
                          <p className='text-gray-500 text-sm leading-relaxed'>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

            <div className='flex flex-col gap-2'>
              <label htmlFor="pickup-date">Pickup Date</label>
              <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="return-date">Return Date</label>
              <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)}
              type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date'/>
            </div>

            <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>Book Now</button>

            <p className='text-center text-sm'>No credit card required to reserve</p>

          </motion.form>
       </div>

       {/* Related Cars Section */}
       {relatedCars.length > 0 && (
         <div className='mt-24 mb-20'>
           <div className='flex items-center justify-between mb-8'>
             <h1 className='text-2xl font-bold'>You might also like</h1>
             <button onClick={() => {navigate('/cars'); window.scrollTo(0,0)}} className='text-primary font-medium hover:underline cursor-pointer'>View all</button>
           </div>
           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
             {relatedCars.map((relatedCar) => (
               <CarCard key={relatedCar._id} car={relatedCar} />
             ))}
           </div>
         </div>
       )}

    </div>
  ) : <Loader />
}

export default CarDetails
