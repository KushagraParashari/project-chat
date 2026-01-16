import React, { Suspense } from 'react'
import { AppBar, Box, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/color'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationIcon from '@mui/icons-material/Notifications'
import { Backdrop } from '@mui/material'
import { lazy } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import toast from 'react-hot-toast'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotificationCount } from '../../redux/reducers/chat'

const Search = lazy(() => import('../specific/search'))
const Notification = lazy(() => import('../specific/Notification'))
const NewGroup = lazy(() => import('../specific/NewGroup'))

const Header = () => {

  const server = import.meta.env.VITE_SERVER;
  const naivgate = useNavigate()
  const dispatch = useDispatch()

  const {isSearch, isNotification, isNewGroup} = useSelector((state)=>state.misc)
  const {notificationCount}= useSelector((state)=>state.chat)

  const handleMoblie = () => {
    console.log('mobile')
    dispatch(setIsMobile(true))
  }

  const openSearchDialog = () => {
    console.log('open search dialog')
    dispatch(setIsSearch(true));
  }
  const openNewGroup = () => {
   dispatch(setIsNewGroup(true))
  }
  const NavigateToGroup = () => naivgate('/group')

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true
      })
      dispatch(userNotExists())
      toast.success(data.message);

    } catch (error) {
      toast.error("failed to logout", error)
    }
  }
  const openNotification = () =>{
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount())
  }


  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Chat App
            </Typography>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={handleMoblie}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearchDialog} />
              <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
              <IconBtn title={"Manage Group"} icon={<GroupIcon />} onClick={NavigateToGroup} />
              <IconBtn title={"Notification"} icon={<NotificationIcon />} onClick={openNotification} value={notificationCount}/>
              <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && (
          <Suspense fallback={<Backdrop open />}>
            <Search />
          </Suspense>
        )
      }
      {
        isNotification && (
          <Suspense fallback={<Backdrop open />} >
            <Notification />
          </Suspense>
        )
      }
      {
        isNewGroup && (
          <Suspense fallback={<Backdrop open />}>
            <NewGroup />
          </Suspense>
        )
      }

    </>
  )
}

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value?(<Badge badgeContent={value} color="error">

        {icon}
        </Badge>
        ):(
          icon
        )
  }
      </IconButton>
    </Tooltip>
  )
}

export default Header