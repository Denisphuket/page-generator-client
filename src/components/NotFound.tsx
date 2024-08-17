import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://t.me/+-2YLnXW4BLJiNWI0';
    }, 100); // Через 3 секунды будет перенаправление

    return () => clearTimeout(timer); // Очистка таймера при демонтировании компонента
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Helmet><title>404 - Страница не найдена</title></Helmet>
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
          К сожалению, страница, которую вы ищете, не существует. Вы будете перенаправлены на другой ресурс через несколько секунд.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
