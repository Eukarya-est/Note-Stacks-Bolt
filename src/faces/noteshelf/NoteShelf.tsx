import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Shelf from '../../components/shelf/Shelf';
import NotePageController from '../../components/pagelistcontroller/PageListController';
import NotePages from '../../components/notepages/NotePages';
import NotePage from '../../components/notepage/NotePage';
import { notesService } from '../../services/notesService';
import './noteshelf.css';

interface PageListItem {
  pageNumber: number;
  title: string;
}

interface PageInfo {
  cover: string;
  pageNumber: number;
  revision: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
}

export default function NoteShelf() {
  const navigate = useNavigate();
  const { category: categoryParam, pageNo: pageNoParam } = useParams<{
    category?: string;
    pageNo?: string;
  }>();

  const [shelfCategory, setShelfCategory] = useState<string[]>([]);
  const [openShelf, setShelf] = useState(true);
  const [category, setCategory] = useState<string | undefined>(categoryParam);
  const [pagesBound, setBound] = useState<number | undefined>();
  const [pageNo, setPageNo] = useState<number>(0);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [page, setPage] = useState<PageInfo | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const categories = await notesService.getCategories();
      setShelfCategory(categories.map((c) => c.name));
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    }
  }, []);

  const loadCategoryPages = useCallback(
    async (categoryName: string, targetPageNo?: number) => {
      setLoading(true);
      setError(null);
      try {
        const categoryData = await notesService.getCategoryByName(categoryName);
        if (!categoryData) {
          setError('Category not found');
          return;
        }

        const totalPages = await notesService.getTotalPages(categoryData.id);
        setBound(totalPages);

        const currentPage = targetPageNo || totalPages;
        const startIndex = Math.max(0, currentPage - 3);
        const pagesList = await notesService.getPagesByCategory(categoryData.id, 5, startIndex);

        const formattedPages: PageListItem[] = pagesList.map((p) => ({
          pageNumber: p.page_number,
          title: p.title,
        }));

        setPages(formattedPages);

        if (currentPage > 0 && currentPage <= totalPages) {
          const currentPageData = await notesService.getPageByNumber(
            categoryData.id,
            currentPage
          );
          if (currentPageData) {
            setPage({
              cover: currentPageData.cover,
              pageNumber: currentPageData.page_number,
              revision: currentPageData.revision,
              createdAt: currentPageData.created_at,
              updatedAt: currentPageData.updated_at,
              title: currentPageData.title,
              content: currentPageData.content,
            });
            setPageNo(currentPage);
          }
        }
      } catch (err) {
        console.error('Failed to load pages:', err);
        setError('Failed to load pages');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
      const pageNumber = pageNoParam ? parseInt(pageNoParam, 10) : undefined;
      loadCategoryPages(categoryParam, pageNumber);
    }
  }, [categoryParam, pageNoParam, loadCategoryPages]);

  const handleCategorySelect = (ctgr: string) => {
    navigate(`/shelf/${ctgr}`);
    setCategory(ctgr);
  };

  const handlePageNumber = (no: number) => {
    if (!category || !pagesBound) return;

    if (no < 1 || no > pagesBound) {
      alert('Page number out of range');
      return;
    }
    navigate(`/shelf/${category}/${no}`);
  };

  return (
    <div className={openShelf ? 'noteframe-shelf-opend' : 'noteframe-shelf-closed'}>
      <Shelf
        openShelf={openShelf}
        shelfCategory={shelfCategory}
        setCategory={handleCategorySelect}
        category={category}
      />
      <NotePageController
        toggleShelf={() => setShelf(!openShelf)}
        pagesBound={pagesBound}
        setBound={setBound}
        setPageNo={handlePageNumber}
        pageNo={pageNo}
      />
      <NotePages setPageNo={handlePageNumber} pageNo={pageNo} pages={pages} />
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && <NotePage category={category} pageNo={pageNo} page={page} />}
    </div>
  );
}
