const BASE_URL = import.meta.env.VITE_API_URL;

export interface Book {
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

export interface BooksResponse {
  books: Book[];
  totalNumBooks: number;
}

export const fetchBooks = (
  pageNum: number,
  pageSize: number,
  sortOrder: string,
  category: string
): Promise<BooksResponse> =>
  fetch(
    `${BASE_URL}/api/book?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}&category=${category}`
  ).then((res) => res.json());

export const fetchCategories = (): Promise<string[]> =>
  fetch(`${BASE_URL}/api/book/categories`).then((res) => res.json());

export const createBook = (book: Omit<Book, 'bookId'>): Promise<Book> =>
  fetch(`${BASE_URL}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...book, bookId: 0 }),
  }).then((res) => res.json());

export const updateBook = (book: Book): Promise<void> =>
  fetch(`${BASE_URL}/api/book/${book.bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  }).then(() => {});

export const deleteBook = (bookId: number): Promise<void> =>
  fetch(`${BASE_URL}/api/book/${bookId}`, { method: 'DELETE' }).then(() => {});
