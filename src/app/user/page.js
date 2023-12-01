"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import ProtectRoute from '../../protectRoute';

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

import { db } from '../../firebase'  // Assurez-vous que le chemin est correct
import { collection, doc, getDocs, onSnapshot, query, orderBy, limit, startAfter } from "firebase/firestore";

import GratitudeBox from "../../components/gratitudeBox";
import TicketGratitude from '../../components/Feeds';
import Navbar from '../../components/navbar';
import UserBox from '../../components/user/userBox';

function UserPage() {
  const router = useRouter()

  const [tickets, setTickets] = useState([]);

  // Mise en place d'un écouteur pour les nouveaux tickets realtime
  useEffect(() => {
    console.log("use effect chargement tickets")
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
  const [allTicketsLoaded, setAllTicketsLoaded] = useState(false);

  // 2. Créez une fonction pour récupérer les tickets
  async function fetchTickets() {
    console.log("fetch tikcets")
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

    // Vérifiez si tous les tickets ont été chargés
    if (snapshot.docs.length < 10) {
      setAllTicketsLoaded(true);
    } else {
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    }
  }

  // 4. Créez une fonction pour charger plus de tickets
  function loadMoreTickets() {
    fetchTickets();
  }

  //mise à jour du top 3 en temps réel
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    const statsDocRef = doc(db, 'stats', currentMonth);

    const unsubscribe = onSnapshot(statsDocRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.top3) {
        setTop3(data.top3);
      }
    });

    // Nettoyage : se désabonner de l'écouteur quand le composant est démonté.
    return () => unsubscribe();
  }, []);







  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
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

            {/* Dernieres tickets reçues */}
            <div className="w-full mb-4 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">Derniers tickets reçus</h5>
                {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                  View all
                </a> */}
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  {tickets.map((ticket, index) =>
                    <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img className="w-8 h-8 rounded-full" src={ticket.to_photoURL} alt="Neil image" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            {ticket.to_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate ">
                            {ticket.to_email}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                          {ticket.gratitude_number}
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* Main content */}
          <div className="md:w-3/4 md:ml-4 flex-col">

            {/* send gratitude box*/}
            <GratitudeBox />

            {/* gratitude heroes*/}
            <div className="border-t p-2 border-b pb-4 mt-4">
              <p className="font-bold text-lg">Gratitude Heroes 🏆</p>
            </div>

            {/*TOP 3*/}
            <div className="w-full md:flex">
              {top3.length === 0 ? (
                <div className="text-center mt-10">
                  <p className="text-lg text-gray-800">1er du mois : les compteurs sont remis à 0 😊</p>
                </div>
              ) : (
                top3.map((user, index) => (
                  <div key={index} className="md:w-1/3">
                    <div className="flex flex-col mt-10 items-center pb-10">
                      <img onClick={() => router.push('/user/' + user.email)} className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400 cursor-pointer" src={user.photoURL} alt={user.name} />
                      <h5 className="mb-1 text-xl font-medium text-gray-900">{user.name}</h5>
                      <span className="text-sm text-gray-500">Zone {user.zone}</span>
                      <p className="mt-4 text-gray-800">{user.gratitudes} gratitudes reçues</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/*feeds news*/}
            <div className="border-t p-2 border-b pb-4 mt-4">
              <p className="font-bold text-lg">Fil d'actualités</p>
            </div>
            {/* <Feeds/> */}
            <div>
              {tickets.map(ticket => (
                <TicketGratitude key={ticket.id} ticket={ticket} />
              ))}
              {!allTicketsLoaded && <button onClick={loadMoreTickets}>Afficher plus</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectRoute(UserPage);
