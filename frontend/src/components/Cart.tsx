import { useCart } from '../context/CartContext';

interface CartProps {
  show: boolean;
  onClose: () => void;
}

function Cart({ show, onClose }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop — clicking it closes the cart */}
      {show && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={onClose}
        />
      )}

      {/* Offcanvas panel sliding in from the right */}
      <div
        className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
        style={{ visibility: show ? 'visible' : 'hidden' }}
        tabIndex={-1}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Your Cart</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          />
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cartItems.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            <>
              {/* Cart items list */}
              <div className="flex-grow-1">
                {cartItems.map((item) => (
                  <div key={item.book.bookId} className="card mb-2">
                    <div className="card-body py-2">
                      <div className="fw-semibold">{item.book.title}</div>
                      <div className="text-muted small">{item.book.author}</div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center gap-2">
                          <label className="small mb-0">Qty:</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: '64px' }}
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.book.bookId,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="text-end">
                          <div className="small text-muted">
                            ${item.book.price.toFixed(2)} each
                          </div>
                          <div className="fw-semibold">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => removeFromCart(item.book.bookId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total */}
              <div className="border-top pt-3 mt-2">
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-outline-secondary w-100 mb-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}

          {/* Continue Shopping always visible at the bottom */}
          <button className="btn btn-dark w-100 mt-2" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;
