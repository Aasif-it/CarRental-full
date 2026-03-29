import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const Navbar = () => {

    const {setShowLogin, user, logout, isOwner, axios, setIsOwner, fetchUser} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [name, setName] = useState('')
    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/cars?query=${searchQuery.trim()}`)
            setSearchQuery('')
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', name)
            if (image) formData.append('image', image)

            const { data } = await axios.post('/api/user/update-profile', formData)
            if (data.success) {
                toast.success(data.message)
                fetchUser()
                setShowProfileModal(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const openProfile = () => {
        setName(user.name)
        setShowProfileModal(true)
    }

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                toast.success(data.message)
                await fetchUser() // Refresh user data to get updated role
                navigate('/owner')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <motion.div 
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor sticky top-0 z-[100] transition-all ${location.pathname === "/" ? "glass" : "bg-white"}`}>

        <Link to='/'>
            <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="logo" className="h-8"/>
        </Link>

        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
            {menuLinks.map((link, index)=> (
                <Link onClick={()=>setOpen(false)} key={index} to={link.path}>
                    {link.name}
                </Link>
            ))}

            <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                <input 
                    onKeyDown={handleSearch}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text" 
                    className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
                    placeholder="Search cars"
                />
                <img onClick={() => { if(searchQuery.trim()) { navigate(`/cars?query=${searchQuery.trim()}`); setSearchQuery('') } }} src={assets.search_icon} alt="search" className='cursor-pointer' />
            </div>

            <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
 
                {user && (
                    <div className='flex items-center gap-4 max-sm:flex-col max-sm:items-start'>
                        <button onClick={openProfile} className='flex items-center gap-2 cursor-pointer group'>
                            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20'>
                                {user.image ? <img src={user.image} alt="" className='w-full h-full object-cover'/> : <span className='text-xs font-bold text-primary'>{user.name[0]}</span>}
                            </div>
                        </button>
                        
                        {isOwner ? 
                            <button onClick={()=> navigate('/owner')} className="cursor-pointer text-sm font-medium">Dashboard</button> : 
                            (user.email === import.meta.env.VITE_ADMIN_EMAIL && <button onClick={changeRole} className="cursor-pointer text-sm font-medium">List cars</button>)
                        }
                    </div>
                )}

                <button onClick={()=> {user ? logout() : setShowLogin(true)}} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">{user ? 'Logout' : 'Login'}</button>
            </div>
        </div>

        {/* Profile Edit Modal */}
        {showProfileModal && (
            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4'>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-borderColor'
                >
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-bold text-gray-800'>Edit Profile</h2>
                        <button onClick={() => setShowProfileModal(false)} className='text-gray-400 hover:text-black cursor-pointer transition-colors'>
                            <img src={assets.close_icon} alt="close" className='w-4 h-4' />
                        </button>
                    </div>

                    <form onSubmit={updateProfile} className='space-y-6'>
                        <div className='flex flex-col items-center gap-4'>
                            <label htmlFor="profile-image" className='relative cursor-pointer group'>
                                <div className='w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all'>
                                    {image ? (
                                        <img src={URL.createObjectURL(image)} alt="" className='w-full h-full object-cover' />
                                    ) : user.image ? (
                                        <img src={user.image} alt="" className='w-full h-full object-cover' />
                                    ) : (
                                        <span className='text-3xl font-bold text-gray-300'>{user.name[0]}</span>
                                    )}
                                    <div className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <img src={assets.edit_icon} alt="" className='w-6 h-6 brightness-200'/>
                                    </div>
                                </div>
                                <input type="file" id="profile-image" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                            <p className='text-xs text-gray-400'>Click to change profile picture</p>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                            <input 
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='w-full px-4 py-2.5 border border-borderColor rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-600'
                                placeholder="Your Name"
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            type='submit'
                            className='w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dull transition-all shadow-lg shadow-primary/20 disabled:bg-gray-400'
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}

        <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      
    </motion.div>
  )
}

export default Navbar
