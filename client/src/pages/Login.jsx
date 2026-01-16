import React from 'react'
import { Container, Paper, Typography, TextField, Button, Avatar, Stack, IconButton } from '@mui/material'
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
import { useFileHandler, useInputValidation } from '6pp'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { userExists } from '../redux/reducers/auth'
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [isLogin, setIsLogin] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const name = useInputValidation("")
    const bio = useInputValidation("")
    const username = useInputValidation("")
    const password = useInputValidation("")
    const navigate = useNavigate();

    const avatar = useFileHandler("single");
    const dispatch = useDispatch();
    const server = import.meta.env.VITE_SERVER;

const handleLogin = async (e) => {
  const toastId = toast.loading("Logging in...");
  e.preventDefault();
  setIsLoading(true);
  try {
    const { data } = await axios.post(
      `${server}/api/v1/user/login`,
      { username: username.value, password: password.value },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    console.log(data);
    dispatch(userExists(data.user));
    toast.success(data.message, { id: toastId });
    navigate("/"); 
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
  }finally{
    setIsLoading(false);
  }
};

const handleSignUp = async (e) => {
  const toastId = toast.loading("Signing up...");
  e.preventDefault();
  setIsLoading(true);
  const formData = new FormData();
  formData.append("avatar", avatar.file);
  formData.append("name", name.value);
  formData.append("bio", bio.value);
  formData.append("username", username.value);
  formData.append("password", password.value);
    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
console.log("Selected file:", avatar.file);

  try {
    console.log("stage 1")
    const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(data)
    dispatch(userExists(data.user));
    toast.success(data.message, { id: toastId });
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong 1", { id: toastId });
  }finally{
    setIsLoading(false);
  }
};


    

    return (
        <div style={{ backgroundImage: "linear-gradient(rgba(200, 200, 200, 0.5), rgba(120, 110, 220, 0.5)), url('/images/login-bg.jpg')", backgroundSize: "cover", height: "100vh" }}>
            <Container component={"main"} maxWidth="xs" sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {
                        isLogin ? <>
                            <Typography variant="h5">Login</Typography>
                            <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleLogin}>
                                <TextField label="Username" variant="outlined" margin="normal" fullWidth required value={username.value} onChange={username.changeHandler} />
                                <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth required value={password.value} onChange={password.changeHandler} />
                                <Button sx={{ marginTop: "1rem" }} type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>
                                    Login
                                </Button>
                                <Typography textAlign={"center"} m={"1rem"}> Or</Typography>
                                <Button sx={{ marginTop: "1rem" }} variant="contained" color="secondary" onClick={() => setIsLogin(false)} disabled={isLoading} fullWidth>Sign Up</Button>
                            </form>
                        </> : <>
                            <Typography variant="h5">Sign Up</Typography>
                            <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleSignUp}>
                                <Stack position={"relative "} width={"10rem"} margin={"auto"}>
                                    <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview} />
                                    <IconButton component="label" sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", color: "black" }}>
                                        <>
                                            <CameraAltIcon />
                                            <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                                        </>
                                    </IconButton>

                                </Stack>

                                <TextField label="Name" variant="outlined" margin="normal" fullWidth required value={name.value} onChange={name.changeHandler} />
                                <TextField label="Username" variant="outlined" margin="normal" fullWidth required value={username.value} onChange={username.changeHandler} />
                                <TextField label="Bio" variant="outlined" margin="normal" fullWidth required value={bio.value} onChange={bio.changeHandler} />
                                <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth required value={password.value} onChange={password.changeHandler} />
                                <Button sx={{ marginTop: "1rem" }} type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth>
                                    Sign Up
                                </Button>
                                <Typography textAlign={"center"} m={"1rem"}> Or</Typography>
                                <Button sx={{ marginTop: "1rem" }} variant="contained" color="secondary" onClick={() => setIsLogin(true)} disabled={isLoading} fullWidth>Login</Button>
                            </form>
                        </>
                    }
                </Paper>
            </Container>
        </div>
    )
}

export default Login