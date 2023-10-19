"use client";

import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            // Ici, fetchez vos suggestions à partir de votre API ou autre source.
            // Pour cet exemple, utilisons une liste de données factices.
            const dummyData = ['Emilie', 'cécile', 'Antoine', 'Béatrice'];
            setSuggestions(dummyData);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    return (
        <nav className="bg-white p-1 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/thumbnail_image001-removebg-preview.png" alt="Left Logo" className="h-16 w-auto mr-2" />
                    <h1 className="text-xl font-bold">So'Thanks Tickets</h1>
                </div>
                {/* Searchbar */}
                <div className="relative w-80 rounded">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinecap="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-slate-50 focus:ring-blue-500 focus:border-blue-500" placeholder="recherche par adresse mail" required
                    />
                    {searchTerm && suggestions.length > 0 && (
                        <div className="absolute mt-2 w-full rounded border border-gray-300 bg-white z-10">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} onClick={() => {
                                    setSearchTerm(suggestion);
                                    router.push("/user/"+suggestion)
                                }}
                                    className="p-2 hover:bg-gray-200 cursor-pointer">
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* onglets */}
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link href="/user" className="text-sm block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0" aria-current="page">Profil</Link>
                        </li>
                        <li className='relative '>
                            <Link href="/user/tickets-recus" className="text-sm block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Mes tickets reçus</Link>
                            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 border-2 border-white rounded-full -top-5 -right-3">3</div>
                        </li>
                        <li>
                            <Link href="/user/tickets-envoyes" className="text-sm block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Mes tickets envoyés</Link>
                        </li>
                    </ul>
                </div>
                <img src="/acad.png" alt="Right Logo" className="h-8 w-auto ml-4" />
            </div>
        </nav>
    )
}