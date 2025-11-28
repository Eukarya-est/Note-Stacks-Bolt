import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import { SearchResult } from '../../types';
import './search.css';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await notesService.searchPages(searchQuery);
      setResults(data);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, handleSearch]);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/shelf/${result.category_name}/${result.page_number}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase()
        ? <mark key={i}>{part}</mark>
        : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search notes by title or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>×</button>
        </div>

        <div className="search-results">
          {loading && <div className="search-loading">Searching...</div>}

          {error && <div className="search-error">{error}</div>}

          {!loading && !error && results.length === 0 && query.trim() && (
            <div className="search-no-results">No results found</div>
          )}

          {!loading && !error && results.length > 0 && (
            <ul className="search-results-list">
              {results.map((result) => (
                <li
                  key={result.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="search-result-header">
                    <span className="search-result-category">{result.category_name}</span>
                    <span className="search-result-page">Page {result.page_number}</span>
                  </div>
                  <div className="search-result-title">
                    {highlightText(result.title, query)}
                  </div>
                  <div className="search-result-meta">
                    {result.cover && <span className="search-result-cover">{result.cover}</span>}
                    <span className="search-result-revision">Rev. {result.revision}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
