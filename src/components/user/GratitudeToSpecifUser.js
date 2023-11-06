"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import { useState, useEffect } from "react";

import { db, auth } from '../../firebase'  // Assurez-vous que le chemin est correct
import { collection, addDoc, updateDoc, serverTimestamp, doc, getDoc, increment } from 'firebase/firestore';

export default function GratitudeToSpecificUser({ userData, userId }) {
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
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function addGratitudeTicket() {
        setIsLoading(true);

        const user = auth.currentUser;
        if (!user) {
            console.error("Aucun utilisateur connecté");
            setIsLoading(false);
            return;
        }

        // Déterminer le mois en cours
        const currentDate = new Date();
        const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        // Récupérer la zone et le solde des tickets de l'utilisateur actuel
        const currentUserRef = doc(db, 'utilisateurs', user.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentUserMonthDocRef = doc(db, 'utilisateurs', user.uid, currentMonth, 'gratitudeData');
        const currentUserMonthDocSnap = await getDoc(currentUserMonthDocRef);

        const from_zone = currentUserSnap.data().zone;
        const ticket_zone = currentUserMonthDocSnap.data().ticket_zone;
        const ticket_horszone = currentUserMonthDocSnap.data().ticket_horszone;

        // Vérifier si le destinataire est dans la même zone que l'utilisateur actuel
        const isSameZone = from_zone === userData.zone;

        const ticketType = isSameZone ? 'ticket_zone' : 'ticket_horszone';
        const ticketCount = isSameZone ? ticket_zone : ticket_horszone;

        if (ticketCount < count) {
            console.error(`Solde insuffisant pour ${ticketType}.`);
            setErrorMessage('Solde de tickets unsuffisant !')
            setIsLoading(false);
            setShowPopup(true);
            setPopupType('error');
            setCount(0)
            setgratitudeDestinataire('')
            setGratitudeMessage('')
            return;
        }

        // enregistrer le ticket
        try {
            const ticketsCollectionRef = collection(db, 'tickets');
            await addDoc(ticketsCollectionRef, {
                from_email: user.email,
                from_name: user.displayName, //user.name
                from_uid: user.uid,
                from_photoURL: user.photoURL,
                to_uid: userId,
                to_email: userData.email,
                to_name: userData.name,
                to_photoURL: userData.photoURL,
                gratitude_number: count,
                message: gratitudeMessage,
                date: serverTimestamp()  // Ceci ajoutera automatiquement la date et l'heure actuelles en utilisant le timestamp du serveur.
            });

            // Mettre à jour le solde des tickets
            await updateDoc(currentUserMonthDocRef, {
                [ticketType]: increment(-count)  // Décrémenter le solde approprié
            });

            setIsLoading(false)
            setShowPopup(true)
            setPopupType('success');  // Définir le type de popup sur 'success'
            setCount(0)
            setGratitudeMessage('')
        } catch (e) {
            console.log(e)
            setIsLoading(false)
            setShowPopup(true);
            setErrorMessage('Une erreur s\'est produite lors de l\'envoi de votre ticket de gratitude.')
            setPopupType('error');
            setCount(0)
            setGratitudeMessage('')
        }
    }

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
                                : errorMessage}
                        </p>
                    </div>
                </div>
            )}

            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900  text-xl">Envoi de gratitude 👇</label>
            {/* tickets counter input*/}
            <div className="flex mt-2">
                <button
                    type="button"
                    className="bg-gray-200 p-2 rounded-l-md hover:bg-gray-300"
                    onClick={handleDecrement}
                >
                    -
                </button>
                <input
                    // type="number"
                    required
                    placeholder="nombre tickets"
                    className="bg-white rounded border p-2 w-36 text-center"
                    onChange={e => setNumberOfTickets(e.target.value)}
                    value={count === 0 ? "" : count}
                />
                <button
                    type="button"
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