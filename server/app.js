import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';

import { errorMiddleware } from './middlewares/error.js';
import { socketAuthenticator } from './middlewares/auth.js';
import { connectDB } from './utils/features.js';
import { getSockets } from './lib/helper.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import { NEW_MESSAGE_ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from './constants/events.js';
import { Message } from './models/message.js';
import { corsOptions } from './constants/config.js';

// ✅ Load environment variables
dotenv.config({ path: './.env' });

// ✅ Express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// ✅ HTTP & Socket.io setup
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

// ✅ Map to store online users' socket IDs
const userSocketIDs = new Map();

// ✅ Connect Database
connectDB(process.env.MONGO_URI);

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Attach io to app
app.set('io', io);

// ✅ Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/admin', adminRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is working ✅');
});

// ✅ Socket.io authentication middleware
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) =>
    await socketAuthenticator(err, socket, next)
  );
});

// ✅ Socket.io events
io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  const user = socket.user;
  if (!user || !user._id) return;

  userSocketIDs.set(user._id.toString(), socket.id);

  const safeGetSockets = (members) => {
    if (!Array.isArray(members)) return [];
    return members
      .map((member) => userSocketIDs.get(member.toString()))
      .filter(Boolean);
  };

  // 🔹 NEW_MESSAGE_ALERT
  socket.on(NEW_MESSAGE_ALERT, async ({ chatId, members, message }) => {
    if (!Array.isArray(members) || !message) return;

    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: { _id: user._id, name: user.name },
      chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = { content: message, sender: user._id, chat: chatId };

    const membersSockets = safeGetSockets(members);

    // Emit to all members except sender
    socket.to(membersSockets).emit(NEW_MESSAGE, { chatId, message: messageForRealTime });
    socket.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // 🔹 START_TYPING
  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = safeGetSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  // 🔹 STOP_TYPING
  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = safeGetSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  // 🔹 Disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    if (user && user._id) userSocketIDs.delete(user._id.toString());
  });
});

// ✅ Error middleware
app.use(errorMiddleware);

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
export  const adminSecretKey = process.env.ADMIN_SECRET_KEY;

export { userSocketIDs };
