import React, { useRef } from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  Tooltip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setIsFileMenu } from '../../redux/reducers/misc';
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({ anchorEl, chatId }) => {
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const { isFileMenu } = useSelector((state) => state.misc);

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const [sendAttachments] = useSendAttachmentsMutation();

  const handleClose = () => {
    dispatch(setIsFileMenu(false)); // Close file menu
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return alert(`You can only send 5 ${key} at a time`);

    handleClose();

    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      files.forEach((file) => formData.append('files', file));

      const res = await sendAttachments(formData);
      if (res.data) alert(`${key} sent successfully`);
      else alert(`Failed to send ${key} attachment`);
    } catch (error) {
      console.error(error);
      alert(`Error sending ${key} attachment`);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && isFileMenu}
      onClose={handleClose}
    >
      <MenuList>
        {/* Image */}
        <MenuItem onClick={selectImage}>
          <Tooltip title="Image" placement="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }}>Image</ListItemText>
            </div>
          </Tooltip>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            ref={imageRef}
            style={{ display: 'none' }}
            onChange={(e) => fileChangeHandler(e, 'Images')}
          />
        </MenuItem>

        {/* Audio */}
        <MenuItem onClick={selectAudio}>
          <Tooltip title="Audio" placement="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AudioFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }}>Audio</ListItemText>
            </div>
          </Tooltip>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav, audio/ogg"
            ref={audioRef}
            style={{ display: 'none' }}
            onChange={(e) => fileChangeHandler(e, 'Audios')}
          />
        </MenuItem>

        {/* Video */}
        <MenuItem onClick={selectVideo}>
          <Tooltip title="Video" placement="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <VideoFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }}>Video</ListItemText>
            </div>
          </Tooltip>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            ref={videoRef}
            style={{ display: 'none' }}
            onChange={(e) => fileChangeHandler(e, 'Videos')}
          />
        </MenuItem>

        {/* File */}
        <MenuItem onClick={selectFile}>
          <Tooltip title="File" placement="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UploadFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }}>File</ListItemText>
            </div>
          </Tooltip>
          <input
            type="file"
            multiple
            ref={fileRef}
            style={{ display: 'none' }}
            onChange={(e) => fileChangeHandler(e, 'Files')}
          />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default FileMenu;
