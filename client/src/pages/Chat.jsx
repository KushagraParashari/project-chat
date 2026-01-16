import React, { Fragment, useRef, useState, useCallback, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor } from '../constants/color.js';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents.jsx';
import FileMenu from '../components/dialogs/FileMenu.jsx';
import MessageComponent from '../components/shared/MessageComponent.jsx';
import { NEW_MESSAGE, START_TYPING, STOP_TYPING, ALERT } from '../constants/events.js';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js';
import { useErrors, useSocketEvents } from '../hooks/hook.jsx';
import { useInfiniteScrollTop } from '6pp';
import { useDispatch } from 'react-redux';
import { getSocket } from '../socket.jsx';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat.js';
import { TypingLoader } from '../components/layout/Loaders.jsx';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const typingTimeout = useRef();
  const bottomRef = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page, limit: 20 });

  const members = chatDetails?.data?.Chat?.members;

  // ---------------- Handlers ----------------

  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: 'system',
          name: 'Admin',
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [messageForAlert, ...prevMessages]);
    },
    [chatId]
  );

  // ---------------- Socket Events ----------------
  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingHandler,
    [STOP_TYPING]: stopTypingHandler,
  };

  useSocketEvents(socket, eventHandler);

  // ---------------- Errors ----------------
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  useErrors(errors);

  // ---------------- Effects ----------------
  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessage('');
      setMessages([]);
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId, dispatch]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate('/');
  }, [chatDetails.isError, navigate]);

  // ---------------- Scroll & Pagination ----------------
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const allMessages = [...(oldMessages || []), ...messages];

  // ---------------- Input Handlers ----------------
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const handleFileMenuClose = () => {
    dispatch(setIsFileMenu(false));
    setFileMenuAnchor(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage('');
  };

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  // ---------------- Render ----------------
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      {/* Message Container */}
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding="1rem"
        spacing="1rem"
        sx={{
          backgroundColor: grayColor,
          overflowX: 'hidden',
          overflowY: 'auto',
          height: '90%',
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>

      {/* Message Input Area */}
      <form style={{ height: '10%' }} onSubmit={submitHandler}>
        <Stack
          direction="row"
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >
          <IconButton
            sx={{ position: 'absolute', left: '1.5rem', rotate: '30deg' }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            sx={{ paddingLeft: '3rem' }}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: '-30deg',
              bgcolor: 'orange',
              color: 'white',
              marginLeft: '1rem',
              padding: '0.5rem',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      {/* File Attachment Menu */}
      <FileMenu
        anchorEl={fileMenuAnchor}
        chatId={chatId}
        onClose={handleFileMenuClose}
      />
    </Fragment>
  );
};

export default AppLayout()(Chat);
