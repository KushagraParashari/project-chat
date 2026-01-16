import React, { useState, memo, useEffect, Suspense, lazy } from 'react';
import {
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Stack,
  Drawer,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents';
import { sampleChats } from '../constants/sampleData';
import { sampleUsers } from '../constants/sampleData';
import AvatarCard from '../components/shared/AvatarCard';
import UserItem from '../components/shared/UserItem';
import { orange, grayColor, matblack, bgGradient } from '../constants/color';
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import LayoutLoader from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';


const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));

const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

const Group = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('group');
  const navigate = useNavigate();
  const myGroups = useMyGroupsQuery("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState('Group Name');
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] =useState([])
  const dispatch = useDispatch()
  
  const {isAddMember} = useSelector((state)=>state.misc)
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [ removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)


  const navigateBack = () => navigate('/');

  const handleMobileToggle = () => setIsMobileMenuOpen((prev) => !prev);

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const groupDetails = useChatDetailsQuery(
    {chatId, populate: true},
    {skip: !chatId}
  )
  
  useEffect(()=>{
    if(groupDetails.data){
      setGroupName(groupDetails.data.name)
      setGroupNameUpdatedValue(groupDetails.data.name)
      setMembers(groupDetails?.data?.chat?.members)
    }
    return()=>{
       setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }
  },[groupDetails.data])

  const updateGroupName = () => {
    
    setIsEdit(false);
    updateGroup("Updating group name...",{name: groupNameUpdatedValue, chatId: chatId})
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log('Delete Group');
  };


  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddGroupMember(true))
    console.log('Add Member');
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId)
    closeConfirmDeleteHandler();
    navigate('/groups');
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", {chatId, userId})
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName('');
      setGroupNameUpdatedValue('');
      setIsEdit(false);
    };
  }, [chatId]);
  const errors=[{
    isError: myGroups.isError,
    error: myGroups.error
  },{
    isError: groupDetails.isError,
    error: groupDetails.error
  }
]

  useErrors(errors)

  const IconBtns = (
    <>
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          right: '1rem',
          top: '1rem',
        }}
      >
        <IconButton onClick={handleMobileToggle}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="Back">
        <IconButton
          onClick={navigateBack}
          sx={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const ActionButtons = (
    <Stack
      direction={{ xs: 'column-reverse', sm: 'row' }}
      spacing="1rem"
      padding={{ xs: '1rem', sm: '1rem 2rem', md: '1rem 4rem' }}
    >
      <Button size="large" color="error" onClick={openConfirmDeleteHandler}>
        Delete Group
      </Button>
      <Button size="large" variant="contained" onClick={openAddMemberHandler}>
        Add Member
      </Button>
    </Stack>
  );

  const GroupNameSection = (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} padding="3rem">
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <Button variant="contained" color="error" disabled={isLoadingGroupName} onClick={updateGroupName}>
            <DoneIcon />
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton disabled={isLoadingGroupName} onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  return myGroups.isLoading?<LayoutLoader/>: (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div className="hidden sm:block w-1/3" style={{ backgroundImage: bgGradient }}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center relative px-12 py-4 w-full sm:w-2/3">
        {IconBtns}

        {groupName && (
          <>
            {GroupNameSection}

            <Typography
              variant="body1"
              sx={{ margin: '2rem 0', alignSelf: 'flex-start' }}
            >
              Members
            </Typography>

            <Stack
              maxWidth="45rem"
              width="100%"
              boxSizing="border-box"
              padding={{ xs: '0', sm: '1rem', md: '1rem 4rem' }}
              spacing="2rem"

              height="50vh"
              overflow="auto"
            >
              {/* Members List Goes Here */}

              {isLoadingRemoveMember?<CircularProgress/>:(
               members.map((i) => (
                  <UserItem user={i} key={i._id} isAdded styling={{ boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)", padding: "1rem 2rem", borderRadius: "1rem" }} handler={removeMemberHandler} />
                )))
              }

            </Stack>

            {ActionButtons}
          </>
        )}

        <Typography variant="h5" color="gray" className="mt-4">
          Select or create a group to start chatting.
        </Typography>
      </div>

      {isAddMember && <Suspense fallback={<Backdrop open />}><AddMemberDialog chatId={chatId} /></Suspense>}

      {/* Confirm Delete Dialog */}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <Box width="50vw" >
          <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
        </Box>
      </Drawer>
    </div>
  );
};

// Group List
const GroupList = ({ w = '100%', myGroups = [], chatId }) => (
  <Stack width={w} sx={{ backgroundImage: bgGradient, height: "100vh" }} >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign="center" padding="1rem">
        No Groups
      </Typography>
    )}
  </Stack>
);

// Group List Item
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack
        direction="row"
        spacing="1rem"
        alignItems="center"
        padding="0.75rem 1rem"
        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Group;
