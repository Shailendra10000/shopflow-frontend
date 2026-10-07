import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import Header from './Header';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/products/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Product not found");
        }
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message));
  }, [id]);

  return (
    <Box>
      <Header />
      <Container sx={{ py: 4 }}>
        <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
          ← Back to catalog
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && product === null && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {product && (
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <Box
              sx={{
                height: { xs: 240, md: 360 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6C3CE9, #B14FFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 120,
                fontWeight: 800,
              }}
            >
              {product.name.charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h4">{product.name}</Typography>
              <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProductDetail;