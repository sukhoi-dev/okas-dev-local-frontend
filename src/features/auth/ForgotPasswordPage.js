import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTE_PATHS } from '../../config/constants';
import authService from './authService';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1D2B36 0%, #0d3347 50%, #1D2B36 100%)', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>Forgot Password</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>Enter your email to receive a reset link.</Typography>
          {sent ? (
            <Alert severity="success">Reset link sent! Check your inbox.</Alert>
          ) : (
            <>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField label="Email Address" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} />
                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
              </Box>
            </>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to={ROUTE_PATHS.LOGIN} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#0094AD', textDecoration: 'none' }}>
              <ArrowBackIcon fontSize="small" /> Back to Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
