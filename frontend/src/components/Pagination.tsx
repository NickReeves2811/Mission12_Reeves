interface PaginationProps {
  pageNum: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ pageNum, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Book list pagination">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(pageNum - 1)}
          >
            Previous
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => (
          <li
            key={i + 1}
            className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(i + 1)}>
              {i + 1}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(pageNum + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
