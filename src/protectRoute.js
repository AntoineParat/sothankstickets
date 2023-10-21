"use client";

// protectRoute.js
import { useAuth } from './authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectRoute = (Component) => {
  return () => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.push('/');
      }
    }, [currentUser]);

    return <Component {...arguments} />;
  };
};

export default ProtectRoute;
