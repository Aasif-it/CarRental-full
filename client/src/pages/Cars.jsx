import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, cityList } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { Helmet } from 'react-helmet-async'

import { useLocation } from 'react-router-dom'

const Cars = () => {

  const {cars, axios, setPickupLocation, setPickupDate, setReturnDate} = useAppContext()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const query = searchParams.get('query')

  const [input, setInput] = useState(query || '')
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedFuel, setSelectedFuel] = useState([])
  const [selectedTransmission, setSelectedTransmission] = useState([])
  const [priceRange, setPriceRange] = useState(50000) 
  const [isLoading, setIsLoading] = useState(true)

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  // Sync with context if needed for other pages
  useEffect(() => {
    if (isSearchData) {
      setPickupLocation(pickupLocation)
      setPickupDate(pickupDate)
      setReturnDate(returnDate)
    }
  }, [pickupLocation, pickupDate, returnDate])

  useEffect(() => {
    if (query) {
      setInput(query)
    }
  }, [query])

  const toggleCategory = (category) => {
    setSelectedCategory(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const toggleFuel = (fuel) => {
    setSelectedFuel(prev => 
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    )
  }

  const toggleTransmission = (transmission) => {
    setSelectedTransmission(prev => 
      prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]
    )
  }

  const applyFilter = async ()=>{
    setIsLoading(true)
    let filtered = cars.slice()

    if(input !== ''){
      filtered = filtered.filter((car)=>{
        return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())  
        || car.category.toLowerCase().includes(input.toLowerCase())  
        || car.transmission.toLowerCase().includes(input.toLowerCase())
        || car.location.toLowerCase().includes(input.toLowerCase())
      })
    }

    if(selectedCategory.length > 0){
      filtered = filtered.filter(car => selectedCategory.includes(car.category))
    }

    if(selectedFuel.length > 0){
      filtered = filtered.filter(car => selectedFuel.includes(car.fuel_type))
    }

    if(selectedTransmission.length > 0){
      filtered = filtered.filter(car => selectedTransmission.includes(car.transmission))
    }

    filtered = filtered.filter(car => car.pricePerDay <= priceRange)

    setFilteredCars(filtered)
    setTimeout(() => setIsLoading(false), 500) 
  }

  const searchCarAvailablity = async () =>{
    setIsLoading(true)
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
    if (data.success) {
      setFilteredCars(data.availableCars)
      if(data.availableCars.length === 0){
        toast('No cars available')
      }
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    isSearchData && searchCarAvailablity()
  },[])

  useEffect(()=>{
    if(cars.length > 0){
       if(!isSearchData) {
         applyFilter()
       } else {
         setIsLoading(false)
       }
    }
  },[input, cars, selectedCategory, selectedFuel, selectedTransmission, priceRange])

  const CarSkeleton = () => (
    <div className='bg-white rounded-xl overflow-hidden border border-borderColor shadow-sm animate-pulse'>
      <div className='bg-gray-200 h-48 w-full'></div>
      <div className='p-5 space-y-4'>
        <div className='flex justify-between items-start'>
          <div className='h-5 bg-gray-200 rounded w-1/2'></div>
          <div className='h-5 bg-gray-200 rounded w-1/4'></div>
        </div>
        <div className='h-4 bg-gray-100 rounded w-3/4'></div>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='h-4 bg-gray-50 rounded'></div>
          <div className='h-4 bg-gray-50 rounded'></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-light/30 pb-20'>
      <Helmet>
        <title>Available Cars | CarRental</title>
        <meta name="description" content="Browse our wide range of luxury cars available for rent. Filter by category, fuel, and price to find your perfect match." />
      </Helmet>

      {/* Header Section */}

      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' className='w-full h-full outline-none text-gray-500'/>

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 flex flex-col lg:flex-row gap-10'>
        
        {/* Filter Sidebar */}
        <div className='min-w-60 bg-white p-6 rounded-xl border border-borderColor shadow-sm h-max lg:sticky lg:top-20'>
          <h2 className='text-lg font-semibold mb-6 flex items-center gap-2'>
            <img src={assets.filter_icon} alt="" className='w-4 h-4'/> Filters
          </h2>

          {/* Category Filter */}
          <div className='mb-8'>
            <p className='text-sm font-medium text-gray-700 mb-3'>CATEGORY</p>
            <div className='space-y-2'>
              {['Sedan', 'SUV', 'Van'].map(cat => (
                <label key={cat} className='flex items-center gap-2 text-gray-500 cursor-pointer hover:text-primary transition-colors'>
                  <input type="checkbox" checked={selectedCategory.includes(cat)} onChange={() => toggleCategory(cat)} className='w-4 h-4 rounded border-borderColor text-primary focus:ring-primary'/>
                  <span className='text-sm'>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type Filter */}
          <div className='mb-8'>
            <p className='text-sm font-medium text-gray-700 mb-3'>FUEL TYPE</p>
            <div className='space-y-2'>
              {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                <label key={fuel} className='flex items-center gap-2 text-gray-500 cursor-pointer hover:text-primary transition-colors'>
                  <input type="checkbox" checked={selectedFuel.includes(fuel)} onChange={() => toggleFuel(fuel)} className='w-4 h-4 rounded border-borderColor text-primary focus:ring-primary'/>
                  <span className='text-sm'>{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className='mb-6'>
            <p className='text-sm font-medium text-gray-700 mb-3'>TRANSMISSION</p>
            <div className='space-y-2'>
              {['Automatic', 'Manual', 'Semi-Automatic'].map(trans => (
                <label key={trans} className='flex items-center gap-2 text-gray-500 cursor-pointer hover:text-primary transition-colors'>
                  <input type="checkbox" checked={selectedTransmission.includes(trans)} onChange={() => toggleTransmission(trans)} className='w-4 h-4 rounded border-borderColor text-primary focus:ring-primary'/>
                  <span className='text-sm'>{trans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-3'>
              <p className='text-sm font-medium text-gray-700'>PRICE RANGE</p>
              <p className='text-xs font-bold text-primary'>₹{priceRange}</p>
            </div>
            <input 
              type="range" 
              min="500" 
              max="50000" 
              step="500"
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
            />
            <div className='flex justify-between mt-2 text-[10px] text-gray-400 font-bold'>
              <span>₹500</span>
              <span>₹50,000</span>
            </div>
          </div>

          <button onClick={() => {
            setSelectedCategory([])
            setSelectedFuel([])
            setSelectedTransmission([])
            setPriceRange(50000)
            setInput('')
          }} className='w-full py-2 text-xs font-medium text-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors'>
            Clear All Filters
          </button>
        </div>

        {/* Cars Listing */}
        <div className='flex-1'>
          <p className='text-gray-500 xl:px-2 max-w-7xl mx-auto mb-4'>Showing {filteredCars.length} Cars</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto'>
            {isLoading ? (
              [...Array(6)].map((_, i) => <CarSkeleton key={i} />)
            ) : (
              filteredCars.map((car, index)=> (
                <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <CarCard car={car}/>
                </motion.div>
              ))
            )}
          </div>
          
          {!isLoading && filteredCars.length === 0 && (
            <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-borderColor'>
              <img src={assets.search_icon} alt="" className='w-10 h-10 opacity-20 mb-4'/>
              <p className='text-gray-400'>No cars match your current filters</p>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  )
}

export default Cars
