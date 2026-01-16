import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectRoute from './components/auth/ProtectRoute.jsx';
import LayoutLoader from './components/layout/Loaders.jsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { userExists, userNotExists } from './redux/reducers/auth'; // ✅ Imported
import { SocketProvider } from './socket.jsx';

// Dynamic routing
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const Group = lazy(() => import('./pages/Group.jsx'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'));
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement.jsx'));
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement.jsx'));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const server = import.meta.env.VITE_SERVER;
console.log("Server URL:", server); // ✅ Should log correct backend URL


  useEffect(() => {
  if (!user) {  // ✅ Only run if user is not authenticated
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          console.log("Not authenticated yet 1");
        }
        dispatch(userNotExists());
      });
  }
}, [dispatch, server]); // ✅ Add user dependency



  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<SocketProvider><ProtectRoute user={user} /></SocketProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/group" element={<Group />} />
            <Route path="/chat/:chatId" element={<Chat />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/chat-management" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
