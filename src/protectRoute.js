"use client";

// protectRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './authContext';


const withProtectedRoute = (Component) => {
  return function ProtectedRoute(props) {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.push('/');  // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
      }
    }, [currentUser, router]);

    // Si l'utilisateur est connecté, affichez le composant
    return <Component {...props} />;
  };
};

export default withProtectedRoute;
