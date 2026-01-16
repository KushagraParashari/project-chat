import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import AvatarCard from '../../components/shared/AvatarCard';
import { sampleChatsData as dashboardData } from '../../constants/sampleData';
import { transformImage } from '../../lib/features';

const columns = [
  { field: 'id', headerClassName: 'table-header', headerName: 'ID', width: 200 },
  {
    field: 'avatar',
    headerClassName: 'table-header',
    headerName: 'Avatar',
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },

  { field: 'name', headerClassName: 'table-header', headerName: 'Name', width: 200 },
  { field: 'totalMembers', headerClassName: 'table-header', headerName: 'Total Members', width: 120 },
  {
    field: 'members',
    headerClassName: 'table-header',
    headerName: 'Members',
    width: 400,
    renderCell: (params) => <div style={{ padding: "0.25rem", display: "flex", alignItems: "center", position: "relative" }}>
      <AvatarCard max={5} avatar={params.row.members} />
    </div>,
  },
  {
    field: 'totalMessages',
    headerClassName: 'table-header',
    headerName: 'Total Messages',
    width: 150,
  },
  {
    field: 'creator',
    headerClassName: 'table-header',
    headerName: 'Created By',
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <Typography variant="body2" color="textSecondary">
          {params.row.creator.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'actions',
    headerClassName: 'table-header',
    headerName: 'Actions',
    width: 200,
    renderCell: () => (
      <Button variant="contained" color="primary" size="small">
        Edit
      </Button>
    ),
  },
  {
    field: 'friends',
    headerClassName: 'table-header',
    headerName: 'Friends',
    width: 150,
  },
  {
    field: 'groups',
    headerClassName: 'table-header',
    headerName: 'Groups',
    width: 150,
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar, 50),
        members: i.members.map((m) => transformImage(m, 50)),
        creator: {
          ...i.creator,
          avatar: transformImage(i.creator.avatar, 50),
        },
      }))
    );
  }, []);


  return (
    <AdminLayout>
      <Table heading="All Chats" columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default ChatManagement;
