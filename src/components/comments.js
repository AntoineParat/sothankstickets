"use client";

import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function TicketGratitude({ donateur, donateurImg, date, tickets, destinataire, destinataireImg, commentaire }) {
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

    return (
        <div className="m-4 bg-white p-4 shadow-md rounded-lg">
            <div className="">
                <div class="flex flex-col">
                    <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 dark:ring-gray-500" src={donateurImg} alt="Bonnie image" />
                    <h5 class="mb-1 mt-1 text-lg font-medium text-gray-900 dark:text-white">{donateur}</h5>
                </div>
                <p className='text-slate-500 mb-3'>🕙 le {date}</p>
                <div className='text-2xl font-bold p-3 text-center'>
                    A donné <span className='underline decoration-double decoration-yellow-300'>{tickets}</span> tickets de gratitude à <span className='underline decoration-double decoration-yellow-300'> {destinataire} </span> 💌
                </div>
            </div>
            <div className="mb-4 pt-4">{commentaire.texte}
            </div>
            <div className='border-t p-2 border-b pb-4 mt-4 mb-4'>
                <div class="flex flex-col">
                    <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 dark:ring-gray-500" src={destinataireImg} alt="Bonnie image" />
                    <h5 class="mt-1 text-lg font-medium text-gray-900 dark:text-white">{destinataire}</h5>
                    {CurrentDateComponent()}
                </div>
                {commentaire.réponse}
            </div>
            <div className='mt-2'>
                {comments.map((comment, index) => (
                    <div key={index} className="mt-2 p-3 border-t border-slate-200">
                        <div class="flex flex-col">
                            <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 dark:ring-gray-500" src="/mylene.jpeg" alt="Bonnie image" />
                            <h5 class="mt-1 text-lg font-medium text-gray-900 dark:text-white">Mylène Dupuy Rosso</h5>
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
            </div>
        </div>
    );
}

function CommentBox() {
    return (
        <div>
            <TicketGratitude
                donateur="Céline Vermeulen-Franceschi"
                donateurImg="/celine.jpeg"
                date="12 Octobre 2023"
                tickets={5}
                destinataire="Guillaume"
                destinataireImg="/Guillaume.jpeg"
                commentaire={{
                    texte: "Merci pour ton aide précieuse !",
                    réponse: "Avec plaisir !"
                }}
            />
            {/* Vous pouvez ajouter d'autres <TicketGratitude /> ici */}
            <TicketGratitude
                donateur="Axelle Rouais"
                donateurImg="/Axelle.jpeg"
                date="14 Octobre 2023"
                tickets={56}
                destinataire="Claire"
                destinataireImg="/claire.jpeg"
                commentaire={{
                    texte: "Super la visio sur le nouveau format du cours collectif",
                    réponse: " A ton service 😀"
                }}
            />
        </div>
    );
}

export default CommentBox;
