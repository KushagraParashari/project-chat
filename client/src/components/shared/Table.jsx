import React from 'react';
import { Container } from '@mui/system';
import { Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // ✅ Correct import
import { matblack } from '../../constants/color';

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container sx={{ height: '100vh' }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          textAlign: 'center',
          borderRadius: '1rem',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
          loading={rows.length === 0}
          sx={{
            height: 600,
            border: 'none',
            '.table-header': {
              bgcolor: matblack,
              color: 'white',
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
