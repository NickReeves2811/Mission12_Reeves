import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import BookFormModal from '../components/BookFormModal';
import { fetchBooks, deleteBook, Book } from '../api/BooksAPI';

function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const totalPages = Math.ceil(totalItems / pageSize);

  const loadBooks = () => {
    fetchBooks(pageNum, pageSize, 'asc', '').then((data) => {
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
    });
  };

  useEffect(() => {
    loadBooks();
  }, [pageNum]);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedBook(null);
    setShowModal(true);
  };

  const handleEditClick = (book: Book) => {
    setModalMode('edit');
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleDelete = async (bookId: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    await deleteBook(bookId);
    loadBooks();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin — Manage Books</h1>
        <button className="btn btn-dark" onClick={handleAddClick}>
          + Add Book
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
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
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(book.bookId)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        onPageChange={setPageNum}
      />

      <BookFormModal
        show={showModal}
        mode={modalMode}
        book={selectedBook}
        onClose={() => setShowModal(false)}
        onSaved={loadBooks}
      />
    </div>
  );
}

export default AdminPage;
