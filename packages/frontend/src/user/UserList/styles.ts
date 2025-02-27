import { Box, Button, Pagination, Paper } from '@mui/material';
import styled from 'styled-components';

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

export const ContentPaper = styled(Paper).attrs({ elevation: 2 })`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 80%;
  max-width: 1000px;
`;

export const StyledPagination = styled(Pagination)`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

export const AddButtonContainer = styled(Box)`
  display: flex;
  flex-direction: row-reverse;
`;

export const AddButton = styled(Button)``;
