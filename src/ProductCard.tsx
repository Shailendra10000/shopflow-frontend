import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const gradients = [
  'linear-gradient(135deg, #6C3CE9, #B14FFF)',
  'linear-gradient(135deg, #FF6B35, #FFB347)',
  'linear-gradient(135deg, #00B8A9, #4ED8C7)',
  'linear-gradient(135deg, #F8366A, #FF8FA3)',
];

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const detailPath = `/products/${product.id}`;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform .15s, box-shadow .15s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(29, 20, 51, 0.15)' },
      }}
    >
      <Box
        component={RouterLink}
        to={detailPath}
        sx={{
          height: 160,
          background: gradients[product.id % gradients.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 56,
          fontWeight: 800,
          textDecoration: 'none',
        }}
      >
        {product.name.charAt(0).toUpperCase()}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to={detailPath}
          color="text.primary"
          sx={{ textDecoration: 'none' }}
        >
          {product.name}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" fullWidth onClick={() => onAddToCart(product)}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;