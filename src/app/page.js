"use client"; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../authContext';

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement n'est pas terminé, on ne fait rien
    if (loading) return;

    // Si un utilisateur est authentifié, on le redirige vers '/user'
    if (currentUser) {
      router.push('/user');
      return;
    }

    // Si l'utilisateur n'est pas authentifié, on le redirige vers '/login'
    router.push('/login');
  }, [currentUser, loading, router]);

  // Afficher un spinner pendant le chargement
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>
    </div>
  );
}
