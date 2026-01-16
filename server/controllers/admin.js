import { User } from '../models/user.js'
import { Chat } from '../models/chat.js'
import { Message } from '../models/message.js'
import ErrorHandler from '../utils/utility.js'
import jwt from 'jsonwebtoken'
import { cookieOptions } from '../utils/features.js'
import { adminSecretKey } from '../app.js'

const adminLogin = async (req, res, next) => {
    try {
        const { secretKey } = req.body;
        const isMatch = secretKey === adminSecretKey;
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid secret key" });
        }
        const token = jwt.sign(secretKey, process.env.JWT_SECRET)
        return res.status(200).cookie("chat-app-admin-token", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 }).json({
            secess: true,
            message: "Admin logged in successfully, WELCOME BOSS....!!!",
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });


    }
}

const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie("chat-app-admin-token");
        return res.status(200).json({
            success: true,
            message: "Admin logged out successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        return res.status(200).json({
            admin: true,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const allUsers = async (req, res, next) => {


    try {
        const users = await User.find({})
        const transformedUsers = await Promise.all(users.map(async ({ name, username, avatar, _id }) => {
            const [groups, friends] = await Promise.all([Chat.countDocuments({ groupChat: true, members: _id }), Chat.countDocuments({ groupChat: false, members: _id })])
            return { name, username, avatar: avatar.url, _id, groups, friends }
        }))
        return res.status(200).json({
            status: "success",
            users: transformedUsers,
        })
    } catch (error) {
        return next(new ErrorHandler('Failed to create allUsers', 500));
    }

}

const allChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({})
            .populate("members", "name avatar")
            .populate("creator", "name avatar");

        const transformedChat = await Promise.all(
            chats.map(async ({ members, _id, groupChat, name, creator }) => {
                const totalMessages = await Message.countDocuments({ chat: _id }); // note: use "chat" not "chatId" if your Message model uses "chat" field

                return {
                    _id,
                    groupChat,
                    name,
                    avatar: members.slice(0, 3).map((member) => member.avatar?.url || ""), // handles missing avatars
                    members: members.map(({ _id, name, avatar }) => ({
                        _id,
                        name,
                        avatar: avatar?.url || "",
                    })),
                    creator: {
                        name: creator?.name || "none",
                        avatar: creator?.avatar?.url || "",
                    },
                    totalMembers: members.length,
                    totalMessages,
                };
            })
        );

        return res.status(200).json({
            status: "success",
            chats: transformedChat,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch all chats", 500));
    }
};

const allMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({}).populate("chat", "groupChat").populate("sender",
            "avatar name");
        const transformMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
            _id, attachments, content, createdAt, chat: chat._id, groupChat: chat.groupChat, sender: {
                _id: sender._id, name: sender.name, avatar: sender.avatar?.url || ""
            }
        }))
        return res.status(200).json({
            status: "success",
            messages: transformMessages,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch all messages", 500));


    }
}

const getDashboardStats = async (req, res, next) => {
    try {
        const [groupsCount, usersCount, messagesCount, totalChatCount] = await Promise.all([Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments()
        ])
        const today = new Date()
        const last7days = new Date();
        last7days.setDate(last7days.getDate() - 7)
        const last7DaysMessages = await Message.find({
            createdAt: {
                $gte: last7days,
                $lte: today
            }
        }).select("createdAt")
        const messages = new Array(7).fill(0)
        const dayInMiliseconds = 1000 * 60 * 60 * 24
        last7DaysMessages.forEach((message) => {
            const index = Math.floor((today.getTime() - message.createdAt.getTime()) / dayInMiliseconds);
            messages[6 - index]++
        })
        const stats = {
            groupsCount,
            usersCount,
            messagesCount,
            totalChatCount,
            messagesChart: messages,
        }
        return res.status(200).json({
            succes: true,
            stats,
        })
    } catch (error) {
        return next(new ErrorHandler('Failed to create allUsers', 500));
    }
}


export { allUsers, allChats, allMessages, getDashboardStats, adminLogin, adminLogout, verifyAdmin };