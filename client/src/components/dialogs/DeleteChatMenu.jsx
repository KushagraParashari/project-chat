import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { IconButton, Menu, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({dispatch, deleteMenuAnchor}) => {
  const navigate = useNavigate()
  const {isDeleteMenu, selectedDeleteChat} = useSelector((state)=>state.misc) 
  const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation)
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)
  const closeHandler=()=>{
    dispatch(setIsDeleteMenu(false))
    deleteMenuAnchor.current = null
  }
  const deleteChatHandler = () => {
  closeHandler()
  deleteChat("Deleting Chat...", selectedDeleteChat.chatId)
  }
  const leaveGroupHandler = () => {
    closeHandler()
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId)
  }
  useEffect(() => {
    if (deleteChatData || leaveGroupData) {
      navigate("/chats")
    }
  }, [deleteChatData, leaveGroupData, navigate])

  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current} anchorOrigin={{vertical:"bottom", horizontal:"right"}} transformOrigin={{vertical:"center", horizontal:"center"}}>
      <Stack sx={{
        width:"10rem", padding:"0.5rem", cursor:"pointer",
      }}
      direction={"row"} alignItems={"center"} spacing={"0.5rem"} onClick={selectedDeleteChat.groupChat?leaveGroupHandler:deleteChatHandler}>
        {
          selectedDeleteChat.groupChat ? (
          <>Leave Group</>):(<>Delete Chat</>
          )
        
        }
        </Stack> 
    </Menu>
  )
}

export default DeleteChatMenu