"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter()


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function checkEmail(event) {
    event.preventDefault();
    if (email === "mylene.d-rosso@acadomia.fr" && password === "adminpassword") { //mylene.d-rosso@acadomia.fr
      router.push("/user")
    }
    return;
  }

  return (
    <div className="min-h-screen bg-slate-100 relative md:flex items-center justify-center">
      <div className="md:absolute top-4 flex items-center">
        <img src="thumbnail_image001-removebg-preview.png" alt="Logo 1" className="w-52 h-52 mr-2" /> {/* ajustez h-12 selon la taille souhaitée */}
        <span className="text-3xl antialiased font-semibold" style={{ color: '#C29E5B' }}>So'Thanks Tickets</span>
      </div>
      <img src="acad.png" alt="Logo 2" className="absolute top-4 right-4 h-12 w-auto" /> {/* ajustez h-12 selon la taille souhaitée */}

      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={checkEmail} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg">
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Adresse email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
          </div>
          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Mot de passe</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Se connecter</button>
        </form>
      </div>
    </div>
  )
}
