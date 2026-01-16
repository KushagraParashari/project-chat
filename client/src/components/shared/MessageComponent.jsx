import React from 'react'
import { Typography, Box } from '@mui/material';
import { memo } from 'react';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import {motion} from "framer-motion"
import { Opacity } from '@mui/icons-material';

const MessageComponent = ({message, user}) => {
    const {sender, content, attachments=[], createdAt }=message;
    const sameSender=sender?._id===user?.id
    const timeago=moment(createdAt).fromNow();
  return (
    <motion.div 
    initial={{opacity:0, x:"-100%"}} whileInView={{opacity:1, x:0}} 
    style={{alignSelf:sameSender?"flex-end":"flex-start", backgroundColor:"white", color:"black", borderRadius:"5px", padding:"00.5rem", width:"fit-content",}} >
       {
        !sameSender && <Typography color={"#2694ab"} fontWeight={"600"} varient="caption" >{sender.name}</Typography>
       }
       {
        content && <Typography>{content}</Typography>
}
{
  attachments.length>0 && attachments.map((attachment, index)=>{
    const url=attachment.url;
    const file=fileFormat(url);
  
  return(
    <Box key ={index}><a href="" target="_blank" download style={{ color:"black", }} ><RenderAttachment file={file} url={url}/> </a></Box>
  )
}
  )
}
{
  <Typography variant="caption" color={"text.secondary"}>{timeago}</Typography>
}
</motion.div>
  )
}

export default memo(MessageComponent)
