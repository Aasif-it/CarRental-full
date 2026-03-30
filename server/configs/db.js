import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in environment variables!");
            process.exit(1);
        }
        
        mongoose.connection.on('connected', ()=> console.log("Database Connected Successfully"));
        mongoose.connection.on('error', (err)=> console.error("Database Connection Error:", err.message));
        
        let uri = process.env.MONGODB_URI.replace(/['"]/g, '').trim();
        
        // If URI doesn't have a trailing slash before query params, add it
        if (uri.includes('?') && !uri.includes('/?')) {
            uri = uri.replace('?', '/?');
        } else if (!uri.includes('/', 10)) { // 10 is after mongodb+srv://
            uri = uri + '/';
        }

        // Log masked URI for debugging
        const maskedUri = uri.replace(/\/\/.*:.*@/, "//****:****@");
        console.log("Attempting to connect to MongoDB:", maskedUri);
        
        await mongoose.connect(uri, {
            dbName: 'car-rental',
            serverSelectionTimeoutMS: 10000, 
            socketTimeoutMS: 45000,
            family: 4 // Force IPv4 to avoid DNS issues in some environments
        });

    } catch (error) {
        console.error("CRITICAL: Database connection failed!");
        console.error("Error Message:", error.message);
        // Don't exit process here if we want the server to still show 'healthy' but with error logs
    }
}

export default connectDB;