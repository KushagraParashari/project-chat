import { Box } from '@mui/material'
import React from 'react'
import { Grid, IconButton } from '@mui/material'
import { Typography } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, ManageAccounts as ManageAccountsIcon, Groups as GroupsIcon, Message as MessageIcon } from '@mui/icons-material'
import { useLocation, Link as LinkComponent, Navigate } from 'react-router-dom'
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { styled } from '@mui/system';
import { Stack } from '@mui/material';
import { Drawer } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../../redux/thunks/admin'


const Link = styled(LinkComponent)`

    text-decoration: none;
    color: inherit;
    padding:1rem 2rem;

border-radius:2rem;  
  &:hover {
        text-decoration: none;
        color: inherit;
    }
        `;


const adminTabs = [{
  id: 1,
  name: 'Dashboard',
  link: '/admin/dashboard',
  icon: <DashboardIcon />,

}, {
  id: 2,
  name: 'User',
  link: '/admin/user-management',
  icon: <ManageAccountsIcon />,

}, {
  id: 3,
  name: 'Groups',
  link: '/admin/chat-management',
  icon: <GroupsIcon />,

}, {
  id: 4,
  name: 'Messages',
  link: '/admin/messages',
  icon: <MessageIcon />,

},
]

const AdminLayout = ({ children }) => {

  const [isMobile, setIsMobile] = React.useState(false);
  const { isAdmin } = useSelector((state) => state.auth)
  

  const Sidebar = ({ w }) => {

    const location = useLocation();
    const dispatch = useDispatch();

    const logoutHandler = () => {
      dispatch(adminLogout());
    }
    return <Stack width={w} direction="column" sx={{ bgcolor: "#fff", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 1000, padding: "1rem" }}>
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "1rem" }}>Admin Dashboard</Typography>
      <Stack spacing={"1rem"}>
        {
          adminTabs.map((tab) => (
            <Link to={tab.link} key={tab.id} style={{ textDecoration: "none", color: location.pathname === tab.link ? "#1976d2" : "#000" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ padding: "0.5rem", borderRadius: "4px", "&:hover": { backgroundColor: "#f0f0f0" } }}>
                {tab.icon}
                <Typography variant="body1">{tab.name}</Typography>
              </Stack>
            </Link>
          ))}
        <Link onClick={logoutHandler}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ padding: "0.5rem", borderRadius: "4px", "&:hover": { backgroundColor: "#f0f0f0" } }}>
            {<ExitToAppIcon />}
            <Typography variant="body1">Log Out</Typography>
          </Stack>
        </Link>

      </Stack>
    </Stack>
  }
  const handleMobile = () => {
    setIsMobile(!isMobile)
  }
  const handleClose = () => {
    setIsMobile(false)
  }

  if (!isAdmin) { return <Navigate to="/admin" />; }
  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed right-4 top-4 z-50">
        <button onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-[#f5f5f5]">
        {children}
      </div>

      {/* Sidebar - Mobile Drawer */}
      <Drawer open={isMobile} onClose={handleClose}>
        <div className="w-[50vw]">
          <Sidebar />
        </div>
      </Drawer>
    </div>

  )
}

export default AdminLayout