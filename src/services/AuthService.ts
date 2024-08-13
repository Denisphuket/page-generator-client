const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

// Функция для входа в систему
const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token); // Сохраняем токен в LocalStorage
  window.location.href = '/admin'; // Явное перенаправление после входа
};

// Функция для регистрации администратора
const register = async (username: string, password: string, secretCode: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, secretCode }),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token); // Сохраняем токен в LocalStorage после регистрации
  window.location.href = '/admin'; // Перенаправление после успешной регистрации
};

// Проверка аутентификации
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

// Функция для выхода из системы
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/admin'; // Перенаправление на страницу логина после выхода
};

// Получение токена из LocalStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Функция для проверки токена
const verifyToken = async (token: string) => {
  const response = await fetch(`${API_URL}/verify-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
};

const AuthService = {
  login,
  register,
  isAuthenticated,
  logout,
  getToken,
  verifyToken
};

export default AuthService;
