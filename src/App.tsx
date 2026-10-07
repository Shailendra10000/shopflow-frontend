import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Alert, Box, CircularProgress, Container, Drawer, Typography } from '@mui/material';
import Header from './Header';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Login from './Login';
import MyOrders from './MyOrders';

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
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

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
    setCartOpen(false);
    alert("Order placed successfully!");
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const visibleProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <Container sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>Shop all products</Typography>
            {visibleProducts.length === 0 && (
              <Typography color="text.secondary">No products found.</Typography>
            )}
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              }}
            >
              {visibleProducts.map(product => (
                <ProductCard product={product} key={product.id} onAddToCart={addToCart} />
              ))}
            </Box>
          </>
        )}
      </Container>

      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart cart={cart} onCheckoutSuccess={handleCheckoutSuccess} />
      </Drawer>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </Routes>
  );
}

export default App;