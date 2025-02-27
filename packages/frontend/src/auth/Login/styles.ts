import { Box, Paper } from '@mui/material';
import styled from 'styled-components';

export const Container = styled(Box)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FormCard = styled(Paper).attrs({ elevation: 2 })`
  padding: 20px;
`;
