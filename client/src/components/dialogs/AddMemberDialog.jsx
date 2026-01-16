import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useAsyncMutation } from '../../hooks/hook'

const AddMemberDialog = ({chatId }) => {

    const [addMembers, isLoadingAddMember] = useAsyncMutation(useAddGroupMemberMutation)
  const {isAddMember} = useSelector((state)=>state.misc)
  const dispatch = useDispatch()
  const { isLoading, isError, error, data} = useAvailableFriendsQuery(chatId)


    const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id])
    }

    const addFriendHandler = (id) => {
        addMembers(id, chatId)
    }
    const addMemberSubmitHandler = () => {
        addMembers("Adding Members...", {members: selectedMembers, chatId})
        closeHandler();
    }
    const closeHandler = () => {
        setSelectedMembers([]);
        setMembers([]);
        dispatch(setIsAddGroupMember(false))
    }
    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} spacing={"2rem"} width={"20rem"} >
                <DialogTitle textAlign={"center"} >Add Member</DialogTitle>
                <Stack>
                    {isLoading? <Skeleton/>:(
                        data?.friends?.length > 0 ? data?.friends?.map((i) => (
                            <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                        )) : <Typography textAlign={"center"} >No Friends</Typography>
                    )
                    }
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Button onClick={closeHandler} color="error" >Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMember} >Submit</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog