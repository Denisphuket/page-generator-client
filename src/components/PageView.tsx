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
        try {
          const fetchedPage = await PageService.getPageByPath(path);
          if (fetchedPage) {
            setPage(fetchedPage);
          }
        } catch (error) {
          console.error('Failed to fetch page', error);
          navigate('/404');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPage();
  }, [path, navigate]);

  useEffect(() => {
    if (page?.yandexMetrikaId) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${page.yandexMetrikaId}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `;
      document.body.appendChild(script);

      const noScript = document.createElement('noscript');
      noScript.innerHTML = `
        <div><img src="https://mc.yandex.ru/watch/${page.yandexMetrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>
      `;
      document.body.appendChild(noScript);
    }
  }, [page]);

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
  const pageTitle = doc.title || 'Default Title';

  const renderedHtml = page.html.replace(/{{(image\d+)}}/g, (match: any, marker: string) => {
    return page.images[marker] ? `${page.images[marker]}` : match;
  });

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
    </>
  );
};

export default PageView;
