import React, { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  Button,
  ListItem,
  Avatar,
  List,
  Typography,
  Skeleton,
} from '@mui/material';
import { sampleMessages } from '../../constants/sampleData';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';
const Notification = () => {
  const {isNotification} = useSelector((state)=>state.misc)
  const dispatch = useDispatch()
  const {isLoading, data, isError, error} =useGetNotificationsQuery();
  const [ acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequestHandler = async(accept, _id) => {
    dispatch(setIsNotification(false));
    //2:17:00
    try{
      const res= await acceptRequest({requestId: _id, accept})
      if(res.data?.success){
        toast.success(res.data.message)
      }else{
        toast.error(res.message)
      }
    }catch(error){
      console.log(error)
    }
  }
  useErrors([{error, isError}])
  const closeHandler = ()=>dispatch(setIsNotification(false))
  
  return (
    <Dialog open={isNotification} onClose={closeHandler} >
      <Stack>
        <DialogTitle>Notifications</DialogTitle>
    {
      isLoading?(
      <Skeleton/>
      ):(
      <>
      
      </>)
    }
        {/* Notification list would go here */
          data?.allRequests.length > 0 ? (
            data?.allRequests.map(({ sender, _id }) => (<NotificationItem key={_id} sender={sender} handler={friendRequestHandler} id={_id} />))
          ) : <Typography textAlign={"center"}>No Notifications</Typography>
        }
      </Stack>
    </Dialog>
  )
}
const NotificationItem = memo(({ sender, handler, id }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack direction="row" spacing={"1rem"} alignItems="center" width="100%">
        <Avatar src={avatar} />
        <Typography variant="body1" sx={{
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          width: '100%',
          textOverflow: "ellipsis",
          overflow: "hidden"
        }}>
          {`${name} sent you a friend request`}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end" alignItems="center">
          <Button onClick={() => handler(true, id)}>Accept</Button>
          <Button onClick={() => handler(false, id)}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});


export default Notification