import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { Face as FaceIcon, AlternateEmail, CalendarMonth } from '@mui/icons-material';
import moment from 'moment';

const Profile = ({ user }) => {
  const createdAt = moment("2025-07-07T10:30:00Z");

  return (
    <Stack spacing={"2rem"} direction="column" className="h-full" alignItems="center">
      <Avatar 
        src={user?.avatar?.url} 
        sx={{ width: 200, height: 200, objectFit: "contain", marginBottom: "1rem", border: "5px solid white" }} 
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<AlternateEmail />} />
      <ProfileCard heading={"User Name"} text={user?.username} Icon={<FaceIcon />} />
      <ProfileCard heading={"Joined"} text={createdAt.format('MMMM Do YYYY, h:mm a')} Icon={<CalendarMonth />} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack direction="row" alignItems="center" spacing={"1rem"} textAlign={"center"}>
    {Icon && <Avatar sx={{ width: 40, height: 40 }}>{Icon}</Avatar>}
    <Stack direction="column" spacing={1}>
      <Typography variant="h6">{text}</Typography>
      <Typography variant="body1">{heading}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
