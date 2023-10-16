"use client";

import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function TicketGratitude({donateur, donateurImg, date, tickets, destinataire, destinataireImg, commentaire }) {
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
                    <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 " src={donateurImg} alt=" image" />
                    <h5 class="mb-1 mt-1 text-lg font-medium text-gray-900">{donateur}</h5>
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
                    <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400" src={destinataireImg} alt=" image" />
                    <h5 class="mt-1 text-lg font-medium text-gray-900">{destinataire}</h5>
                    {CurrentDateComponent()}
                </div>
                {commentaire.réponse}
            </div>
            <div className='mt-2'>
                {comments.map((comment, index) => (
                    <div key={index} className="mt-2 p-3 border-t border-slate-200">
                        <div class="flex flex-col">
                            <img class="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400" src="/mylene.jpeg" alt=" image" />
                            <h5 class="mt-1 text-lg font-medium text-gray-900">Mylène Dupuy Rosso</h5>
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

function CommentBox(props) {
    return (
        <div>
            <TicketGratitude
                donateur="Guillaume"
                donateurImg="/Guillaume.jpeg"
                date="15 Octobre 2023"
                tickets={Math.floor(Math.random() * 20) + 1}
                destinataire={props.username}
                destinataireImg={props.username === 'Antoine' ? '/moi2.jpg' : "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"}
                commentaire={{
                    texte: "",
                    réponse: "Merci pour ces tickets !"
                }}
            />
            {/* Vous pouvez ajouter d'autres <TicketGratitude /> ici */}
            <TicketGratitude
                donateur={props.username}
                donateurImg={props.username === 'Antoine' ? '/moi2.jpg' : "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"}
                date="16 Octobre 2023"
                tickets={Math.floor(Math.random() * 50) + 1}
                destinataire="Axelle Rouais"
                destinataireImg="/Axelle.jpeg"
                commentaire={{
                    texte: "🙏🙏🙏",
                    réponse: "😁😁 "
                }}
            />
        </div>
    );
}

export default CommentBox;
