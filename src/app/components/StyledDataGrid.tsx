// components/StyledDataGrid.tsx
'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

const StyledDataGridRoot = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  // General
  '& .MuiDataGrid-overlay': {
    background: 'transparent',
  },

  // Header
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontWeight: 600,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 700,
    letterSpacing: 0.2,
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },

  // Cells
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },

  // Row striping
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
  },

  // Row hover
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(25,118,210,0.06)' : 'rgba(25,118,210,0.12)',
    transition: 'background-color 160ms ease',
  },

  // Footer
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
  },

  // Checkbox selection (if enabled)
  '& .MuiDataGrid-checkboxInput': {
    color: theme.palette.primary.main,
  },

  // Toolbar spacing (when used)
  '& .MuiDataGrid-toolbarContainer': {
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
}));

export default function StyledDataGrid(props: DataGridProps) {
  return <StyledDataGridRoot {...props} />;
}
