"use client";

import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';

import { db } from '../firebase'  // Assurez-vous que le chemin est correct
import { collection, getDocs, onSnapshot, query, orderBy, limit, startAfter } from "firebase/firestore";

function TicketGratitude({ ticket }) {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const addComment = () => {
        if (newComment.length === 0) {
            return
        }
        setComments([...comments, newComment]);
        setNewComment('');
    };

    function CurrentDateComponent() {
        const currentDate = new Date();

        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        const monthNames = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];

        const monthName = monthNames[currentDate.getMonth()];

        return (
            <p className='text-slate-500 mb-3 '> 🕙 le {day} {monthName} {year}</p>
        )
    }

    const jsDate = ticket.date.toDate();
    const formattedDate = `${jsDate.getDate()}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()}`;

    return (
        <div className="m-4 bg-white p-4 shadow-md rounded-lg">
            <div className="">
                <div className="flex flex-col">
                    <img className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src="/moi2.jpg." alt=" image" />
                    <h5 className="mb-1 mt-1 text-lg font-medium text-gray-900 ">{ticket.from_email}</h5>
                </div>
                <p className='text-slate-500 mb-3'>🕙 le {formattedDate}</p>
                <div className='text-2xl font-bold p-3 text-center'>
                    A donné <span className='underline decoration-double decoration-yellow-300'>{ticket.gratitude_number}</span> tickets de gratitude à <span className='underline decoration-double decoration-yellow-300'> {ticket.to} </span> 💌
                </div>
            </div>
            <div className="mb-4 pt-4">{ticket.message}
            </div>
            {/* <div className='border-t p-2 border-b pb-4 mt-4 mb-4'>
                <div className="flex flex-col">
                    <img className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src={destinataireImg} alt="image" />
                    <h5 className="mt-1 text-lg font-medium text-gray-900 ">{destinataire}</h5>
                    {CurrentDateComponent()}
                </div>
                {commentaire.réponse}
            </div> */}
            {/* <div className='mt-2'>
                {comments.map((comment, index) => (
                    <div key={index} className="mt-2 p-3 border-t border-slate-200">
                        <div className="flex flex-col">
                            <img className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src="/mylene.jpeg" alt="mylene" />
                            <h5 className="mt-1 text-lg font-medium text-gray-900 ">Mylène Dupuy Rosso</h5>
                            {CurrentDateComponent()}
                        </div>
                        {comment}
                    </div>
                ))}
                <div className="mt-8">
                    <input
                        type="text"
                        rows="4"
                        placeholder="Ajouter un commentaire..."
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                        onClick={addComment}
                    >
                        Répondre
                    </button>
                </div>
            </div> */}
        </div>
    );
}

function Feeds() {
    const [tickets, setTickets] = useState([]);

    // Mise en place d'un écouteur pour les changements realtime
    useEffect(() => {
        fetchTickets();
        const q = query(
            collection(db, "tickets"),
            orderBy("date", "desc"),
            limit(10)  // Limite à 10 tickets
        );

        // Création de l'écouteur
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTickets(ticketsData);
        });

        // Se désabonner de l'écouteur lorsque le composant est démonté
        return () => unsubscribe();
    }, []);

    // fonctionnalité pagination
    const [lastDoc, setLastDoc] = useState(null);

    // 2. Créez une fonction pour récupérer les tickets
    async function fetchTickets() {
        let q;
        if (lastDoc) {
            q = query(
                collection(db, "tickets"),
                orderBy("date", "desc"),
                startAfter(lastDoc),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "tickets"),
                orderBy("date", "desc"),
                limit(10)
            );
        }
        const snapshot = await getDocs(q);
        const ticketsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setTickets(prevTickets => [...prevTickets, ...ticketsData]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    }

    // 4. Créez une fonction pour charger plus de tickets
    function loadMoreTickets() {
        fetchTickets();
    }
    return (
        <div>
            {tickets.map(ticket => (
                <TicketGratitude key={ticket.id} ticket={ticket} />
            ))}
            <button onClick={loadMoreTickets}>Afficher plus</button>
        </div>
    );
}

export default Feeds;
