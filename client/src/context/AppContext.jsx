import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

let backendUrl = import.meta.env.VITE_BASE_URL

if (!backendUrl) {
    console.error("VITE_BASE_URL is not defined! Please set it in your environment variables.")
} else {
    // Remove trailing slash if present to avoid // in URLs
    backendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
}

axios.defaults.baseURL = backendUrl

// Axios Interceptor for Global Error Handling
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.message === 'Network Error') {
            toast.error("Network Error: Cannot connect to server. Please check if backend is running.")
        } else if (error.response?.status === 401) {
            // Handle unauthorized globally if needed
        }
        return Promise.reject(error)
    }
)

export const AppContext = createContext();

export const AppProvider = ({ children })=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupLocation, setPickupLocation] = useState('')
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [cars, setCars] = useState([])

    // Function to check if user is logged in
    const fetchUser = async ()=>{
        try {
           const {data} = await axios.get('/api/user/data')
           if (data.success) {
            setUser(data.user)
            // Simplified check: If email matches admin, treat as owner for UI
            const isAdminEmail = data.user.email === import.meta.env.VITE_ADMIN_EMAIL;
            setIsOwner(isAdminEmail)
           }else{
            navigate('/')
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to fetch all cars from the server

    const fetchCars = async () =>{
        try {
            const {data} = await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to log out the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }


    // useEffect to retrieve the token from localStorage
    useEffect(()=>{
        const token = localStorage.getItem('token')
        setToken(token)
        fetchCars()
    },[])

    // useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        }
    },[token])

    const value = {
        navigate, currency, axios, user, setUser,
        token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, 
        pickupLocation, setPickupLocation, pickupDate, setPickupDate, returnDate, setReturnDate
    }

    return (
    <AppContext.Provider value={value}>
        { children }
    </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}