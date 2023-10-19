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
                <div className="flex flex-col">
                    <img className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src={donateurImg} alt=" image" />
                    <h5 className="mb-1 mt-1 text-lg font-medium text-gray-900 ">{donateur}</h5>
                </div>
                <p className='text-slate-500 mb-3'>🕙 le {date}</p>
                <div className='text-2xl font-bold p-3 text-center'>
                    A donné <span className='underline decoration-double decoration-yellow-300'>{tickets}</span> tickets de gratitude à <span className='underline decoration-double decoration-yellow-300'> {destinataire} </span> 💌
                </div>
            </div>
            <div className="mb-4 pt-4">{commentaire.texte}
            </div>
            {commentaire.réponse.length > 0 && <div className='border-t p-2 border-b pb-4 mt-4 mb-4'>
                <div className="flex flex-col">
                    <img className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer"src={destinataireImg} alt="image" />
                    <h5 className="mt-1 text-lg font-medium text-gray-900 ">{destinataire}</h5>
                    {CurrentDateComponent()}
                </div>
                {commentaire.réponse}
            </div>}
            <div className='mt-2'>
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
            </div>
        </div>
    );
}

function CommentBox() {
    return (
        <div>
            <TicketGratitude
                donateur="Mylène"
                donateurImg="/mylene.jpeg"
                date="16 Octobre 2023"
                tickets={20}
                destinataire="Collaborateur"
                destinataireImg="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
                commentaire={{
                    texte: "Passionant le projet CSE",
                    réponse: "Plaisir partagé !"
                }}
            />
            {/* Vous pouvez ajouter d'autres <TicketGratitude /> ici */}
            <TicketGratitude
                donateur="Mylène"
                donateurImg="/mylene.jpeg"
                date="13 Octobre 2023"
                tickets={12}
                destinataire="Céline"
                destinataireImg="/celine.jpeg"
                commentaire={{
                    texte: "Un acceuil toujours très chaleureux à Montpellier",
                    réponse: "De même qu'à Béziers 😀"
                }}
            />
            <TicketGratitude
                donateur="Mylène"
                donateurImg="/mylene.jpeg"
                date="11 Octobre 2023"
                tickets={56}
                destinataire="Guillaume"
                destinataireImg="/Guillaume.jpeg"
                commentaire={{
                    texte: "Parce qu'on forme une belle équipe",
                    réponse: "🚀"
                }}
            />
            <TicketGratitude
                donateur="Mylène"
                donateurImg="/mylene.jpeg"
                date="10 Octobre 2023"
                tickets={6}
                destinataire="Collaborateur 2"
                destinataireImg="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
                commentaire={{
                    texte: "",
                    réponse: ""
                }}
            />
        </div>
    );
}

export default CommentBox;
