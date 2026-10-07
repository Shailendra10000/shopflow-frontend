import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';              // NEW: Link
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Login from './Login';
import MyOrders from './MyOrders';                                  // NEW

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not load products");
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function addToCart(product: Product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  }

  function handleCheckoutSuccess() {
    setCart([]);
    alert("Order placed successfully!");
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>ShopFlow</h1>
      <Link to="/my-orders">My Orders</Link>                         {/* NEW */}
      {products.map(product => (
        <ProductCard product={product} key={product.id} onAddToCart={addToCart} />
      ))}
      <hr />
      <Cart cart={cart} onCheckoutSuccess={handleCheckoutSuccess} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-orders" element={<MyOrders />} />            {/* NEW */}
    </Routes>
  );
}

export default App;