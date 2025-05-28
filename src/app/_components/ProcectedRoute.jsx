'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/hooks/useAuth';
// import useAuthStore from '@/store/useAuthStore';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Initialize from localStorage on component mount if needed
    if (!user) {
      
      const token = localStorage.getItem('token');
      if (token) {
        useAuthStore.getState().initializeAuth();
      } else {
        router.push('/login');
      }
    } else if (!allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Or loader if you want
  }

  return children;
};

export default ProtectedRoute;
