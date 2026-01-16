import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  TextField,
  Skeleton,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { Button } from "@mui/material";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { toast } from "react-hot-toast";

const NewGroup = () => {
  const dispatch = useDispatch();

  // Redux
  const { isNewGroup } = useSelector((state) => state.misc);

  // API queries
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  // Error handling
  useErrors([{ isError, error }]);

  // Hooks
  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Handlers
  const selectMemberHandler = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((currElement) => currElement !== userId)
        : [...prev, userId]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Please select at least 3 members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle>New Group</DialogTitle>

        <TextField
          label="Group Name"
          placeholder="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          fullWidth
        />

        <Typography variant="body1" textAlign="center">
          Select members to add to the group
        </Typography>

        <Stack spacing={1} my={2}>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                handlerIsLoading={false}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
