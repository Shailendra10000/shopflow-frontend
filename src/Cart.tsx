import { useState } from 'react';                                // NEW
import { useNavigate } from 'react-router-dom';                  // NEW

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onCheckoutSuccess: () => void;
}

function Cart({ cart, onCheckoutSuccess }: CartProps) {
  const [error, setError] = useState("");                        // NEW
  const navigate = useNavigate();                                // NEW
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function handleCheckout() {
    setError("");                                                // NEW

    const token = localStorage.getItem("token");
    if (!token) {                                                // NEW
      navigate("/login");                                        // NEW
      return;                                                    // NEW
    }                                                            // NEW

    const requestBody = {
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    fetch("http://localhost:8080/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {                                      // NEW
          throw new Error("Checkout failed. Please log in again and retry.");   // NEW
        }                                                        // NEW
        return response.json();
      })
      .then(data => {
        console.log("Order created:", data);
        onCheckoutSuccess();
      })
      .catch(err => setError(err.message));                      // NEW
  }

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 && <p>Cart is empty</p>}
      {cart.map(item => (
        <p key={item.product.id}>
          {item.product.name} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      ))}
      <p><strong>Total: ${total.toFixed(2)}</strong></p>
      {error && <p style={{ color: "red" }}>{error}</p>}         {/* NEW */}
      {cart.length > 0 && <button onClick={handleCheckout}>Checkout</button>}
    </div>
  );
}

export default Cart;