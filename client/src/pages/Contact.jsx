import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import { Helmet } from 'react-helmet-async'

const Contact = () => {
  const { axios } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/user/contact', formData)
      if (data.success) {
        toast.success(data.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-16'>
      <Helmet>
        <title>Contact Us | CarRental</title>
        <meta name="description" content="Get in touch with us for any inquiries about our luxury car rental services. Our team is here to help you." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center max-w-3xl mx-auto mb-16'
      >
        <h1 className='text-4xl font-bold mb-4'>Contact <span className='text-gradient'>Us</span></h1>
        <p className='text-gray-500'>Have questions about our luxury car rentals? We're here to help you drive your dreams.</p>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto'>
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='space-y-10'
        >
          <div className='flex gap-6 items-start'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0'>
              <img src={assets.location_icon} alt="" className='w-6 h-6'/>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2'>Our Location</h3>
              <p className='text-gray-500'>123 Luxury Lane, High Street<br/>Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div className='flex gap-6 items-start'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0'>
              <img src={assets.users_icon} alt="" className='w-6 h-6'/>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2'>Phone & Email</h3>
              <p className='text-gray-500'>+91 98765 43210<br/>support@carrental.com</p>
            </div>
          </div>

          <div className='p-8 rounded-3xl bg-light border border-borderColor/50 relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700'></div>
            <h3 className='text-xl font-bold mb-4'>Business Hours</h3>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Monday - Friday</span>
                <span className='font-bold'>09:00 AM - 08:00 PM</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Saturday</span>
                <span className='font-bold'>10:00 AM - 06:00 PM</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Sunday</span>
                <span className='font-bold text-primary'>Closed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/5 border border-borderColor/50'
        >
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-sm font-bold text-gray-700 ml-1'>Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className='w-full px-4 py-3 rounded-xl border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-light/50'
                  placeholder='John Doe'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-bold text-gray-700 ml-1'>Email ID</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className='w-full px-4 py-3 rounded-xl border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-light/50'
                  placeholder='john@example.com'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 ml-1'>Subject</label>
              <input 
                required
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className='w-full px-4 py-3 rounded-xl border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-light/50'
                placeholder='How can we help you?'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 ml-1'>Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className='w-full px-4 py-3 rounded-xl border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-light/50 resize-none'
                placeholder='Type your message here...'
              ></textarea>
            </div>

            <button 
              disabled={isLoading}
              className='w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dull transition-all shadow-lg shadow-primary/30 disabled:bg-gray-400 cursor-pointer'
            >
              {isLoading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
