import { useState, useEffect } from 'react';
import { Book, createBook, updateBook } from '../api/BooksAPI';

interface BookFormModalProps {
  show: boolean;
  mode: 'add' | 'edit';
  book: Book | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

function BookFormModal({ show, mode, book, onClose, onSaved }: BookFormModalProps) {
  const [form, setForm] = useState(emptyForm);

  // When the modal opens, fill the form with the book data (edit) or reset it (add)
  useEffect(() => {
    if (mode === 'edit' && book) {
      setForm({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        isbn: book.isbn,
        classification: book.classification,
        category: book.category,
        pageCount: book.pageCount,
        price: book.price,
      });
    } else {
      setForm(emptyForm);
    }
  }, [show, mode, book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      await createBook(form);
    } else if (mode === 'edit' && book) {
      await updateBook({ ...form, bookId: book.bookId });
    }

    onSaved();
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'add' ? 'Add New Book' : 'Edit Book'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {(
                  [
                    ['title', 'Title'],
                    ['author', 'Author'],
                    ['publisher', 'Publisher'],
                    ['isbn', 'ISBN'],
                    ['classification', 'Classification'],
                    ['category', 'Category'],
                  ] as [string, string][]
                ).map(([name, label]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={name}
                      value={(form as Record<string, string | number>)[name] as string}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">Page Count</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pageCount"
                    value={form.pageCount}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark">
                  {mode === 'add' ? 'Add Book' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookFormModal;
