import { useState, useEffect } from 'react';
import './notepages.css';

interface PageListItem {
  pageNumber: number;
  title: string;
}

interface NotePagesProps {
  pages?: PageListItem[];
  pageNo: number;
  setPageNo: (pageNo: number) => void;
}

export default function NotePages({ pages, pageNo, setPageNo }: NotePagesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [list, setList] = useState<PageListItem[] | undefined>();

  useEffect(() => {
    setList(pages);
  }, [pages]);

  return (
    <div className="note-pages">
      <ul className="page-number-list">
        <li className="page-number-list-title">#</li>
        {!list || list.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li className="page-number-list-item" id="page-number-list-item-id" key={i}>
              -
            </li>
          ))
        ) : (
          list.map((item, i) => {
            const isDisable = item.pageNumber === 0 || item.title === ' - ';
            const isSelected = item.pageNumber === pageNo;
            const isEnable = hoveredIndex === i && !isDisable && !isSelected;
            return (
              <li
                key={i}
                className={[
                  'page',
                  isEnable ? '-enable' : '',
                  isSelected ? '-selected' : '',
                  isDisable ? '-disable' : '',
                ].join('')}
                id="page-number-list-item-id"
                onMouseEnter={() => {
                  if (!isDisable && !isSelected) setHoveredIndex(i);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={!isDisable && !isSelected ? () => setPageNo(item.pageNumber) : undefined}
              >
                {item.pageNumber || '-'}
              </li>
            );
          })
        )}
      </ul>
      <ul className="page-name-list">
        <li className="page-name-list-title">TITLE</li>
        {!list || list.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li className="page-name-list-item" id="page-name-list-item-id" key={i}>
              -
            </li>
          ))
        ) : (
          list.map((item, i) => {
            const isDisable = item.pageNumber === 0 || item.title === ' - ';
            const isSelected = item.pageNumber === pageNo;
            const isEnable = hoveredIndex === i && !isDisable && !isSelected;
            return (
              <li
                key={i}
                className={[
                  'page',
                  isEnable ? '-enable' : '',
                  isSelected ? '-selected' : '',
                  isDisable ? '-disable' : '',
                ].join('')}
                id="page-name-list-item-id"
                onMouseEnter={() => {
                  if (!isDisable && !isSelected) setHoveredIndex(i);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={!isDisable && !isSelected ? () => setPageNo(item.pageNumber) : undefined}
              >
                {item.title || '-'}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
