import React, { useEffect, useState } from 'react'
import { assets} from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const fetchMyBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReviewSubmit = async (e)=>{
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/user/add-review', {
        carId: selectedCarId,
        rating,
        comment
      })

      if (data.success){
        toast.success(data.message)
        setShowReviewModal(false)
        setRating(5)
        setComment('')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      if(!window.confirm("Are you sure you want to cancel this booking?")) return;
      
      const { data } = await axios.post('/api/bookings/cancel', { bookingId })
      if (data.success) {
        toast.success(data.message)
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    user && fetchMyBookings()
  },[user])

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

      <Title title='My Bookings'
       subTitle='View and manage your all car bookings'
       align="left"/>

       <div>
        {bookings.map((booking, index)=>(
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          
          key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            {/* Car Image + Info */}

            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
              </div>
              <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

              <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
            </div>

            {/* Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

           {/* Price */}
           <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
                <p>Booked on {booking.createdAt.split('T')[0]}</p>
              </div>

              <div className='flex flex-col gap-2'>
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => {
                      setSelectedCarId(booking.car._id)
                      setShowReviewModal(true)
                    }}
                    className='bg-primary text-white py-2 rounded mt-2 cursor-pointer hover:bg-primary-dull transition-all text-xs font-medium'
                  >
                    Rate & Feedback
                  </button>
                )}

                {booking.status === 'pending' && (
                  <button 
                    onClick={() => cancelBooking(booking._id)}
                    className='bg-red-50 text-red-600 border border-red-100 py-2 rounded mt-2 cursor-pointer hover:bg-red-100 transition-all text-xs font-medium'
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
           </div>


          </motion.div>
        ))}
       </div>

       {showReviewModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-white p-6 rounded-xl max-w-md w-full shadow-2xl border border-borderColor'
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold'>Car Feedback</h2>
              <button onClick={() => setShowReviewModal(false)} className='text-gray-400 hover:text-black cursor-pointer'>
                <img src={assets.close_icon} alt="close" className='w-4 h-4' />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Rating (1 to 5)</label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      className={`text-2xl cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Your Feedback</label>
                <textarea 
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this car..."
                  className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-gray-600'
                ></textarea>
              </div>

              <button 
                type='submit'
                className='w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary-dull transition-all shadow-md'
              >
                Submit Feedback
              </button>
            </form>
          </motion.div>
        </div>
       )}
      
    </motion.div>
  )
}

export default MyBookings
