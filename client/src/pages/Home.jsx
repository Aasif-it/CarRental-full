import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import { Helmet } from 'react-helmet-async'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>CarRental | Premium Luxury Car Rentals</title>
        <meta name="description" content="Experience the ultimate in luxury and comfort with our curated fleet of world-class vehicles. Rent your dream car today." />
      </Helmet>
      <Hero />
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </>
  )
}

export default Home
