import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Container, Paper, Box, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PageService from '../services/PageService';
import PageEditor from './PageEditor';
import AuthService from '../services/AuthService';
import LogoutIcon from '@mui/icons-material/Logout';
import Login from './Login';
import Register from './Register';
import Loader from './Loader';

const AdminPanel: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [page, setPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthService.getToken();
      if (token) {
        try {
          await AuthService.verifyToken(token);
          setIsAuthenticated(true);
        } catch (error) {
          AuthService.logout();
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPages(page);
    }
  }, [isAuthenticated, page]);

  const fetchPages = async (pageNumber: number) => {
    try {
      const response = await PageService.getPages(pageNumber, 10); // Передаем номер страницы и лимит
      setPages(response.pages);
      setTotalPages(response.pagesCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingPage(null);
    setIsEditorOpen(true);
  };

  const handleSave = async (page: any) => {
    await PageService.savePage(page);
    fetchPages(page);
    setIsEditorOpen(false);
  };

  const handleDelete = async (pageId: string) => {
    await PageService.deletePage(pageId);
    fetchPages(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return isRegistering ? (
      <Register onRegister={handleRegister} onToggleLogin={toggleRegister} />
    ) : (
      <Login onLogin={handleLogin} onToggleRegister={toggleRegister} />
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
          <Typography variant="h4" gutterBottom>
            Управление страницами
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => AuthService.logout()}
          >
            Выйти
          </Button>
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
          Создать новую страницу
        </Button>
        <List>
          {pages.map((page) => (
            <ListItem key={page._id} button onClick={() => handleEdit(page)}>
              <ListItemText primary={page.title} secondary={page.path} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="open"
                  component="a"
                  href={`/${page.path}`}
                  target="_blank"
                >
                  <OpenInNewIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(page._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>
      <PageEditor open={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSave={handleSave} page={editingPage} />
    </Container>
  );
};

export default AdminPanel;
