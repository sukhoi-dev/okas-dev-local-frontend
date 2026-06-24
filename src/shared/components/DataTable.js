import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Box, TextField, InputAdornment, Skeleton, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import EmptyState from './EmptyState';

export default function DataTable({ columns, rows = [], loading = false, searchable = true, rowsPerPageOptions = [10, 25, 50] }) {
  const [page, setPage]       = useState(0);
  const [rowsPerPage, setRPP] = useState(rowsPerPageOptions[0]);
  const [search, setSearch]   = useState('');

  const filtered = search
    ? rows.filter((row) =>
        columns.some((col) => String(row[col.field] ?? '').toLowerCase().includes(search.toLowerCase()))
      )
    : rows;

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {searchable && (
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Search..."
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ width: 280 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </Box>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ minWidth: col.minWidth }} align={col.align || 'left'}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.field}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : paginated.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <EmptyState title="No records found" />
                    </TableCell>
                  </TableRow>
                )
              : paginated.map((row, i) => (
                  <TableRow key={row.id ?? i} hover>
                    {columns.map((col) => (
                      <TableCell key={col.field} align={col.align || 'left'}>
                        {col.renderCell ? col.renderCell(row) : (row[col.field] ?? '—')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRPP(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Box>
  );
}
