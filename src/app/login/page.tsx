'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutline from '@mui/icons-material/PersonOutline';
import { useAuth } from '../components/AuthProvider';
import api from '../lib/axios';

const SYMBOLS = [
  { symbol: "+", top: "10%", left: "20%", right: undefined, bottom: undefined, fontSize: "4rem", color: "#e0e8ef", rotate: 15 },
  { symbol: "%", top: "20%", left: undefined, right: "25%", bottom: undefined, fontSize: "5rem", color: "#e0e8ef", rotate: -10 },
  { symbol: "-", top: "40%", left: "15%", right: undefined, bottom: undefined, fontSize: "6rem", color: "#e0e8ef", rotate: -5 },
  { symbol: "÷", top: undefined, left: undefined, right: "15%", bottom: "30%", fontSize: "4rem", color: "#e0e8ef", rotate: 20 },
  { symbol: "+", top: undefined, left: "30%", right: undefined, bottom: "15%", fontSize: "3rem", color: "#e0e8ef", rotate: -20 },
  { symbol: "=", top: "50%", left: undefined, right: "10%", bottom: undefined, fontSize: "3rem", color: "#e0e8ef", rotate: 0 },
  { symbol: "%", top: undefined, left: undefined, right: "40%", bottom: "10%", fontSize: "3.5rem", color: "#e0e8ef", rotate: 15 },
  { symbol: "₹", top: "30%", left: undefined, right: "10%", bottom: undefined, fontSize: "3rem", color: "#e0e8ef", rotate: 12 },
  { symbol: "$", top: undefined, left: "10%", right: undefined, bottom: "40%", fontSize: "4.5rem", color: "#e0e8ef", rotate: -15 },
  { symbol: "÷", top: "15%", left: "40%", right: undefined, bottom: undefined, fontSize: "2.5rem", color: "#e0e8ef", rotate: 45 }
];

export default function LoginPage() {
  const [form, setForm] = useState({ UserName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/Auth/login', form);
      if (data && data.accessToken) {
        login(data.accessToken, data);
        router.push('/dashboard');
      } else {
        setError(data?.message || 'Login failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const updateForm = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left Side - Login Form */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '35%' },
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          position: 'relative',
          backgroundColor: '#f8fbfc'
        }}
      >
        {/* Subtle dots pattern background */}
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#cce7f0 2px, transparent 2px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          zIndex: 0
        }} />

        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            p: { xs: 2, md: 4 },
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)',
              zIndex: -1
            }
          }}
        >
          <Box mb={5} sx={{ position: 'relative', display: 'inline-block', pr: 4 }}>
            <img 
              src="/paysis_logo.png" 
              alt="Paysis by India1 Logo" 
              width={160} 
              style={{ objectFit: 'contain' }}
            />
          </Box>

          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
            Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ flexGrow: 1 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>User ID</Typography>
                <TextField
                  placeholder="Enter User ID"
                  fullWidth
                  size="small"
                  value={form.UserName}
                  onChange={updateForm('UserName')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><PersonOutline sx={{fontSize: 20, color: 'text.secondary'}}/></InputAdornment>,
                    sx: { backgroundColor: '#ffffff', borderRadius: 1 }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>Password</Typography>
                <TextField
                  placeholder="Enter Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  value={form.password}
                  onChange={updateForm('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{fontSize: 20}} /> : <Visibility sx={{fontSize: 20}} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: '#ffffff', borderRadius: 1 }
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  py: 1.5, 
                  backgroundColor: '#0a3d75',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#072e5a' }
                }}
                disabled={loading || !form.UserName || form.password.length < 3}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Forgot the credentials ?
                </Typography>
                <Link href="#" variant="body2" fontWeight={700} color="text.primary" underline="hover">
                  Reset Password
                </Link>
              </Box>
            </Stack>
          </Box>

          <Box mt={6} textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              By proceeding you acknowledge that you have read,
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              understood and agree to our <Link href="#" color="text.secondary" underline="always">Terms and Conditions</Link>.
            </Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={3}>
              <Link href="#" variant="caption" color="text.secondary" underline="hover">Privacy Policy</Link>
              <Link href="#" variant="caption" color="text.secondary" underline="hover">Support</Link>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Illustration and Symbols */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: '65%' },
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          backgroundColor: '#ffffff',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Background Math Symbols */}
        {SYMBOLS.map((s, idx) => (
          <Box key={idx} sx={{
            position: 'absolute',
            top: s.top, left: s.left, right: s.right, bottom: s.bottom,
            fontSize: s.fontSize, color: s.color,
            transform: `rotate(${s.rotate}deg)`,
            opacity: 0.2,
            fontWeight: 'bold',
            userSelect: 'none',
            zIndex: 0,
            fontFamily: 'monospace'
          }}>
            {s.symbol}
          </Box>
        ))}

        <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/bank_illustration.png" 
            alt="Financial Ecosystem Illustration" 
            width={700} 
            height={550} 
            style={{ objectFit: 'contain' }}
          />
          
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mt: 4, 
              color: '#000',
              letterSpacing: '-0.5px'
            }}
          >
            Reconciliation Management System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
