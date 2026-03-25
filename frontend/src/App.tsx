// Import Bootstrap CSS globally — this makes all Bootstrap classes available everywhere
import 'bootstrap/dist/css/bootstrap.min.css';
import BookList from './components/BookList';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BookList />
    </CartProvider>
  );
}

export default App;
