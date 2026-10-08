import { useState } from "react";
import type { FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Could not create the account. Try a different username.");
        }
        navigate("/login", { state: { registered: true } });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background: "linear-gradient(135deg, #6C3CE9 0%, #A35CFF 55%, #FF6B35 100%)",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          boxShadow: 6,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingBagIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Create your account</Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <TextField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required fullWidth />

        <Button type="submit" variant="contained" size="large" disabled={loading || !username || !password || !confirm} sx={{ py: 1.4 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign up"}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">Log in</Link>
        </Typography>
      </Box>
    </Box>
  );
}