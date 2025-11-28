import './shelf.css';
import loadImg from '../../Images/load-img.gif';

interface ShelfProps {
  openShelf: boolean;
  shelfCategory: string[];
  setCategory: (category: string) => void;
  category?: string;
}

export default function Shelf({ openShelf, shelfCategory, setCategory }: ShelfProps) {
  return (
    <div className={openShelf ? 'shelf-container-opend' : 'shelf-container-closed'}>
      <nav className={openShelf ? 'shelf-opend' : 'shelf-closed'}>
        <ul className="shelf-list">
          <li className="shelf-title">STACK</li>
          <ul className="shelf-item-list">
            {shelfCategory.length === 0 ? (
              <li className="shelfLoad">
                <img className="loading-img" id="loading-img-id" src={loadImg} alt="loading" />
              </li>
            ) : (
              shelfCategory.map((category, index) => (
                <li key={index} className="shelf-item" onClick={() => setCategory(category)}>
                  {category}
                </li>
              ))
            )}
          </ul>
        </ul>
      </nav>
    </div>
  );
}
