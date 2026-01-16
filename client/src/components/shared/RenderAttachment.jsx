import React from 'react';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

// Optional: define transformImage if needed
import {transformImage} from "../../lib/features.js"

const RenderAttachment = ({ file, url }) => {
  switch (file) {
    case 'image':
      return (
        <img
          src={transformImage(url, 200)}
          width={"200px"}
          height={"150px"}
          style={{ objectFit: 'contain' }}
          alt=""
        />
      );

    case 'video':
      return <video src={url} preload="none" width="200px" controls />;

    case 'audio':
      return <audio src={url} preload="none" controls />;

    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
