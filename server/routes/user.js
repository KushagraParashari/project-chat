import express from 'express';
import {login, newUser} from "../controllers/user.js"
import multer from 'multer';
import { multerUpload } from '../middlewares/multer.js';
import { getMyProfile } from '../controllers/user.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { logout } from '../controllers/user.js';
import { searchUser, sendRequest, acceptFriendRequest, getNotifications, getFriends } from '../controllers/user.js';
import { registerValidator, validateHandler , loginValidator} from '../lib/validators.js';


const app = express.Router();
app.post('/new', multerUpload.single("avatar") , registerValidator(), validateHandler ,newUser);
app.post("/login",loginValidator(), validateHandler, login);
app.use(isAuthenticated); // Ensure user is authenticated for the following routes
app.get("/me", getMyProfile);
app.get("/logout", logout );
app.get("/search", searchUser)
app.put("/sendrequest", sendRequest)
app.put("/acceptfriendrequest", acceptFriendRequest)
app.get("/notifications", getNotifications)
app.get("/friends", getFriends)

export default app;