import { User } from '../models/user.js';
import { sendToken, emitEvent, uploadFilesToCloudinary } from '../utils/features.js';
import { compare } from 'bcryptjs';
import ErrorHandler from '../utils/utility.js';
import { Chat } from '../models/chat.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { Request } from '../models/request.js';
import { getOtherMember } from '../lib/helper.js';

// ---------------- LOGIN ----------------
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new ErrorHandler("Username and password are required", 400));
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid username or password", 401));

    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid username or password", 401));

    sendToken(user, res, 200, "User logged in successfully");
  } catch (error) {
    next(new ErrorHandler("Failed to login", 500));
  }
};

// ---------------- REGISTER ----------------
const newUser = async (req, res, next) => {
  try {
    const { name, username, password, bio } = req.body;
    const file = req.file;

    if (!file) return next(new ErrorHandler('Please upload a profile picture', 400));

    const result = await uploadFilesToCloudinary([file]);
    const avatar = { public_id: result[0].public_id, url: result[0].url };

    const user = await User.create({ name, username, password, bio, avatar });

    sendToken(user, res, 201, "User created successfully");
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHandler("Username or name already exists", 400));
    }
    return next(new ErrorHandler(error.message || 'Failed to create user', 500));
  }
};

// ---------------- PROFILE ----------------
const getMyProfile = async (req, res, next) => {
  try {
    if (!req.user) return next(new ErrorHandler('User not authenticated', 401));

    res.status(200).json({
      success: true,
      user: req.user, // comes from isAuthenticated middleware
    });
  } catch (error) {
    next(new ErrorHandler('Failed to get user profile', 500));
  }
};

// ---------------- LOGOUT ----------------
const logout = (req, res, next) => {
  try {
    res.status(200)
      .cookie("chat-app-token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(new ErrorHandler('Failed to logout', 500));
  }
};

// ---------------- SEARCH USERS ----------------
const searchUser = async (req, res, next) => {
  try {
    const { name = "" } = req.query;

    const chats = await Chat.find({ members: req.user._id }).select("members");

    const sharedUserIds = new Set();
    chats.forEach(chat => {
      chat.members.forEach(memberId => {
        sharedUserIds.add(memberId.toString());
      });
    });

    sharedUserIds.add(req.user._id.toString());

    const users = await User.find({
      _id: { $nin: Array.from(sharedUserIds) },
      name: { $regex: name, $options: 'i' }
    }).select("name avatar");

    const formattedUsers = users.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar?.url || ""
    }));

    return res.status(200).json({ success: true, users: formattedUsers });
  } catch (error) {
    return next(new ErrorHandler('Failed to search users', 500));
  }
};

// ---------------- SEND REQUEST ----------------
const sendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) return next(new ErrorHandler("User ID is required", 400));

    const request = await Request.findOne({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ],
    });

    if (request) return next(new ErrorHandler("Request already sent", 400));

    await Request.create({ sender: req.user._id, receiver: userId });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// ---------------- ACCEPT REQUEST ----------------
const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));

    if (request.receiver._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can't accept this request", 400));
    }

    if (!accept) {
      await request.deleteOne();
      return res.status(200).json({ success: true, message: "Friend Request Rejected" });
    }

    const members = [request.sender._id, request.receiver._id];
    await Promise.all([
      Chat.create({ members, name: `${request.sender.name}-${request.receiver.name}` }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    next(new ErrorHandler('Failed to accept friend request', 500));
  }
};

// ---------------- NOTIFICATIONS ----------------
const getNotifications = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiver: req.user._id })
      .populate("sender", "name avatar");

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({ success: true, allRequests });
  } catch (error) {
    next(new ErrorHandler('Failed to fetch notifications', 500));
  }
};

// ---------------- FRIENDS ----------------
const getFriends = async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: req.user._id, groupChat: false })
      .populate("members", "name avatar");

    const friendsMap = new Map();

    chats.forEach(({ members }) => {
      const otherUser = members.find(
        member => member._id.toString() !== req.user._id.toString()
      );
      if (otherUser && !friendsMap.has(otherUser._id.toString())) {
        friendsMap.set(otherUser._id.toString(), {
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar?.url || null,
        });
      }
    });

    const friends = Array.from(friendsMap.values());

    return res.status(200).json({ success: true, friends });
  } catch (error) {
    next(new ErrorHandler('Failed to fetch friends', 500));
  }
};

export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendRequest,
  acceptFriendRequest,
  getNotifications,
  getFriends,
};
