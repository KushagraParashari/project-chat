import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/utility.js';
import { User } from '../models/user.js';


const isAuthenticated = async (req, res, next) => {

  const token = req.cookies["chat-app-token"];
  if (!token) return next(new ErrorHandler('Not authenticated', 401));
    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch full user once
    const user = await User.findById(decoded._id).select('-password'); // exclude password
    if (!user) return next(new ErrorHandler('User not found', 404));

    req.user = user; // store full object for controllers
    console.log("Authenticated user:", user);
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 401));
  }
};


// ✅ Middleware to check if admin is authenticated
const adminOnly = (req, res, next) => {
    const token = req.cookies["chat-app-admin-token"];
    if (!token) {
        return next(new ErrorHandler('Not authenticated', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Compare decoded secretKey with adminSecretKey from .env
        if (decoded !== adminSecretKey) {
            return next(new ErrorHandler('Not authorized', 403));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid admin token', 401));
    }
};

const socketAuthenticator=async(err, socket, next)=>{
 try{
    if(err)
        return next(err)
    const authToken=socket.request.cookies["chat-app-token"]

    if(!authToken)
        return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET)
    const user = await User.findById(decodedData._id)
    if(!user) return next(new ErrorHandler("Please login to access this route", 401))
    socket.user = user
    return next()
 }catch(error){
    return next(new ErrorHandler("Please login to access this route", 401))
 }
}

export { isAuthenticated, adminOnly, socketAuthenticator };
