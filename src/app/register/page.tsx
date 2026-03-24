'use client';
import { useState, forwardRef } from 'react';
import { 
  Box, Button, TextField, Typography, Alert, Link as MuiLink, 
  Card as MuiCard, Stack, IconButton, InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { useAuth } from '../components/AuthProvider';


<Link href="/register" passHref legacyBehavior>
  <MuiLink>Register</MuiLink>
</Link>

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px' },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', fullName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.post('/auth/register', formData);
      const { accessToken, userId, role } = res.data;
      login(accessToken, { userId, ...formData, role });
      router.push('/dashboard');
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <SignUpContainer direction="column">
      <Card variant="outlined">
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
          Join us today! Enter your details below.
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Full Name" name="fullName" variant="outlined" fullWidth required 
            value={formData.fullName} onChange={handleChange} 
          />
          <TextField 
            label="Email Address" name="email" type="email" variant="outlined" fullWidth required 
            value={formData.email} onChange={handleChange} 
          />
          <TextField 
            label="Password" name="password" variant="outlined" fullWidth required
            type={showPassword ? 'text' : 'password'}
            value={formData.password} onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {err && <Alert severity="error" sx={{ width: '100%' }}>{err}</Alert>}

          <Button variant="contained" type="submit" size="large" fullWidth sx={{ py: 1.5, fontWeight: 'bold' }}>
            Sign Up
          </Button>

          <Typography sx={{ textAlign: 'center', mt: 1 }}>
            Already have an account?{' '}
            <MuiLink  href="/login" sx={{ fontWeight: 'medium' }}>
              Log in
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
