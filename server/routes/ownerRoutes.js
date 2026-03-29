import express from "express";
import { isAdmin, protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getAllCustomers, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", upload.single("image"), protect, isAdmin, addCar)
ownerRouter.get("/cars", protect, isAdmin, getOwnerCars)
ownerRouter.post("/toggle-car", protect, isAdmin, toggleCarAvailability)
ownerRouter.post("/delete-car", protect, isAdmin, deleteCar)

ownerRouter.get('/dashboard', protect, isAdmin, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), protect, isAdmin, updateUserImage)
ownerRouter.get('/customers', protect, isAdmin, getAllCustomers)

export default ownerRouter;