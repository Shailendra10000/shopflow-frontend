import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Card, CardContent, Chip, CircularProgress,
  Container, Divider, Typography,
} from "@mui/material";
import Header from "./Header";

interface OrderItem {
  quantity: number;
  product: { id: number; name: string; price: number };
}

interface Order {
  id: number;
  items: OrderItem[];
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load orders (${response.status})`);
        return response.json();
      })
      .then((data: Order[]) => setOrders([...data].sort((a, b) => b.id - a.id)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
          My Orders
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && orders.length === 0 && (
          <Alert severity="info">You haven't placed any orders yet.</Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            return (
              <Card key={order.id}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Order #{order.id}
                    </Typography>
                    <Chip
                      color="secondary"
                      label={`${order.items.length} item${order.items.length === 1 ? "" : "s"}`}
                    />
                  </Box>
                  <Divider sx={{ mb: 1 }} />

                  {order.items.map((item) => (
                    <Box key={item.product.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                      <Typography>
                        {item.product.name} × {item.quantity}
                      </Typography>
                      <Typography>${(item.product.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography color="primary" sx={{ fontWeight: 700 }}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </>
  );
}