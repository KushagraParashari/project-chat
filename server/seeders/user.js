import { User } from "../models/user.js"
import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.js";
import { Message } from '../models/message.js';

const createUser = async (numUsers) => {
    try {
        const usersPromise = [];
        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.displayName(),
                bio: faker.lorem.sentence(9),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            })
            usersPromise.push(tempUser);
        }
        await Promise.all(usersPromise);
        process.exit(1);
    } catch (error) {
        console.error(error);
    }
}

const createSingleChats = async (numChats) => {
    try {
        const users = await User.find().select("_id")
        const chatsPromise = []
        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                const tempChat = Chat.create({
                    name: faker.lorem.sentence(),
                    members: [users[i], users[j]]
                })
                chatsPromise.push(tempChat);
            }
        }
        await Promise.all(chatsPromise);
        process.exit(1);
    }
    catch (error) {
        console.error(error);
    }

}

const createGroupChats = async (numChats) => {
    try {
        const users = await User.find().select("_id")
        const chatsPromise = []
        for (let i = 0; i < numChats; i++) {
            const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
            const members = []
            for (let j = 0; j < numMembers; j++) {
                const randomIndex = Math.floor(Math.random() * users.length)
                const randomUser = users[randomIndex]
                if (!members.includes(randomUser)) {
                    members.push(randomUser)
                }
            }
            const chat = Chat.create({
                groupChat: true,
                name: faker.lorem.sentence(),
                members: members,
                creator: members[0]
            })
            chatsPromise.push(chat)


        }
        await Promise.all(chatsPromise)
        process.exit(1);
    } catch (error) {
        console.error(error);

    }
}

const generateFakeMessages = async (count) => {
  // Fetch all users and chats
  const users = await User.find({}, "_id");
  const chats = await Chat.find({}, "_id users");

  if (users.length === 0 || chats.length === 0) {
    throw new Error("No users or chats found in database.");
  }

  const messages = [];

  for (let i = 0; i < count; i++) {
    // Select a random chat
    const chat = faker.helpers.arrayElement(chats);

    // Select a sender from that chat’s users
    const sender = faker.helpers.arrayElement(chat.users);

    const hasAttachment = faker.datatype.boolean();

    messages.push({
      content: faker.lorem.sentence(),
      sender: sender,
      chat: chat._id,
      attachments: hasAttachment
        ? [
            {
              public_id: faker.string.uuid(),
              url: faker.image.url(),
            },
          ]
        : [],
    });
  }

  // Save to DB
  const inserted = await Message.insertMany(messages);
  return inserted;
};


export { createUser, createSingleChats, createGroupChats, generateFakeMessages };