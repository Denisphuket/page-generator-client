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
  const [yandexMetrikaId, setYandexMetrikaId] = useState(''); // Поле для ID Яндекс.Метрики
  const [error, setError] = useState(''); // Для отображения ошибок

  useEffect(() => {
    console.log('PageEditor useEffect triggered');
    if (page) {
      console.log('Loading page data', page);
      setTitle(page.title || '');
      setPath(page.path || '');
      setHtml(page.html || '');
      setImages(page.images || {});
      setYandexMetrikaId(page.yandexMetrikaId || ''); // Подтягиваем ID Яндекс.Метрики при редактировании
    } else {
      console.log('Resetting fields for new page');
      setTitle('');
      setPath('');
      setHtml('');
      setImages({});
      setYandexMetrikaId(''); // Очищаем ID Яндекс.Метрики при создании новой страницы
      setError('');
    }
  }, [page, open]);

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

  const preparePageData = (page: any) => {
    const { id, createdAt, updatedAt, ...cleanedPage } = page;
    return cleanedPage;
  };


  const handleSave = async () => {
    const newPage = { ...page, title, path, html, images, yandexMetrikaId }; // Добавляем ID Яндекс.Метрики
    console.log(JSON.stringify(images))
    const cleanedPageObj = preparePageData(newPage);
    try {
      await onSave(cleanedPageObj);
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
        <TextField
          margin="dense"
          label="ID Яндекс.Метрики"
          fullWidth
          value={yandexMetrikaId}
          onChange={(e) => setYandexMetrikaId(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
          Загрузить еще изображение
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        <div style={{ marginTop: '10px' }}>

          {Object.entries(images || {}).map(([marker, src]) => (
            <div key={marker} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              {src && <img src={src} alt={marker} style={{ width: '100px', marginRight: '10px' }} />}
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
