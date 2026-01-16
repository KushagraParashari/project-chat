import React, { memo } from 'react';
import { Link } from '../styles/StyledComponents';
import { Typography, Stack, Box } from '@mui/material';
import AvatarCard from './AvatarCard';
import {motion} from 'framer-motion';

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <motion.div
        initial={{ opacity:0, y: "-100%" }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ delay: index*0.1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: sameSender ? 'black' : 'unset',
          color: sameSender ? 'white' : 'unset',
          position: 'relative',
          gap: '10px',
        }}
      >
        {/* Avatar + Name Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
          <AvatarCard avatar={avatar} index={index} />
          <Stack spacing={0.3}>
            <Typography>{name}</Typography>
            {newMessageAlert && (
              <Typography variant="body2" color="gray">
                {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        </div>

        {/* Online Indicator */}
        {isOnline && (
          <Box
            sx={{
              backgroundColor: 'green',
              borderRadius: '50%',
              width: '10px',
              height: '10px',
              minWidth: '10px',
              marginLeft: 'auto',
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
