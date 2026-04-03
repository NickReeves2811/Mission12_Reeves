import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import AddedToCartToast from './AddedToCartToast';
import Pagination from './Pagination';
import { fetchBooks, fetchCategories, Book, BooksResponse } from '../api/BooksAPI';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [toastBook, setToastBook] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  const { cartItems, addToCart } = useCart();
  const totalCartItems = cartItems.reduce((sum: number, item) => sum + item.quantity, 0);

  // Fetch distinct categories once on mount
  useEffect(() => {
    fetchCategories().then((data: string[]) => setCategories(data));
  }, []);

  // Re-fetch books whenever page, size, sort, or category changes
  useEffect(() => {
    fetchBooks(pageNum, pageSize, sortOrder, selectedCategory).then(
      (data: BooksResponse) => {
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
      }
    );
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPageNum(1);
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToastBook(book.title);
    setShowToast(true);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bookshelf.</h1>

      {/* Top control bar using Bootstrap Grid */}
      <div className="row align-items-center mb-3 g-2">
        {/* Left col: filters */}
        <div className="col-12 col-md-8">
          <div className="row g-2 align-items-center">
            <div className="col-auto">
              <label htmlFor="pageSize" className="col-form-label">
                Results per page:
              </label>
            </div>
            <div className="col-auto">
              <select
                id="pageSize"
                className="form-select"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="col-auto">
              <label htmlFor="categoryFilter" className="col-form-label">
                Category:
              </label>
            </div>
            <div className="col-auto">
              <select
                id="categoryFilter"
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-auto">
              <span className="text-muted">{totalItems} books</span>
            </div>
          </div>
        </div>

        {/* Right col: cart button with badge */}
        <div className="col-12 col-md-4 d-flex justify-content-md-end">
          <button
            className="btn btn-dark position-relative"
            onClick={() => setShowCart(true)}
          >
            Cart
            {totalCartItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Book table */}
      <div className="row">
        <div className="col-12">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={handleSortToggle}
                  >
                    Title {sortOrder === 'asc' ? '▲' : '▼'}
                  </button>
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Page Count</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleAddToCart(book)}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        onPageChange={setPageNum}
      />

      {/* Cart Offcanvas */}
      <Cart show={showCart} onClose={() => setShowCart(false)} />

      {/* Added to cart Toast */}
      <AddedToCartToast
        show={showToast}
        bookTitle={toastBook}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default BookList;
