"use client";

import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { db, auth, functions } from '../firebase'  // Assurez-vous que le chemin est correct
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';


import UserModal from './modal_invitation_navbar';

export default function Navbar() {

    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [unreadTickets, setUnreadTickets] = useState(0);

    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isInvitEmailSent, setIsInvitEmailSent] = useState(false)

    const user = auth.currentUser;


    //close Modal 
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    //inviter user
    const handleInvite = async () => {
        // check if acadomia member
        const isValidEmail = /^[a-zA-Z0-9._-]+@acadomia\.fr$/.test(searchTerm);
        if (!isValidEmail) {
            handleCloseModal()
            return alert("Adresse email non valide")
        }
        // Logique d'invitation...
        handleCloseModal()
        setIsLoading(true)

        //Envoie d'email :
        // Créez une référence à votre fonction cloud
        // const sendEmail = httpsCallable(functions, 'sendEmail');

        // Appelez la fonction avec les données nécessaires
        try {
            // const from_name = user.displayName;
            // const to_email = searchTerm;
            // const result = await sendEmail(); // {to_email, from_name}
            // Résultat de la fonction cloud
            // console.log(result.data);
            setIsLoading(false);
            setSearchTerm('')
            alert("email envoyé");
            return ;
        } catch (error) {
            // Gérer les erreurs ici
            setIsLoading(false);
            setSearchTerm('')
            console.error("Error calling sendEmail function:", error);
            throw error;
        }
    };

    //charger le nombre de tickets non lus et ne pas actualiser

    // useEffect(() => {
    //     const fetchUnreadTickets = async () => {
    //         const user = firebase.auth().currentUser;
    //         if (user) {
    //             const userRef = firebase.firestore().collection('utilisateurs').doc(user.uid);
    //             const doc = await userRef.get();
    //             const data = doc.data();

    //             if (data && data.tickets_non_lus) {
    //                 setUnreadTickets(data.tickets_non_lus);
    //             }
    //         }
    //     };

    //     fetchUnreadTickets();
    // }, []);

    // charger et écouter en temps réel les tickets non lus 
    useEffect(() => {
        if (user && user.uid) {
            const userRef = doc(db, 'utilisateurs', user.uid);

            const unsubscribe = onSnapshot(userRef, (doc) => {
                const data = doc.data();
                if (data && data.tickets_non_lus) {
                    setUnreadTickets(data.tickets_non_lus);
                }
            });

            return () => {
                unsubscribe(); // Se désabonner de l'écouteur lors du démontage du composant
            };
        }

    }, []);

    const [showSuggestions, setShowSuggestions] = useState(true);

    //searchbar
    useEffect(() => {
        // Lancer la recherche uniquement si searchTerm a au moins 3 caractères
        if (searchTerm.length >= 3) {
            fetch(`https://suggestion.algosearch.workers.dev/?search=${encodeURIComponent(searchTerm)}&token=jRCsWu8aVyIwWhNLEs1x`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Problème lors de la récupération des suggestions');
                    }
                    return response.json();
                })
                .then(data => {
                    setSuggestions(data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des suggestions:', error);
                    setSuggestions([]);
                });
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    function handleUserSearch() {
        if (searchTerm.length === 0) {
            return
        }
        if (suggestions.length === 0) { // utilisiteur inconnu 
            return setModalOpen(true) //show invitation modal
        }
        router.push("/user/" + searchTerm)
    }

    return (
        <nav className="bg-white p-1 shadow-md">
            {/* loader */}
            {isLoading && <div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex justify-center items-center z-50">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>
            </div>}
            {/* navbar */}
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/thumbnail_image001-removebg-preview.png" alt="Left Logo" className="h-16 w-auto mr-2" />
                    <h1 className="text-xl font-bold">So'Thanks Tickets</h1>
                </div>
                {/* Searchbar */}
                <div className="relative w-80 rounded">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-slate-50 focus:ring-blue-500 focus:border-blue-500" placeholder="recherche par adresse mail" required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            // onClick={() => { router.push("/user/" + searchTerm) }}
                            onClick={handleUserSearch}
                            className="p-2 text-sm bg-blue-500 text-white rounded"
                        >
                            OK
                        </button>
                        {/* Modal ajout destinataire non enregistré */}
                        <UserModal email={searchTerm} isOpen={isModalOpen} onClose={handleCloseModal} onInvite={handleInvite} />
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute mt-2 w-full rounded border border-gray-300 bg-white z-10">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} onClick={() => {
                                    setSearchTerm(suggestion);
                                    setShowSuggestions(false);
                                    router.push("/user/" + suggestion);
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
                            <div className="absolute inline-flex items-center justify-center z-0 w-6 h-6 text-xs text-white bg-red-500 border-2 border-white rounded-full -top-5 -right-3">{unreadTickets}</div>
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