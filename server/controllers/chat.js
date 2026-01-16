import { Chat } from '../models/chat.js';
import ErrorHandler from '../utils/utility.js';
import { ALERT, NEW_MESSAGE_ALERT, REFETCH_CHATS, NEW_ATTACHMENT, NEW_MESSAGE } from '../constants/events.js';
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from '../utils/features.js';
import { getOtherMember } from '../lib/helper.js';
import { User } from '../models/user.js';
import { Message } from '../models/message.js';
import mongoose from 'mongoose';

const newGroupChat = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
      return next(new ErrorHandler('Name and members are required', 400));
    }

    const allMembers = [...members, req.user._id]; // Include the creator
    const chat = await Chat.create({
      name,
      members: allMembers,
      creator: req.user._id,
      groupChat: true
    });

    emitEvent(req, ALERT, allMembers, `Welcome to the group chat: ${name}`);
    emitEvent(req, REFETCH_CHATS, members);

    res.status(200).json({
      success: true,
      message: 'Group chat created successfully',
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to create group chat', 500));
  }
};

const getMyChats = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    // Fetch all chats where the user is a member
    const chats = await Chat.find({ members: userId })
      .populate("members", "name avatar");

    // Filter and transform chats
    const transformChats = chats
      .filter(chat => chat.groupChat || chat.members.length > 1) // Ignore solo chats unless it's a group
      .map(chat => {
        const otherMembers = chat.members.filter(
          member => member._id.toString() !== userId
        );

        const avatars = chat.groupChat
          ? chat.members.slice(0, 3).map(m => m.avatar?.url || null)
          : [otherMembers[0]?.avatar?.url || null];

        const name = chat.groupChat
          ? chat.name
          : otherMembers[0]?.name || "Unknown";

        return {
          _id: chat._id,
          groupChat: chat.groupChat,
          avatar: avatars,
          name,
          members: otherMembers.map(m => m._id),
        };
      });

    res.status(200).json({ success: true, chats: transformChats });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch chats", 500));
  }
};

const getMyGroups = async (req, res, next) => {
  try {
    const chats = await Chat.find({ groupChat: true, creator: req.user }).populate("members", "name avatar");
    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id, groupChat, name, avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));
    return res.status(200).json({
      success: true,
      groups: groups
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to fetch group chats', 500));


  }
};

const addMembers = async (req, res, next) => {
  try {
    const { chatId, members } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.groupChat || members.length === 0) {
      return next(new ErrorHandler('Chat not found', 404));
    }

    if (chat.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('You are not the creator of this chat', 403));
    }

    const newMembers = await User.find({ _id: { $in: members } }, 'name');
    const newMemberIds = newMembers
      .map(m => m._id)
      .filter(id => !chat.members.includes(id.toString()));

    chat.members.push(...newMemberIds);
    await chat.save();

    const allNames = newMembers.map(m => m.name).join(', ');
    emitEvent(req, ALERT, chat.members, `${allNames} has been added to the group chat`, chat._id);
    emitEvent(req, REFETCH_CHATS, chat.members);

    res.status(200).json({ success: true, message: "Members added successfully" });
  } catch (error) {
    return next(new ErrorHandler('Failed to add members', 500));
  }
};

const removeMembers = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.groupChat) {
      return next(new ErrorHandler('Chat not found', 404));
    }
    if (chat.creator.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('You are not the creator of this chat', 403));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    const index = chat.members.indexOf(userId);
    if (index === -1) {
      return next(new ErrorHandler('User is not a member of this chat', 404));
    }

    const allChatMembers = chat.members.map((i)=>i.toString())
    chat.members.splice(index, 1);
    await chat.save();
    emitEvent(req, ALERT, chat.members, `${user.name} has been removed from the group chat`, chatId);
    emitEvent(req, REFETCH_CHATS, allChatMembers);
    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("❌ removeMembers error:", error);
  }
}

const leaveGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler('Chat not found', 404));

    const remainingMembers = chat.members.filter(m => m.toString() !== req.user._id.toString());

    // Assign new creator if needed
    if (chat.creator.toString() === req.user._id.toString()) {
      const randomIndex = Math.floor(Math.random() * remainingMembers.length);
      chat.creator = remainingMembers[randomIndex];
    }

    chat.members = remainingMembers;
    if (remainingMembers.length < 3)
      return next(new ErrorHandler('Group chat must have at least 3 members', 403));

    emitEvent(req, ALERT, chat.members, `${req.user.name} has left the group chat`, chatId);
    emitEvent(req, REFETCH_CHATS, chat.members);

    await chat.save();
    res.status(200).json({ success: true, message: "You have left the group chat successfully" });
  } catch (error) {
    return next(new ErrorHandler('Failed to leave group', 500));
  }
};

const sendAttachment = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const files = req.files || []
    if (files.length <= 0)
      return next(new ErrorHandler('No file attached', 400))
    if (files > 5)
      return next(new ErrorHandler('Maximum 5 files allowed', 400))

    const [chat, me] = await Promise.all([Chat.findById(chatId), User.findById(req.user, "name"),]);

    if (!chat) {
      return next(new ErrorHandler('Chat not found', 404));
    }
    const attachments = await uploadFilesToCloudinary(files);
    const messageForDB = { content: "", attachments, sender: me._id, chat: chatId }
    const messageForRealTime = { ...messageForDB, sender: { _id: me._id, name: me.name, } }
    const message = await Message.create(messageForDB);
    emitEvent(req, NEW_MESSAGE, chat.members, { message: messageForRealTime, chatId });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("❌ sendAttachment error:", error);

  }
}

const getChatDetails = async (req, res, next) => {
  try {
    if (req.query.populate === "true") {
      const chat = await Chat.findById(req.params.id).populate("members", "name avatar").lean();
      if (!chat) return next(new ErrorHandler('Chat not found', 404));
      chat.members = chat.members.map(({ _id, name, avatar }) =>
        ({ _id, name, avatar: avatar.url })
      )
      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await Chat.findById(req.params.id);
      if (!chat) return next(new ErrorHandler('Chat not found', 404));
      return res.status(200).json({
        success: true,
        chat,
      })
    }
  } catch (error) {
    console.error("❌ getChatDetails error:", error);

  }

}

const renameGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { name } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler('Chat not found', 404));
    if (!chat.groupChat) return next(new ErrorHandler('This is not a group chat', 400));
    if (chat.creator.toString() !== req.user.toString())
      return next(new ErrorHandler('You are not the creator of this group', 403));
    chat.name = name;
    await chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members)
    return res.status(200).json({
      success: true,
      message: "Group name changed successfully",
    });
  } catch (error) {
    console.error("❌ renameGroup error:", error);
    next(new ErrorHandler('Failed to rename group', 500));

  }
}

const deleteChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler('Chat not found', 404));
    if (chat.groupChat && chat.creator.toString() !== req.user.toString())
      return next(new ErrorHandler('You are not the creator of this group', 403));

    const members = chat.members;
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
      return next(new ErrorHandler('You are not a member of this chat', 403));
    }
    const messagesWithAttachments = await Message.find({ chatId: chatId, attachments: { $exists: true, $ne: [] } })
    const public_ids = []
    messagesWithAttachments.forEach(({ attachments }) => attachments.forEach(({ public_id }) => public_ids.push(public_id)))
    await Promise.all([deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chatId: chatId }),

    ])

    emitEvent(req, REFETCH_CHATS, chatId);
    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("❌ deleteChat error:", error);
    next(new ErrorHandler('Failed to delete chat', 500));

  }
}


const getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    console.log("Chat ID:", chatId, "Page:", page, "Limit:", limit);

    // ✅ Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ success: false, message: "Invalid Chat ID" });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }
    if(!chat.members.includes(req.user._id.toString())) {
      return res.status(403).json({ success: false, message: "You are not a member of this chat" });
    }
    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages: Math.ceil(totalMessagesCount / limit),
    });
  } catch (error) {
    console.error("❌ getMessages error:", error);
    return res.status(500).json({ success: false, message: "Failed to get messages" });
  }
};




export { newGroupChat, getMyChats, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachment, getChatDetails, renameGroup, deleteChat, getMessages };
