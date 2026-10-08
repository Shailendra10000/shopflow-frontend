import { AppBar, Badge, Box, Button, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

function Header({ cartCount = 0, onCartClick, search, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          color="primary"
          sx={{ textDecoration: 'none', mr: 2 }}
        >
          ShopFlow
        </Typography>

        {onSearchChange && (
          <TextField
            size="small"
            placeholder="Search products"
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 480 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        <Box sx={{ flexGrow: 1 }} />

        {isLoggedIn && (
          <Button component={RouterLink} to="/my-orders" color="inherit">
            My Orders
          </Button>
        )}

        {onCartClick && (
          <IconButton onClick={onCartClick} aria-label="Open cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        )}

        {isLoggedIn ? (
          <Button variant="outlined" onClick={handleLogout}>Log out</Button>
        ) : (
          <Button variant="contained" component={RouterLink} to="/login">Log in</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;