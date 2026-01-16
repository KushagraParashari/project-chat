import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'


const columns = [
  { field: 'id', headerClassName: 'table-header', headerName: 'ID', width: 200 },
  {
    field: 'attcahments',
    headerClassName: 'table-header',
    headerName: 'Attachments',
    width: 200,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  { field: 'content', headerClassName: 'table-header', headerName: 'Content', width: 400 },
  {
    field: 'sender',
    headerClassName: 'table-header',
    headerName: 'Send By',
    width: 200,
    renderCell: (params) => (
      <Stack>
      <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
      <Typography variant="body2" color="textSecondary">
        {params.row.sender.name}
      </Typography>
      </Stack>
    ),
  },
  { field: 'chat', headerClassName: 'table-header', headerName: 'Chat', width: 220 },
  {
    field: 'groupChat',
    headerClassName: 'table-header',
    headerName: 'Group Chat',
    width: 100,
   
  },
  {
    field: 'createdAt',
    headerClassName: 'table-header',
    headerName: 'Created At',
    width: 200,
   
  },
 
];

const MessageManagement = () => {
  return (
   <AdminLayout>
     <div>MessageManagement</div>
   </AdminLayout>
  )
}

export default MessageManagement