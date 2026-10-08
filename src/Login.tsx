import { useState } from "react";
import type { FormEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"; // NEW: Link, useLocation
import {
  Alert, Box, Button, CircularProgress, IconButton,
  InputAdornment, Link, TextField, Typography, // NEW: Link
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered === true; // NEW
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Invalid username or password.");
        return response.text();
      })
      .then((token) => {
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Brand panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 2,
          p: 8,
          color: "#fff",
          background: "linear-gradient(135deg, #6C3CE9 0%, #A35CFF 55%, #FF6B35 100%)",
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 64 }} />
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          ShopFlow
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 420 }}>
          Discover great products, fill your cart, and check out in seconds.
        </Typography>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">Log in to continue shopping.</Typography>
          </Box>

          {justRegistered && <Alert severity="success">Account created. Please log in.</Alert>} {/* NEW */}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
            fullWidth
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !username || !password}
            sx={{ py: 1.4 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
          </Button>

          <Button color="inherit" onClick={() => navigate("/")}>
            Continue browsing as guest
          </Button>

          {/* NEW */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            New here? <Link component={RouterLink} to="/register">Create an account</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}