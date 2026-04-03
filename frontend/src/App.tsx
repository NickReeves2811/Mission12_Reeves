// Import Bootstrap CSS globally — this makes all Bootstrap classes available everywhere
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/adminbooks" element={<AdminPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
