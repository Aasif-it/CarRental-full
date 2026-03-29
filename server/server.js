import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Initialize Express App
const app = express()

// Security Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
app.use(morgan('dev'));

// Connect Database
await connectDB()

// Middleware
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// Error Handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))