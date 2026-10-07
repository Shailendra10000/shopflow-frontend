import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material';

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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function handleCheckout() {
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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
        if (!response.ok) {
          throw new Error("Checkout failed. Please log in again and retry.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Order created:", data);
        onCheckoutSuccess();
      })
      .catch(err => setError(err.message));
  }

  return (
    <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Your cart</Typography>

      {cart.length === 0 && (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      )}

      <Stack spacing={2} divider={<Divider flexItem />} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {cart.map(item => (
          <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{item.product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.product.price.toFixed(2)} × {item.quantity}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700 }}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button variant="contained" size="large" disabled={cart.length === 0} onClick={handleCheckout}>
        Checkout
      </Button>
    </Box>
  );
}

export default Cart;