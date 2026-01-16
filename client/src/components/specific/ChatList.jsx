import { Stack } from '@mui/material';
import React, { memo } from 'react';
import ChatItem from '../shared/ChatItem';

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "", count: 0 }],
  handleDeleteChat
}) => {
  return (
    <Stack width={w} direction="column" overflow={"auto"} height={"100%"}>
      {chats.map((data, index) => {
        const { _id, name, avatar, groupChat, members } = data;

        const newMessageAlert =
          newMessagesAlert.find(alert => alert.chatId === _id) || { count: 0 };

        const handleDeleteChatOpen = (e, chatId, groupChat) => {
          e.preventDefault();
          handleDeleteChat?.(chatId, groupChat);
        };

        const isOnline = members?.some(member =>
          onlineUsers?.includes(member)
        );

        return (
          <ChatItem
            key={_id}
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default memo(ChatList);
