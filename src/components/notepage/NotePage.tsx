import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import './notepage.css';
import './style-base.css';
import './style-codemirror.css';
import './style-mathjax-ni.css';
import './style-mathjax.css';
import './style-theme_css.css';

interface NotePageProps {
  page?: {
    cover: string;
    pageNumber: number;
    revision: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
  };
  category?: string;
  pageNo: number;
}

export default function NotePage({ page }: NotePageProps) {
  const [document, setDocument] = useState<string>('-');

  useEffect(() => {
    if (page?.content) {
      setDocument(page.content);
    } else {
      setDocument('-');
    }
  }, [page]);

  return (
    <div className="note-page">
      <div className="page">
        <ul className="main-info">
          <li className="main-info-title">COVER</li>
          <li className="main-info-item">{page?.cover ?? '-'}</li>
          <li className="main-info-title">No.</li>
          <li className="main-info-item">{page?.pageNumber ?? '-'}</li>
          <li className="main-info-title">REVISION</li>
          <li className="main-info-item">{page?.revision ?? '-'}</li>
        </ul>
        <ul className="date-info">
          <li className="date-info-title">CREATED</li>
          <li className="date-info-item">
            {page?.createdAt ? new Date(page.createdAt).toLocaleDateString() : '-'}
          </li>
          <li className="date-info-title">REVISED</li>
          <li className="date-info-item">
            {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : '-'}
          </li>
        </ul>
      </div>
      <div className="content">
        <ul className="title-info">
          <li className="title-title">TITLE</li>
          <li className="title">{page?.title ?? '-'}</li>
        </ul>
        <ul className="content-info">
          <li className="content">{parse(document)}</li>
        </ul>
      </div>
    </div>
  );
}
