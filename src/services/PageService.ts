import AuthService from './AuthService';

const API_URL = `${process.env.REACT_APP_API_URL}/pages`;

// Получение всех страниц
const getPages = async (page = 1, limit = 10) => {
  // Преобразуем значения page и limit в числа и проверяем, что они валидны
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    throw new Error('Page and limit query parameters must be valid numbers.');
  }

  const token = AuthService.getToken();

  if (!token) {
    throw new Error('No token available');
  }

  const response = await fetch(`${API_URL}?page=${pageNumber}&limit=${limitNumber}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      AuthService.logout();
      window.location.href = '/admin';
    }
    throw new Error('Failed to fetch pages');
  }

  return await response.json();
};



// Получение страницы по пути
const getPageByPath = async (path: string) => {

  const response = await fetch(`${API_URL}/${path}`);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      AuthService.logout();
      window.location.href = '/admin';
    }
    throw new Error('Failed to fetch page');
  }

  return await response.json();
};


// Сохранение страницы (создание/обновление)
const savePage = async (page: any) => {
  const token = AuthService.getToken();

  if (!token) {
    throw new Error('No token available');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(page),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      AuthService.logout();
      window.location.href = '/admin';
    }
    throw new Error('Failed to save page');
  }

  return await response.json();
};

// Удаление страницы
const deletePage = async (pageId: string) => {
  const token = AuthService.getToken();

  if (!token) {
    throw new Error('No token available');
  }

  const response = await fetch(`${API_URL}/${pageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      AuthService.logout();
      window.location.href = '/admin';
    }
    throw new Error('Failed to delete page');
  }

  return await response.json();
};

const PageService = {
  getPages,
  getPageByPath,
  savePage,
  deletePage,
};

export default PageService;
