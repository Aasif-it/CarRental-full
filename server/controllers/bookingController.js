import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import User from "../models/User.js";
import { sendBookingEmail, sendBookingStatusEmail } from "../configs/nodemailer.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (carId, pickupDate, returnDate)=>{
    const car = await Car.findById(carId)
    if(!car) return false;

    const bookings = await Booking.find({
        car: carId,
        status: { $ne: 'cancelled' },
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    
    // If active bookings are less than total quantity, car is available
    return bookings.length < (car.quantity || 1);
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        // Date Validation
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (pickup < today) {
            return res.json({ success: false, message: "Pickup date cannot be in the past" });
        }

        if (returnD <= pickup) {
            return res.json({ success: false, message: "Return date must be after pickup date" });
        }

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        const carData = await Car.findById(car)

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        // Fetch User Data for Email
        const userData = await User.findById(_id)

        // Send confirmation email in background
        sendBookingEmail(userData.email, userData.name, {
            carName: `${carData.brand} ${carData.model}`,
            pickupDate,
            returnDate,
            price
        })

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Change Status of Booking
export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate('user', 'name email').populate('car', 'brand model');

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Send status update email to user
        if (status === 'confirmed' || status === 'cancelled') {
            sendBookingStatusEmail(booking.user.email, booking.user.name, {
                carName: `${booking.car.brand} ${booking.car.model}`,
                status,
                pickupDate: booking.pickupDate,
                returnDate: booking.returnDate
            });
        }

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Cancel Booking (User)
export const cancelUserBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (booking.status !== 'pending') {
            return res.json({ success: false, message: "Only pending bookings can be cancelled" });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, message: "Booking Cancelled Successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}