import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './faces/topbar/TopBar';
import Desk from './faces/desk/Desk';
import NoteShelf from './faces/noteshelf/NoteShelf';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/shelf" replace />} />
        <Route path="/shelf" element={<NoteShelf />} />
        <Route path="/shelf/:category" element={<NoteShelf />} />
        <Route path="/shelf/:category/:pageNo" element={<NoteShelf />} />
        <Route path="/desk" element={<Desk />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
