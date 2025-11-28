import './pagelistcontroller.css';
import stacks from '../../Images/stacks.png';
import leftXArr from '../../Images/rewind.png';
import leftArr from '../../Images/arrow-left.png';
import rightArr from '../../Images/arrow-right.png';
import rightXArr from '../../Images/fast-forward.png';

interface PageListControllerProps {
  toggleShelf: () => void;
  pagesBound?: number;
  setBound: (bound: number) => void;
  setPageNo: (pageNo: number) => void;
  pageNo: number;
}

export default function PageListController({
  toggleShelf,
  pagesBound,
  setPageNo,
  pageNo,
}: PageListControllerProps) {
  const increasePage = () => {
    if (pagesBound && pageNo < pagesBound) {
      setPageNo(pageNo + 1);
    }
  };

  const decreasePage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const fastForward = () => {
    if (pagesBound) {
      if (pageNo + 5 < pagesBound) {
        setPageNo(pageNo + 5);
      } else {
        setPageNo(pagesBound);
      }
    }
  };

  const fastBackward = () => {
    if (pageNo > 5) {
      setPageNo(pageNo - 5);
    } else {
      setPageNo(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 0 && (!pagesBound || value <= pagesBound)) {
      setPageNo(value);
    }
  };

  return (
    <div className="page-list-controller">
      <div className="shelf-toggle-button" id="shelf-toggle-button-id">
        <div className="icon-wrapper-active">
          <img id="shelf-icon-id" src={stacks} onClick={toggleShelf} alt="toggle shelf" />
        </div>
      </div>
      <div className="page-list-controller-icons">
        <div
          className={
            pagesBound === undefined || pageNo === 1
              ? 'icon-wrapper-inactive'
              : 'icon-wrapper-active'
          }
        >
          <img
            id="page-list-controller-icon-id"
            src={leftXArr}
            onClick={pageNo > 1 ? fastBackward : undefined}
            alt="fast backward"
          />
        </div>
        <div
          className={
            pagesBound === undefined || pageNo === 1
              ? 'icon-wrapper-inactive'
              : 'icon-wrapper-active'
          }
        >
          <img
            id="page-list-controller-icon-id"
            src={leftArr}
            onClick={pageNo > 1 ? decreasePage : undefined}
            alt="previous"
          />
        </div>
        <div className="page-navigator">
          <input
            type="number"
            name="designated-num"
            value={pageNo === 0 ? 1 : pageNo}
            min="1"
            max={pagesBound || 1}
            onChange={handleInputChange}
          />
          <div className="division"></div>
          <div className="page-bound">{pagesBound ?? '---'}</div>
        </div>
        <div
          className={
            pagesBound === undefined || pageNo === pagesBound
              ? 'icon-wrapper-inactive'
              : 'icon-wrapper-active'
          }
        >
          <img
            id="page-list-controller-icon-id"
            src={rightArr}
            onClick={pagesBound && pageNo < pagesBound ? increasePage : undefined}
            alt="next"
          />
        </div>
        <div
          className={
            pagesBound === undefined || pageNo === pagesBound
              ? 'icon-wrapper-inactive'
              : 'icon-wrapper-active'
          }
        >
          <img
            id="page-list-controller-icon-id"
            src={rightXArr}
            onClick={pagesBound && pageNo < pagesBound ? fastForward : undefined}
            alt="fast forward"
          />
        </div>
      </div>
    </div>
  );
}
