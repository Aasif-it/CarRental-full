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

// Security & Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json());

// Health Check (Always reachable even if DB is slow)
app.get('/', (req, res)=> res.send("Server is running"))
app.get('/health', (req, res)=> res.json({ success: true, message: "Backend is healthy" }))

// Routes
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// Connect Database (Async)
connectDB();

// Error Handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))