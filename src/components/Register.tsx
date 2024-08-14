import React, { useState } from 'react';
import {Button, TextField, Container, Paper, Typography, Box} from '@mui/material';
import AuthService from '../services/AuthService';
import {Helmet} from "react-helmet-async";

const Register: React.FC<{ onRegister: () => void; onToggleLogin: () => void }> = ({ onRegister, onToggleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState(''); // Поле для проверочного кода
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await AuthService.register(username, password, secretCode);
      onRegister(); // Уведомляем об успешной регистрации
    } catch (err) {
      setError('Ошибка регистрации. Проверьте введенные данные и попробуйте снова.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Helmet><title>Регистрация</title></Helmet>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Регистрация администратора
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
        <TextField
          label="Проверочный код"
          fullWidth
          margin="normal"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop="20px"
        >
        <Button variant="contained" color="primary" onClick={handleRegister} style={{ marginTop: '10px' }}>
          Зарегистрироваться
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={onToggleLogin}
          style={{ marginTop: '10px', display: 'block' }}
        >
          Войти
        </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
