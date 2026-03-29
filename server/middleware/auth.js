import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "not authorized"})
        }
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.json({success: false, message: "not authorized"})
        }
        req.user = user;
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}

export const isAdmin = async (req, res, next)=>{
    try {
        const {user} = req;
        if(user.email !== process.env.ADMIN_EMAIL){
            return res.json({success: false, message: "Unauthorized access. Only admin can access this."})
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}