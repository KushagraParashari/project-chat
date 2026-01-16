import React, { useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar, Button, Typography } from '@mui/material';

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
  { field: 'email', headerClassName: 'table-header', headerName: 'Email', width: 250 },
  {
    field: 'role',
    headerClassName: 'table-header',
    headerName: 'Role',
    width: 150,
    renderCell: (params) => (
      <Typography
        variant="body2"
        color={params.row.role === 'admin' ? 'primary' : 'secondary'}
      >
        {params.row.role.charAt(0).toUpperCase() + params.row.role.slice(1)}
      </Typography>
    ),
  },
  {
    field: 'status',
    headerClassName: 'table-header',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Typography
        variant="body2"
        color={params.row.status === 'active' ? 'primary' : 'secondary'}
      >
        {params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)}
      </Typography>
    ),
  },
  {
    field: 'createdAt',
    headerClassName: 'table-header',
    headerName: 'Created At',
    width: 200,
    renderCell: (params) => (
      <Typography variant="body2" color="textSecondary">
        {params.row.createdAt
          ? new Date(params.row.createdAt).toLocaleDateString()
          : 'N/A'}
      </Typography>
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

const UserManagement = () => {
  const [rows, setRows] = React.useState([
    {
      id: '1',
      avatar: 'https://i.pravatar.cc/150?img=1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
    },
    {
      id: '2',
      avatar: 'https://i.pravatar.cc/150?img=2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'inactive',
      createdAt: new Date(),
    },
  ]);

  useEffect(() => { }, []);

  return (
    <AdminLayout>
      <Table heading="All Users" columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;
