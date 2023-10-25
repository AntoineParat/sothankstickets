"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import { useState, useEffect } from "react";

import { db } from '../firebase'  // Assurez-vous que le chemin est correct
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';  // Votre configuration firebase

export default function GratitudeBox() {
    // tickets counter logic
    const [count, setCount] = useState(0);
    function handleIncrement() {
        setCount(count + 1);
    }

    function handleDecrement() {
        setCount(count - 1);
    }

    function setNumberOfTickets(e) {
        const value = parseInt(e, 10);
        if (e === "") {
            setCount(0);
        } else if (!isNaN(value)) {
            setCount(value);
        }
    }

    // Ajout d'un ticket sur firestore et pop up confirmation
    const [gratitudeMessage, setGratitudeMessage] = useState('');
    const [popupType, setPopupType] = useState('success');  // Ajout de cet état
    const [isLoading, setIsLoading] = useState(false)

    async function addGratitudeTicket() {
        setIsLoading(true);

        const ticketsCollectionRef = collection(db, 'tickets');

        const user = auth.currentUser;

        try {
            const docRef = await addDoc(ticketsCollectionRef, {
                from_email: user.email,
                from_name : 'from_name', //user.name
                from_uid: user.uid,
                from_photoURL : user.photoURL,
                to: gratitudeDestinataire,
                to_name : 'to_name',
                gratitude_number: count,
                message: gratitudeMessage,
                date: serverTimestamp()  // Ceci ajoutera automatiquement la date et l'heure actuelles en utilisant le timestamp du serveur.
            });
            setIsLoading(false)
            setShowPopup(true)
            setPopupType('success');  // Définir le type de popup sur 'success'
            setCount(0)
            setgratitudeDestinataire('')
            setGratitudeMessage('')
        } catch (e) {
            setIsLoading(false)
            setShowPopup(true);
            setPopupType('error');
            setCount(0)
            setgratitudeDestinataire('')
            setGratitudeMessage('')
        }
    }
    // suggeion adresses email
    const [showDropdown, setShowDropdown] = useState(false)
    const [gratitudeDestinataire, setgratitudeDestinataire] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (gratitudeDestinataire) {
            // Ici, fetchez vos suggestions à partir de votre API ou autre source.
            // Pour cet exemple, utilisons une liste de données factices.
            const dummyData = ['suggestion1@acadomia.fr', 'suggestion2@acadomia.fr'];
            setSuggestions(dummyData);
        } else {
            setSuggestions([]);
        }
    }, [gratitudeDestinataire]);

    const [showPopup, setShowPopup] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (showPopup) {
            setAnimate(true);
            const timer = setTimeout(() => {
                setShowPopup(false);
                setAnimate(false);  // Reset animation state when hiding popup
            }, 3000); // 4 secondes

            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    return (
        <div className="bg-white p-4 shadow rounded order-1">
            {/* spinner */}
            {isLoading && <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>
            </div>}
            {/* pop up */}
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                    <div className={`${popupType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-100 text-red-800'}rounded-lg p-8 shadow-xl z-10 transform transition-transform duration-500 ease-in-out ${animate ? 'translate-x-0' : 'translate-x-[-100%]'}`}>
                        <h2 className="text-2xl mb-4 font-medium">{popupType === 'success' ? 'Merci !' : 'Erreur !'} </h2>
                        <p className={`${popupType === 'success' ? 'text-green-800' : 'text-red-800'}`} >
                            {popupType === 'success'
                                ? 'Votre ticket de gratitude a été envoyé avec succès ⭐'
                                : 'Une erreur s\'est produite lors de l\'envoi de votre ticket de gratitude.'}
                        </p>
                    </div>
                </div>
            )}

            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900  text-xl">Envoi de gratitude👇</label>
            <input type="search" value={gratitudeDestinataire} onChange={(e) => {
                setgratitudeDestinataire(e.target.value);
                setShowDropdown(true)
            }}
                aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" />
            {gratitudeDestinataire && suggestions.length > 0 && showDropdown && (
                <div className="absolute mt-2 rounded border border-gray-300 bg-white z-10">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} onClick={() => {
                            setgratitudeDestinataire(suggestion);
                            setShowDropdown(false); // si vous utilisez un état pour gérer l'affichage du dropdown
                        }} className="p-2 hover:bg-gray-200 cursor-pointer">
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
            {/* tickets counter input*/}
            <div className="flex mt-2">
                <button
                    className="bg-gray-200 p-2 rounded-l-md hover:bg-gray-300"
                    onClick={handleDecrement}
                >
                    -
                </button>
                <input
                    // type="number"
                    placeholder="nombre tickets"
                    className="bg-white rounded border p-2 w-36 text-center"
                    onChange={e => setNumberOfTickets(e.target.value)}
                    value={count === 0 ? "" : count}
                />
                <button
                    className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300"
                    onClick={handleIncrement}
                >
                    +
                </button>
            </div>

            {/* textarea commentaire de gratitude */}
            <div className="border-b pb-4 mb-4 mt-2">
                <textarea
                    rows="4"
                    className="w-full p-2 rounded border"
                    placeholder="Message de gratitude..."
                    value={gratitudeMessage}
                    onChange={(e) => setGratitudeMessage(e.target.value)}>
                </textarea>
                <button onClick={() => addGratitudeTicket()} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
                    Envoyer 💌
                </button>
            </div>

            {/* Feed/Posts */}
            <div>
                {/* Single Post */}
            </div>
        </div>
    )
}