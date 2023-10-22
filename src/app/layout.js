// "use client";

// import './globals.css'
// import { Inter } from 'next/font/google'

// import { AuthProvider, useAuth } from '../authContext';


// const inter = Inter({ subsets: ['latin'] })

// // export const metadata = {
// //   title: 'Create blabla',
// //   description: 'Generated by create next app',
// // }

// function LayoutContent({ children }) {
//   const { loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// export default function RootLayout({ children }) {


//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           {/* {children} */}
//           <LayoutContent>{children}</LayoutContent>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }

"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';  // <-- Ajout de ceci

import { AuthProvider, useAuth } from '../authContext';

const inter = Inter({ subsets: ['latin'] });

function LayoutContent({ children }) {
  const { loading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login');
        return;
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  )
}

