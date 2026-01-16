import React, { useCallback, useEffect, useRef } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import { getSocket } from "../../socket"; // ✅ use your socket helper, not `Socket` class
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout =
  () =>
  (WrappedComponent) => {
    return (props) => {
      const params = useParams();
      const chatId = params.chatId;
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const deleteMenuAnchor = useRef(null);

      const { isMobile } = useSelector((state) => state.misc);
      const { user } = useSelector((state) => state.auth);
      const { newMessagesAlert } = useSelector((state) => state.chat);

      const { isLoading, data, error, isError, refetch } = useMyChatsQuery("");
      useErrors([{ isError, error }]);

      const handleDeleteChat = (e, chatId, groupChat) => {
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({ chatId, groupChat }));
        deleteMenuAnchor.current = e.currentTarget;
        e.preventDefault();
      };

      useEffect(() => {
        getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
      }, [newMessagesAlert]);

      const handleMobileClose = () => dispatch(setIsMobile(false));

      const newMessageAlertHandler = useCallback(
        (data) => {
          if (data.chatId === chatId) return;
          dispatch(setNewMessagesAlert(data));
        },
        [chatId, dispatch]
      );

      const newRequestHandler = useCallback(() => {
        dispatch(incrementNotification());
      }, [dispatch]);

      const refetchHandler = useCallback(() => {
        refetch();
        navigate("/")
      }, [refetch, navigate]);

      // ✅ Use actual socket instance
      const socket = getSocket();

      const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
        [NEW_REQUEST]: newRequestHandler,
      };

      useSocketEvents(socket, eventHandlers);

      return (
        <>
          <Title title="Chat App" />
          <Header />
          <DeleteChatMenu dispatch={dispatch } deleteMenuAnchor={deleteMenuAnchor} />
          {isLoading ? (
            <Skeleton />
          ) : (
            <Drawer open={isMobile} onClose={handleMobileClose}>
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                w="70vw"
              />
            </Drawer>
          )}

          <div className="flex h-[calc(92vh-4px)]">
            {/* Left Div */}
            <div className="hidden sm:block sm:w-1/3 md:w-3/12 lg:w-1/4 h-full bg-gray-100">
              {isLoading ? (
                <Skeleton />
              ) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                />
              )}
            </div>

            {/* Center Div */}
            <div className="w-full sm:w-2/3 md:w-6/12 lg:w-1/2 h-full bg-white">
              <WrappedComponent {...props} chatId={chatId} user={user} />
            </div>

            {/* Right Div */}
            <div className="hidden md:block md:w-3/12 lg:w-1/4 h-full bg-gray-200 p-8">
              <Profile user={user} />
            </div>
          </div>

          <div>Footer</div>
        </>
      );
    };
  };

export default AppLayout;
