import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'
import Loader from '../../components/Loader'

const ManageCustomers = () => {
  const { axios } = useAppContext()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('/api/owner/customers')
      if (data.success) {
        setCustomers(data.customers)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  if (isLoading) return <Loader />

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='p-6'
    >
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold text-gray-800'>Customer Management</h1>
        <p className='bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold'>
          Total Users: {customers.length}
        </p>
      </div>

      <div className='bg-white rounded-2xl border border-borderColor overflow-hidden shadow-sm'>
        <div className='overflow-x-auto custom-scrollbar'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-light text-gray-600 text-sm uppercase font-bold'>
              <tr>
                <th className='p-4'>User</th>
                <th className='p-4'>Email</th>
                <th className='p-4'>Joined On</th>
                <th className='p-4'>User ID</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-borderColor'>
              {customers.map((customer) => (
                <tr key={customer._id} className='hover:bg-light/50 transition-colors'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20'>
                        {customer.image ? (
                          <img src={customer.image} alt="" className='w-full h-full object-cover' />
                        ) : (
                          <span className='text-sm font-bold text-primary'>{customer.name[0]}</span>
                        )}
                      </div>
                      <span className='font-medium text-gray-800'>{customer.name}</span>
                    </div>
                  </td>
                  <td className='p-4 text-gray-600 text-sm'>{customer.email}</td>
                  <td className='p-4 text-gray-600 text-sm'>
                    {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className='p-4 text-xs font-mono text-gray-400'>{customer._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className='p-20 text-center flex flex-col items-center gap-4'>
            <p className='text-gray-400'>No customers found in the database.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ManageCustomers
