import { useEffect } from 'react';

interface AddedToCartToastProps {
  show: boolean;
  bookTitle: string;
  onClose: () => void;
}

function AddedToCartToast({ show, bookTitle, onClose }: AddedToCartToastProps) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div className="toast show align-items-center text-bg-dark border-0">
        <div className="d-flex">
          <div className="toast-body">
            <strong>{bookTitle}</strong> added to cart.
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default AddedToCartToast;
