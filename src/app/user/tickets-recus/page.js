"use client"

import { useEffect, useState, useRef } from 'react';

import Navbar from '../../../components/navbar';
import TicketGratitude from '../../../components/Feeds';
import UserBox from '@/components/user/userBox';

import { db, auth } from '../../../firebase';  // Assurez-vous que le chemin est correct

import {
    collection,
    doc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    startAfter,
    limit,
    where
} from 'firebase/firestore';

export default function Ticketsrecus() {

    const [tickets, setTickets] = useState([]);

    const user = auth.currentUser
    // const userEmail = user.email
    const userEmail = user ? user.email : null;  // Utiliser une opération de court-circuit pour vérifier si `user` existe.

    const fetchInProgress = useRef(false);

    useEffect(() => {
        if (!fetchInProgress.current && userEmail) { // ajout de && usermeail pour ne pas accéder à currentuser quand il est null
            fetchTickets();
            fetchInProgress.current = true;
        }
    }, []);

    //Mettre à 0 le compteur des tickets non-lu
    useEffect(() => {    
        if (user) {
          // Récupère la référence du document de l'utilisateur
          const userDocRef = doc(db, 'utilisateurs', user.uid);
    
          // Mettre à jour le compteur des tickets non lus à 0
          updateDoc(userDocRef, {
            tickets_non_lus: 0
          }).then(() => {
            console.log("Compteur des tickets non lus mis à jour.");
          }).catch(error => {
            console.error("Erreur lors de la mise à jour du compteur des tickets non lus: ", error);
          });
        }
      }, []);

    const [lastDoc, setLastDoc] = useState(null);
    const [allTicketsLoaded, setAllTicketsLoaded] = useState(false);

    async function fetchTickets() {
        console.log("fetchTickets called", { lastDoc, userEmail });

        let q;
        if (lastDoc) {
            q = query(
                collection(db, "tickets"),
                where("to", "==", userEmail),
                orderBy("date", "desc"),
                startAfter(lastDoc),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "tickets"),
                where("to", "==", userEmail),
                orderBy("date", "desc"),
                limit(10)
            );
        }
        const snapshot = await getDocs(q);
        const ticketsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("ticketsData fetched", ticketsData);
        // Reset fetchInProgress when the fetch completes

        setTickets(prevTickets => [...prevTickets, ...ticketsData]);


        fetchInProgress.current = false;


        if (snapshot.docs.length < 10) {
            setAllTicketsLoaded(true);
        } else {
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
    }

    function loadMoreTickets() {
        console.log("loadMoreTickets called");
        fetchTickets();
    }


    // async function fetchTickets() {
    //     let q;
    //     if (lastDoc) {
    //         q = query(
    //             collection(db, "tickets"),
    //             where("to", "==", userEmail),
    //             orderBy("date", "desc"),
    //             startAfter(lastDoc),
    //             limit(10)
    //         );
    //     } else {
    //         q = query(
    //             collection(db, "tickets"),
    //             where("to", "==", userEmail),
    //             orderBy("date", "desc"),
    //             limit(10)
    //         );
    //     }
    //     const snapshot = await getDocs(q);
    //     const ticketsData = snapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data()
    //     }));
    //     setTickets(prevTickets => [...prevTickets, ...ticketsData]);

    //     if (snapshot.docs.length < 10) {
    //         setAllTicketsLoaded(true);
    //     } else {
    //         setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    //     }
    // }

    // function loadMoreTickets() {
    //     fetchTickets();
    // }

    return (
        <div>
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                {/* Main Content */}
                <div className="container sm:mx-10 md:mx-auto mt-10">
                    {/* Sidebar & Main content */}
                    <div className="md:flex">
                        {/* Sidebar */}
                        <div className="md:w-1/4">
                            <div className="bg-white p-4 shadow mb-4">
                                <UserBox />

                            </div>

                        </div>

                        {/* Main content */}
                        <div className="md:w-3/4 md:ml-4 flex-col">
                            {/*feeds news*/}
                            <div>
                                {tickets.map(ticket => (
                                    <TicketGratitude key={ticket.id} ticket={ticket} />
                                ))}
                                {!allTicketsLoaded && <button onClick={loadMoreTickets}>Afficher plus</button>}
                            </div>
                            {/* <CommentBox /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
