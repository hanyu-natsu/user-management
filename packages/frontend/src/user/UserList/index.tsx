import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { useDeleteUserMutation, useGetUsersQuery } from '@app/api/slice';

import {
  AddButton,
  AddButtonContainer,
  Container,
  ContentPaper,
  StyledPagination,
} from './styles';

export default function UserList() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data } = useGetUsersQuery({ page, search: searchTerm });
  const [deleteUser] = useDeleteUserMutation();

  const pageCount = data?.total ? Math.ceil(data.total / 10) : 1;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value || '');
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDelete = (id: string) => {
    void deleteUser({ id });
  };

  return (
    <Container>
      <ContentPaper>
        <TextField
          onChange={handleSearchChange}
          label="Search User"
          variant="outlined"
          fullWidth
        />

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Birthdate</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.birthdate.toString()}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="Edit"
                      onClick={() => {
                        void navigate(`/user/${user._id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => {
                        handleDelete(user._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <StyledPagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
        />

        <AddButtonContainer>
          <AddButton
            onClick={() => {
              void navigate('/user/new');
            }}
          >
            Add User
          </AddButton>
        </AddButtonContainer>
      </ContentPaper>
    </Container>
  );
}
