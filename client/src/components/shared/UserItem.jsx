import React from 'react'
import { memo } from 'react';
import { ListItem, Stack, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';


const UserItem = ({ handler, user, handlerIsLoading, isAdded = false, styling = {} }) => {

    const { name, _id, avatar } = user;
    return (
        <ListItem>
            <Stack direction="row" spacing={"1rem"} alignItems="center" width="100%">
                <Avatar src={avatar} />
                <Typography varient="body1 " sx={{ flexGlow: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", width: '100%', textOverflow: "ellipsis" }}>
                    {name}</Typography>
                <IconButton onClick={() => handler(_id)} disabled={handlerIsLoading}
                    sx={{ color: "primary.main", backgroundColor: isAdded ? "error.main" : "primary.light", "&:hover": { backgroundColor: isAdded ? "error.dark" : "primary.dark" } }}
                    aria-label="add user" size="small" edge="end" color="primary"

                >
                    {
                        isAdded ? <RemoveIcon /> : <AddIcon />
                    }
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem);