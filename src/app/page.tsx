// frontend/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './components/AuthProvider';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/dashboard');
    else router.replace('/login');
  }, [user, router]);

  return null;
}