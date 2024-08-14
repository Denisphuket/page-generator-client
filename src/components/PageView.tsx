// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import PageService from '../services/PageService';
// import '../App.css';
//
// const PageView: React.FC = () => {
//   const { path } = useParams<{ path: string }>();
//   const [page, setPage] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const fetchPage = async () => {
//       if (path) {
//         setLoading(true); // Начало загрузки
//         try {
//           const fetchedPage = await PageService.getPageByPath(path);
//           if (!fetchedPage) {
//             // Если страница не найдена, перенаправляем на 404
//             navigate('/404');
//           } else {
//             setPage(fetchedPage);
//           }
//         } catch (error) {
//           console.error("Failed to fetch page", error);
//           navigate('/404');
//         } finally {
//           setLoading(false); // Окончание загрузки
//         }
//       }
//     };
//     fetchPage();
//   }, [path, navigate]);
//
//   if (loading) {
//     return (
//       <div className="loader-container">
//         Загрузка...
//         <span className="loader"></span>
//       </div>
//     );
//   }
//
//   if (!page) {
//     return <div>Страница не найдена</div>; // На случай если страница не существует
//   }
//
//   const renderedHtml = page.html.replace(/{{(image\d+)}}/g, (match: any, marker: string) => {
//     return page.images[marker] ? `${page.images[marker]}` : match;
//   });
//
//   return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
// };
//
// export default PageView;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageService from '../services/PageService';
import '../App.css';

const PageView: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const [page, setPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      if (path) {
        setLoading(true);
        try {
          const fetchedPage = await PageService.getPageByPath(path);
          if (!fetchedPage) {
            navigate('/404');
          } else {
            setPage(fetchedPage);
          }
        } catch (error) {
          console.error("Failed to fetch page", error);
          navigate('/404');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPage();
  }, [path, navigate]);

  if (loading) {
    return (
      <div className="loader-container">
        Загрузка...
        <span className="loader"></span>
      </div>
    );
  }

  if (!page) {
    return <div>Страница не найдена</div>;
  }

  // Извлечение заголовка страницы
  const parser = new DOMParser();
  const doc = parser.parseFromString(page.html, 'text/html');
  const pageTitle = doc.title;

  // Заменяем {{image}} плейсхолдеры на реальные изображения
  const renderedHtml = page.html.replace(/{{(image\d+)}}/g, (match: any, marker: string) => {
    return page.images[marker] ? `${page.images[marker]}` : match;
  });

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {/* Здесь можно добавить другие мета-теги */}
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
    </>
  );
};

export default PageView;
