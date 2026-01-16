import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {v4 as uuid} from 'uuid';
import {v2 as cloudinary} from 'cloudinary';
import { getBase64, getSockets } from '../lib/helper.js';
import dotenv from "dotenv";


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = (uri)=>{
    mongoose.connect(uri, {dbname: 'chat-app'})
    .then((data) => console.log(`MongoDB connected: ${data.connection.host}`))
    .catch(err => console.error('MongoDB connection error:', err));
};

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Secure only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};


const sendToken=(user, res, code, message)=>{
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '15d',
        });
    return res.status(code).cookie("chat-app-token", token,
      cookieOptions
    ).json({
        success: true,
        message,
        user
    });
}

const emitEvent = ( req, event,users, data, )=> {
    let io;
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data)

}
 const uploadFilesToCloudinary = async (files = []) => {
  try {
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", public_id: uuid() },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer); // ✅ Send file buffer to Cloudinary
      });
    });

    const results = await Promise.all(uploadPromises);
    return results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Error uploading files to cloudinary");
  }
};

const deleteFilesFromCloudinary= async(public_ids)=>{

}


export{ connectDB, sendToken, emitEvent, deleteFilesFromCloudinary, cookieOptions, uploadFilesToCloudinary };