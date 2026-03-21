import { useEffect, useState } from 'react';

// TypeScript interface — this describes the shape of a Book object coming from the API.
// The property names must match what .NET sends back (it camelCases them automatically).
interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

// This describes the shape of the full API response (books + total count)
interface BooksResponse {
  books: Book[];
  totalNumBooks: number;
}

function BookList() {
  // useState stores values that, when updated, trigger a re-render.
  // Each piece of state below has a getter and a setter (the [value, setValue] pattern).
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // useEffect runs AFTER the component renders.
  // The dependency array [pageNum, pageSize, sortOrder] tells React:
  // "re-run this effect whenever any of these values change."
  // This is how we automatically re-fetch when the user changes pages, page size, or sort.
  useEffect(() => {
    fetch(
      `http://localhost:5075/api/book?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
      });
  }, [pageNum, pageSize, sortOrder]);

  // Calculate total pages so we know how many page buttons to render
  const totalPages = Math.ceil(totalItems / pageSize);

  // Toggle sort order between asc and desc, and reset to page 1
  // (if you're on page 3 and re-sort, you want to start over at page 1)
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPageNum(1);
  };

  // When the user picks a different page size, reset back to page 1.
  // Number() converts the string from the <select> to a number.
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bookshelf.</h1>

      {/* Controls row: page size selector on left, total count on right */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="mb-0">
            Results per page:
          </label>
          {/* This is a "controlled" input — its value is tied to React state.
              Changing the dropdown fires handlePageSizeChange, which updates state,
              which triggers a re-fetch via useEffect. */}
          <select
            id="pageSize"
            className="form-select w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <span className="text-muted">{totalItems} total books</span>
      </div>

      {/* Bootstrap table with striped rows and hover highlighting */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>
              {/* Clicking this button toggles sortOrder state, which triggers useEffect */}
              <button
                className="btn btn-sm btn-outline-light"
                onClick={handleSortToggle}
              >
                Title {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            </th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Category</th>
            <th>Page Count</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {/* .map() transforms each Book object into a <tr> element.
              key={book.bookId} is required by React to efficiently track list items. */}
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap pagination component */}
      <nav aria-label="Book list pagination">
        <ul className="pagination justify-content-center">
          {/* Previous button — disabled when on the first page */}
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPageNum((p) => p - 1)}
            >
              Previous
            </button>
          </li>

          {/* Generate one page button for each page.
              Array.from({ length: totalPages }) creates an array of that length,
              then we map over it with the index (i) to get page numbers 1, 2, 3... */}
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          {/* Next button — disabled when on the last page */}
          <li
            className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => setPageNum((p) => p + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BookList;
