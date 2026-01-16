import React from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { Typography } from '@mui/material'

const Home = () => {
  return (
    <Typography varient="h5" p={"2rem"} textAlign={"center"} >
      Select a friend to chat
    </Typography>
  )
}

export default AppLayout()(Home)