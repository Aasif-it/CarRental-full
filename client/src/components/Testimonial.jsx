import React, { useEffect, useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

const Testimonial = () => {

    const { axios } = useAppContext()
    const [reviews, setReviews] = useState([])

    const fetchAllReviews = async () => {
      try {
        const { data } = await axios.get('/api/user/all-reviews')
        if (data.success) {
          setReviews(data.reviews)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    useEffect(() => {
      fetchAllReviews()
    }, [])

    const defaultTestimonials = [
        { name: "Emma Rodriguez", 
          location: "Barcelona, Spain", 
          image: assets.testimonial_image_1, 
          testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional." 
        },
        { name: "John Smith", 
          location: "New York, USA", 
          image: assets.testimonial_image_2, 
          testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!" 
        },
        { name: "Ava Johnson", 
          location: "Sydney, Australia", 
          image: assets.testimonial_image_1, 
          testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service." 
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            
           <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."/>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {reviews.length > 0 ? reviews.map((review, index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                    
                    key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">

                        <div className="flex items-center gap-3">
                            <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                              {review.user.image ? (
                                <img src={review.user.image} alt="" className='w-full h-full object-cover' />
                              ) : (
                                <span className='text-lg font-bold text-gray-400'>{review.user.name[0]}</span>
                              )}
                            </div>
                            <div>
                                <p className="text-xl">{review.user.name}</p>
                                <p className="text-gray-500">{review.car.brand} {review.car.model} • {review.car.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src={assets.star_icon} alt="star-icon" className={i < review.rating ? '' : 'grayscale opacity-30'} />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light italic">"{review.comment}"</p>
                    </motion.div>
                )) : defaultTestimonials.map((testimonial, index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                    
                    key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">

                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star-icon" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light italic">"{testimonial.testimonial}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
