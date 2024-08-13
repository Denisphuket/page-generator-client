import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Центрирование по вертикали
      >
        <Typography variant="h4" gutterBottom>
          404 - Страница не найдена
        </Typography>
        <Typography variant="body1" align="center">
          К сожалению, страница, которую вы ищете, не существует.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
