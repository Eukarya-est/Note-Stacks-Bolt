import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Search from '../../components/search/Search';
import './topbar.css';

export default function TopBar() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const setNoteShelf = () => {
    navigate('/shelf');
  };

  const setDesk = () => {
    navigate('/desk');
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <>
      <div className="top-bar">
        <hr className="stream" />
        <div className="top">
          <div className="top-left">The Note Stacks</div>
          <div className="top-center">
            <ul className="top-list">
              <li className="top-list-item" onClick={setNoteShelf}>
                NOTESHELF
              </li>
              <li className="top-list-item" onClick={setDesk}>
                DESK
              </li>
            </ul>
          </div>
          <div className="top-right">
            <ul className="top-list">
              <FaSearch className="top-search-icon" onClick={openSearch} />
            </ul>
          </div>
        </div>
      </div>
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
