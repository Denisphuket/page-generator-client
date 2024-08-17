import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Container, Paper, Box, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PageService from '../services/PageService';
import PageEditor from './PageEditor';
import AuthService from '../services/AuthService';
import LogoutIcon from '@mui/icons-material/Logout';
import Login from './Login';
import Register from './Register';
import { Helmet } from 'react-helmet-async';

const AdminPanel: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!AuthService.getToken());
  const [isRegistering, setIsRegistering] = useState(false);
  const [page, setPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(1); // Общее количество страниц

  useEffect(() => {
    console.log('AdminPanel useEffect fetchPages')
    fetchPages(page);
  }, [page]);

  const fetchPages = useCallback(async (pageNumber: number) => {
    try {
      console.log('fetchPages')
      if(isAuthenticated){
        const response = await PageService.getPages(pageNumber, 10); // Передаем номер страницы и лимит
        setPages(response.pages);
        setTotalPages(response.pagesCount);
      }

    } catch (error) {
      console.error(error);
    } finally {
    }
  }, [isAuthenticated]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleEdit = useCallback((page: any) => {
    setEditingPage(page);
    setIsEditorOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingPage(null);
    setIsEditorOpen(true);
  }, []);

  const handleSave = useCallback(async (pageObj: any) => {
    await PageService.savePage(pageObj);
    fetchPages(page);
    setIsEditorOpen(false);
  }, [fetchPages]);

  const handleDelete = useCallback(async (pageId: string) => {
    await PageService.deletePage(pageId);
    fetchPages(page);
  }, [fetchPages, page]);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleRegister = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const toggleRegister = useCallback(() => {
    setIsRegistering(!isRegistering);
  }, [isRegistering]);

  const loginOrRegister = useMemo(() => {
    if (isRegistering) {
      return <Register onRegister={handleRegister} onToggleLogin={toggleRegister} />;
    }
    return <Login onLogin={handleLogin} onToggleRegister={toggleRegister} />;
  }, [isRegistering, handleRegister, toggleRegister, handleLogin]);


  if (!isAuthenticated) {
    return loginOrRegister;
  }

  return (
    <Container maxWidth="md">
      <Helmet><title>Панель Администратора</title></Helmet>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
          <Typography variant="h4" gutterBottom>
            Управление страницами
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => {
              AuthService.logout();
              setIsAuthenticated(false);
            }}
          >
            Выйти
          </Button>
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
          Создать новую страницу
        </Button>

          <List>
            {pages.map((page) => (
              <ListItem key={page.id} onClick={() => handleEdit(page)}>
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
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(page.id)}>
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
