import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMembers, leaveGroup , sendAttachment, getChatDetails, renameGroup, deleteChat, getMessages} from '../controllers/chat.js';
import { attachmentMulter } from '../middlewares/multer.js';
import { newGroupValidator, validateHandler, addMemberValidator, removeMemberValidator, leaveGroupValidator, sendAttachmentsValidator, getMessagesValidator, } from '../lib/validators.js';


const app= express.Router();

app.use(isAuthenticated);
app.post("/new", newGroupValidator(), validateHandler, newGroupChat)
app.get("/my", getMyChats)
app.get("/my/groups", getMyGroups)
app.put("/addmember",addMemberValidator(), validateHandler, addMembers);
app.put("/removemember", removeMemberValidator(), validateHandler, removeMembers);
app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup);
app.post("/message", attachmentMulter, sendAttachmentsValidator(), validateHandler, sendAttachment)
app.get("/message/:id", getMessagesValidator(), validateHandler,  getMessages)
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat)

export default app;