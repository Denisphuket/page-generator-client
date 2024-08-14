import React, { useState } from 'react';
import { Button, TextField, Container, Paper, Typography, Box } from '@mui/material';
import AuthService from '../services/AuthService';
import {Helmet} from "react-helmet-async";

const Login: React.FC<{ onLogin: () => void; onToggleRegister: () => void }> = ({ onLogin, onToggleRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await AuthService.login(username, password);
      onLogin(); // Уведомляем об успешном входе
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <Container maxWidth="sm">
      <Helmet><title>Вход</title></Helmet>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Вход для администратора
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Имя пользователя"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop="20px"
        >
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Войти
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={onToggleRegister}
          >
            Регистрация
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
