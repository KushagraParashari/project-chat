import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  InputAdornment,
  List,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useInputValidation } from "6pp"; // ✅ check this import path
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";
import toast from "react-hot-toast";

const Search = () => {
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequestMutation] = useSendFriendRequestMutation();

  // ✅ wrap RTK mutation with async handler
  const [sendFriendRequest, isLoadingSendFriendRequest] =
    useAsyncMutation(sendFriendRequestMutation);

  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc);

  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  // ✅ send friend request with payload
  const addFriendHandler = async (userId) => {
    try {
      await sendFriendRequest("Sending friend request...", userId);
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send request");
    }
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  // ✅ debounce search queries
  useEffect(() => {
    if (!search.value.trim()) {
      setUsers([]);
      return;
    }

    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          if (data?.users) {
            setUsers(data.users);
          } else {
            setUsers([]);
          }
        })
        .catch((e) => console.error(e));
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [search.value, searchUser]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p="2rem" direction="column" width="25rem" spacing={2}>
        <DialogTitle textAlign="center">Search</DialogTitle>

        <TextField
          placeholder="Search..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.length > 0 ? (
            users.map((user) => (
              <UserItem
                key={user._id || user.id}
                user={user}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              No users found
            </p>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
