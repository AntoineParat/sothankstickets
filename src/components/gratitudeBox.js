"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import { useState, useEffect } from "react";

import db from '../firebase'  // Assurez-vous que le chemin est correct
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function GratitudeBox() {
    // tickets counter logic
    const [count, setCount] = useState(0);
    const [gratitudeMessage, setGratitudeMessage] = useState('');

    function handleIncrement() {
        setCount(count + 1);
    }

    function handleDecrement() {
        setCount(count - 1);
    }

    function setNumberOfTickets(e) {
        const value = parseInt(e, 10);
        if (e === "") {
            setCount(null);
        } else if (!isNaN(value)) {
            setCount(value);
        }
    }

    async function addGratitudeTicket() {
        const ticketsCollectionRef = collection(db, 'tickets');

        try {
            const docRef = await addDoc(ticketsCollectionRef, {
                from: 'antoine.parat@acadomia.fr',
                to: gratitudeDestinataire,
                gratitude_number: count,  // Je suppose qu'il y a une petite faute de frappe ici, et que vous vouliez dire "gratitude_number".
                message: gratitudeMessage,
                date: serverTimestamp()  // Ceci ajoutera automatiquement la date et l'heure actuelles en utilisant le timestamp du serveur.
            });

            console.log(`Ticket de gratitude ajouté avec l'ID: ${docRef.id}`);
        } catch (e) {
            console.error("Erreur lors de l'ajout du ticket de gratitude: ", e);
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
    return (
        <div className="bg-white p-4 shadow rounded order-1">
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
                <button onClick={addGratitudeTicket} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
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