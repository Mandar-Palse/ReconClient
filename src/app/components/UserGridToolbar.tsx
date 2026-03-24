'use client';
import * as React from 'react';
// Import the new Toolbar and specific Export trigger
import { Toolbar, ExportCsv, GridToolbarContainer } from '@mui/x-data-grid'; 
import { Box, Button, TextField } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onClearFilters?: () => void;
};

export function UserGridToolbar({ search, onSearchChange, onClearFilters }: Props) {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search name or email…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 280 }}
      />
      
      {/* 
        In v8, the standalone Density button is removed. 
        MUI recommends using the unified <Toolbar /> or custom menus.
        For now, let's use the new Export trigger:
      */}
      <ExportCsv /> 
      
      <Box sx={{ flex: 1 }} />
      <Button
        size="small"
        variant="outlined"
        startIcon={<ClearAllIcon />}
        onClick={onClearFilters}
      >
        Clear filters
      </Button>
    </GridToolbarContainer>
  );
}
