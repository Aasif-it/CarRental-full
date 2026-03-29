import React, { useEffect, useState } from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const {axios, isOwner, currency, user} = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
      completedBookings: 0,
      latestBookings: [],
      monthlyRevenue: 0,
    })

  const dashboardCards = [
    {title: "Total Cars", value: data.totalCars, icon: assets.carIconColored, bgColor: 'bg-blue-50'},
    {title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored, bgColor: 'bg-purple-50'},
    {title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored, bgColor: 'bg-orange-50'},
    {title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored, bgColor: 'bg-green-50'},
  ]

  const fetchDashboardData = async ()=>{
    try {
       const { data } = await axios.get('/api/owner/dashboard')
       if (data.success){
        setData(data.dashboardData)
       }else{
        toast.error(data.message)
       }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(()=>{
    if(isOwner || user?.email === import.meta.env.VITE_ADMIN_EMAIL){
      fetchDashboardData()
    }
  },[isOwner, user])

  return (
    <div className='p-4 sm:p-6 w-full'>
      <div className='flex flex-wrap gap-4 items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center'>
            <img src={user?.image || dummyUserData.image} alt="" className='h-8 w-8 rounded-full border border-primary/20 object-cover'/>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Admin Dashboard</h1>
            <p className='text-xs text-gray-500'>Welcome back, {user?.name}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
        {dashboardCards.map((card, index)=>(
          <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-white shadow-sm hover:shadow-md transition-shadow'>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${card.bgColor}`}>
              <img src={card.icon} alt="" className='h-4 w-4'/>
            </div>
          </div>
        ))}
      </div>


      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        <div className='bg-white border border-borderColor rounded-md overflow-hidden w-full lg:max-w-[calc(100%-350px)]'>
          <div className='flex items-center gap-2.5 px-4 py-4 bg-light/50 border-b border-borderColor'>
            <img src={assets.listIconColored} alt="" className='h-5 w-5'/>
            <p className='font-semibold'>Latest Bookings</p>
          </div>

          <div className='overflow-x-auto custom-scrollbar'>
            <div className='min-w-[600px]'>
              {data.latestBookings.map((booking, index)=>(
                <div key={index} className='flex items-center justify-between px-6 py-4 border-b border-borderColor last:border-0 hover:bg-light/30 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <img src={booking.car.image} alt="" className='h-10 w-10 rounded-md object-cover border border-borderColor'/>
                    <div>
                      <p className='text-sm font-bold text-gray-800'>{booking.car.brand} {booking.car.model}</p>
                      <p className='text-[10px] text-gray-400'>ID: {booking._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className='text-center'>
                    <p className='text-sm font-medium text-gray-700'>{booking.user.name}</p>
                    <p className='text-[10px] text-gray-400'>{booking.user.email}</p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-sm font-bold text-primary'>{currency}{booking.price}</p>
                      <p className='text-[10px] text-gray-400'>{booking.pickupDate.split('T')[0]}</p>
                    </div>
                    <p className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' : 
                      booking.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* monthly revenue */}
        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full lg:max-w-xs bg-white'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue}</p>
          
          {/* Simple Visual Chart (CSS Based) */}
          <div className='flex items-end gap-2 h-20 mt-8'>
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className='flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-all' style={{height: `${h}%`}}></div>
            ))}
          </div>
          <div className='flex justify-between mt-2 text-[10px] text-gray-400 font-medium uppercase'>
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
        
      </div>


    </div>
  )
}

export default Dashboard
