import express from "express";
import { addReview, getCarReviews, getCars, getUserData, loginUser, registerUser, sendContact, subscribeNewsletter, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { loginValidation, registerValidation, reviewValidation } from "../middleware/validationMiddleware.js";

const userRouter = express.Router();

userRouter.post('/register', registerValidation, registerUser)
userRouter.post('/login', loginValidation, loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)

userRouter.post('/contact', sendContact)
userRouter.post('/subscribe', subscribeNewsletter)
userRouter.post('/add-review', protect, reviewValidation, addReview)
userRouter.get('/reviews/:carId', getCarReviews)
userRouter.get('/all-reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name image').populate('car', 'brand model location').sort({createdAt: -1}).limit(6)
        res.json({success: true, reviews})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
})

userRouter.post('/update-profile', protect, upload.single('image'), updateProfile)

export default userRouter;