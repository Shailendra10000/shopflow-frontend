import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
}

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/orders/my", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not load your orders. Please log in again.");
        }
        return response.json();
      })
      .then((data: Order[]) => setOrders([...data].sort((a, b) => b.id - a.id)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <Link to="/">← Back to catalog</Link>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}
      {orders.map(order => {
        const total = order.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 0
        );
        return (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>
            {order.items.map(item => (
              <p key={item.product.id}>
                {item.product.name} × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            ))}
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default MyOrders;