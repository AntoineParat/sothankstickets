"use client";

import { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/navigation';

import { db } from '../firebase'  // Assurez-vous que le chemin est correct
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { auth } from '../firebase';

function TicketGratitude({ ticket }) {
    const router = useRouter();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const user = auth.currentUser;

    useEffect(() => {

        const commentsQuery = query(
            collection(db, 'tickets', ticket.id, 'comments'),
            orderBy('date', 'asc')  // 'asc' signifie "ascending", c'est-à-dire du plus ancien au plus récent.
        );
        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const fetchedComments = snapshot.docs.map(doc => doc.data());
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [ticket.id]);

    const addCommentToDb = async () => {
        if (newComment.trim() === '') return;

        const commentsCollection = collection(db, 'tickets', ticket.id, 'comments');
        await addDoc(commentsCollection, {
            comment_from_email: user.email,
            comment_from_uid: user.uid,
            comment_from_img: user.photoURL,
            text: newComment,
            date: serverTimestamp()  // Storing the current date/time for the comment
        });

        setNewComment(''); // Clear the input after adding the comment
    };

    const jsDate = ticket.date ? ticket.date.toDate() : new Date();
    const formattedDate = `${jsDate.getDate()}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()} à ${jsDate.getHours()}:${jsDate.getMinutes().toString().padStart(2, '0')}`;

    return (
        <div className="m-4 bg-white p-4 shadow-md rounded-lg">
            <div className="">
                <div className="flex flex-col">
                    <img onClick={() => {router.push('/user/profil?id='+ticket.from_uid) }}  className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src={ticket.from_photoURL} alt=" image" />
                    <h5 className="mb-1 mt-1 text-lg font-medium text-gray-900 ">{ticket.from_email}</h5>
                </div>
                <p className='text-slate-500 mb-3'>🕙 le {formattedDate}</p>
                <div className='text-2xl font-bold p-3 text-center'>
                    A donné <span className='underline decoration-double decoration-yellow-300'>{ticket.gratitude_number}</span> tickets de gratitude à <span className='underline decoration-double decoration-yellow-300'> {ticket.to_email} </span> 💌
                </div>
            </div>
            <div className="mb-4 pt-4">{ticket.message} </div>
            <div className='mt-2'>
                {comments.map((comment, index) => {
                    const commentDate = comment.date ? comment.date.toDate() : new Date();
                    const formattedCommentDate = `${commentDate.getDate()}/${commentDate.getMonth() + 1}/${commentDate.getFullYear()} à ${commentDate.getHours()}:${commentDate.getMinutes().toString().padStart(2, '0')}`;

                    return (
                        <div key={index} className="mt-2 ml-2 p-3 border-t border-slate-200">
                            {/* Vous pouvez ajouter un JSX pour l'auteur du commentaire si nécessaire */}
                            <img onClick={() => {router.push('/user/profil?id='+comment.comment_from_uid) }} className="w-20 h-20 p-1 rounded-full ring-4 ring-yellow-400 cursor-pointer" src={comment.comment_from_img} alt="image" />
                            <h5 className="mb-1 mt-1 text-lg font-medium text-gray-900 ">{comment.comment_from_email}</h5>
                            <p className='text-slate-500 mb-3'>🕙 le {formattedCommentDate}</p>
                            {comment.text}
                        </div>
                    )
                })}
                <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        className="w-full p-2 border border-gray-300 rounded"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                        onClick={addCommentToDb}
                    >
                        Répondre
                    </button>
                </div>
            </div>
        </div>
    );
}

// function Feeds() {
//     const [tickets, setTickets] = useState([]);

//     // Mise en place d'un écouteur pour les changements realtime
//     useEffect(() => {
//         fetchTickets();
//         const q = query(
//             collection(db, "tickets"),
//             orderBy("date", "desc"),
//             limit(10)  // Limite à 10 tickets
//         );

//         // Création de l'écouteur
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const ticketsData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setTickets(ticketsData);
//         });

//         // Se désabonner de l'écouteur lorsque le composant est démonté
//         return () => unsubscribe();
//     }, []);

//     // fonctionnalité pagination
//     const [lastDoc, setLastDoc] = useState(null);
//     const [allTicketsLoaded, setAllTicketsLoaded] = useState(false);

//     // 2. Créez une fonction pour récupérer les tickets
//     async function fetchTickets() {
//         let q;
//         if (lastDoc) {
//             q = query(
//                 collection(db, "tickets"),
//                 orderBy("date", "desc"),
//                 startAfter(lastDoc),
//                 limit(10)
//             );
//         } else {
//             q = query(
//                 collection(db, "tickets"),
//                 orderBy("date", "desc"),
//                 limit(10)
//             );
//         }
//         const snapshot = await getDocs(q);
//         const ticketsData = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
//         setTickets(prevTickets => [...prevTickets, ...ticketsData]);

//         // Vérifiez si tous les tickets ont été chargés
//         if (snapshot.docs.length < 10) {
//             setAllTicketsLoaded(true);
//         } else {
//             setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
//         }
//     }

//     // 4. Créez une fonction pour charger plus de tickets
//     function loadMoreTickets() {
//         fetchTickets();
//     }
//     return (
//         <div>
//             {tickets.map(ticket => (
//                 <TicketGratitude key={ticket.id} ticket={ticket} />
//             ))}
//             {!allTicketsLoaded && <button onClick={loadMoreTickets}>Afficher plus</button>}
//         </div>
//     );
// }

export default TicketGratitude;
