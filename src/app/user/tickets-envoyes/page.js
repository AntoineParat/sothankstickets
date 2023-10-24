// "use client"
// import Navbar from '../../../components/navbar';
// import CommentBox from '../../../components/comments-donnes';
// import UserBox from '@/components/user/userBox';

// import { useEffect } from 'react';


// export default function Ticketsrecus() {

//     useEffect(()=> {
//         console.log("composant chargé")
//     }, [])

//     return (
//         <div>
//             <div className="min-h-screen bg-slate-100">
//                 <Navbar />
//                 {/* Main Content */}
//                 <div className="container sm:mx-10 md:mx-auto mt-10">
//                     {/* Sidebar & Main content */}
//                     <div className="md:flex">
//                         {/* Sidebar */}
//                         <div className="md:w-1/4">
//                             <div className="bg-white p-4 shadow mb-4">
//                                 <UserBox/>
//                             </div>

//                         </div>

//                         {/* Main content */}
//                         <div className="md:w-3/4 md:ml-4 flex-col">
//                             {/*feeds news*/}
//                             <CommentBox />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client"

import { useEffect, useState, useRef } from 'react';

import Navbar from '../../../components/navbar';
import TicketGratitude from '../../../components/Feeds';
import UserBox from '@/components/user/userBox';

import { db, auth } from '../../../firebase';  // Assurez-vous que le chemin est correct

import {
    collection,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit,
    where
} from 'firebase/firestore';

export default function Ticketsrecus() {

    const [tickets, setTickets] = useState([]);
    const userEmail = auth.currentUser.email;

    const fetchInProgress = useRef(false);

    useEffect(() => {
        if (!fetchInProgress.current) {
            fetchTickets();
            fetchInProgress.current = true;
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
                where("from_email", "==", userEmail),
                orderBy("date", "desc"),
                startAfter(lastDoc),
                limit(10)
            );
        } else {
            q = query(
                collection(db, "tickets"),
                where("from_email", "==", userEmail),
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

