import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface PageEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (page: any) => void;
  page: any | null;
}

const PageEditor: React.FC<PageEditorProps> = ({ open, onClose, onSave, page }) => {
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [html, setHtml] = useState('');
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState(''); // Для отображения ошибок

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setPath(page.path);
      setHtml(page.html);
      setImages(page.images || {});
    } else {
      setTitle('');
      setPath('');
      setHtml('');
      setImages({});
      setError('');
    }
  }, [page, open]); // Добавил open в зависимости, чтобы очищать инпуты при создании новой страницы

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const marker = `image${Object.keys(images).length + 1}`;
        setImages({ ...images, [marker]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (marker: string) => {
    const updatedImages = { ...images };
    delete updatedImages[marker];
    setImages(updatedImages);
  };

  const handleSave = async () => {
    const newPage = { ...page, title, path, html, images };
    try {
      await onSave(newPage);
      onClose();
    } catch (error) {
      setError('Ссылка уже существует. Пожалуйста, выберите другой путь.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{page ? 'Редактировать страницу' : 'Создать новую страницу'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Название"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ссылка"
          fullWidth
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <TextField
          margin="dense"
          label="HTML код"
          fullWidth
          multiline
          rows={6}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
          Загрузить еще изображение
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        <div style={{ marginTop: '10px' }}>
          {Object.entries(images).map(([marker, src]) => (
            <div key={marker} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img src={src} alt={marker} style={{ width: '100px', marginRight: '10px' }} />
              <TextField
                value={`{{${marker}}}`}
                InputProps={{
                  readOnly: true,
                }}
                style={{ marginRight: '10px' }}
              />
              <IconButton onClick={() => handleDeleteImage(marker)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button onClick={handleSave} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageEditor;
