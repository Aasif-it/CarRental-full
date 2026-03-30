import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import { sendContactNotification, sendNewsletterNotification } from "../configs/nodemailer.js";


// API for Contact Form Submission
export const sendContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Send notification to admin
        await sendContactNotification({ name, email, subject, message });

        res.json({ success: true, message: "Message Sent! Our team will contact you soon." });
    } catch (error) {
        next(error);
    }
}

// API for Newsletter Subscription
export const subscribeNewsletter = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        // Send notification to admin
        await sendNewsletterNotification(email);

        res.json({ success: true, message: "Subscribed Successfully!" });
    } catch (error) {
        next(error);
    }
}

// API to Add Review
export const addReview = async (req, res, next)=>{
    try {
        const {_id} = req.user;
        const {carId, rating, comment} = req.body;

        // Check if user has already reviewed this car
        const existingReview = await Review.findOne({car: carId, user: _id})
        if(existingReview){
            return res.json({success: false, message: "You have already reviewed this car"})
        }

        // Check if user has booked this car before
        const booking = await Booking.findOne({car: carId, user: _id, status: 'confirmed'})
        if(!booking){
            return res.json({success: false, message: "You can only review cars you have successfully booked"})
        }

        await Review.create({car: carId, user: _id, rating, comment})
        res.json({success: true, message: "Review Added"})

    } catch (error) {
        next(error)
    }
}

// API to Get Car Reviews
export const getCarReviews = async (req, res)=>{
    try {
        const {carId} = req.params;
        const reviews = await Review.find({car: carId}).populate('user', 'name image').sort({createdAt: -1})
        res.json({success: true, reviews})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
export const registerUser = async (req, res, next)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        next(error)
    }
}

// Login User 
export const loginUser = async (req, res, next)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        next(error)
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const { name } = req.body;
        const imageFile = req.file;

        let updateData = { name };

        if (imageFile) {
            const imagekit = (await import('../configs/imageKit.js')).default;
            
            const response = await imagekit.upload({
                file: imageFile.buffer, // Use buffer
                fileName: imageFile.originalname,
                folder: '/users'
            });

            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { width: '400' },
                    { quality: 'auto' },
                    { format: 'webp' }
                ]
            });
            updateData.image = optimizedImageUrl;
        }

        const user = await User.findByIdAndUpdate(_id, updateData, { new: true }).select("-password");
        res.json({ success: true, message: "Profile Updated", user });

    } catch (error) {
        console.log("Update Profile Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        
        // Fetch reviews count and average rating for each car
        const carsWithRatings = await Promise.all(cars.map(async (car) => {
            const reviews = await Review.find({ car: car._id })
            const totalReviews = reviews.length
            const averageRating = totalReviews > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
                : 0
            
            return {
                ...car._doc,
                totalReviews,
                averageRating: Number(averageRating)
            }
        }))

        res.json({success: true, cars: carsWithRatings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}