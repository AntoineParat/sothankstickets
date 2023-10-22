"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import ProtectRoute from '../../protectRoute';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { db } from '../../firebase'  // Assurez-vous que le chemin est correct
import { collection, getDocs, onSnapshot, query, orderBy, limit, startAfter } from "firebase/firestore";

import GratitudeBox from "../../components/gratitudeBox";
import TicketGratitude from '../../components/Feeds';
import Navbar from '../../components/navbar';
import UserBox from '../../components/user/userBox';

function UserPage() {
  const router = useRouter()

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
  const [allTicketsLoaded, setAllTicketsLoaded] = useState(false);

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


  // const [usersData, setUsersData] = useState([]); // Initialiser l'état avec un tableau vide.

  // async function fetchUsers() {
  //   const usersCollectionRef = collection(db, 'utilisateurs');  // 'users' est le nom de la collection.
  //   const querySnapshot = await getDocs(usersCollectionRef);

  //   const usersArray = querySnapshot.docs.map(doc => {
  //     return { id: doc.id, ...doc.data() };
  //   });

  //   return usersArray;
  // }

  // useEffect(() => {
  //   // Récupérer les données de l'utilisateur et les définir dans l'état.
  //   fetchUsers().then(users => {
  //     setUsersData(users);
  //   });
  // }, []);

  // Afficher `usersData` dans la console chaque fois qu'il est mis à jour.
  // useEffect(() => {
  //   console.log(usersData);
  // }, [usersData]);



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

            {/* Dernieres gratitudes reçues */}
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
                          <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Neil image" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate ">
                            name {/*ticket.from_name */}
                          </p>
                          <p className="text-sm text-gray-500 truncate ">
                            {ticket.to}
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
              <p className="font-bold text-lg">Gratitude Heroes</p>
            </div>

            {/*TOP 3*/}
            <div className="w-full md:flex">
              <div className="md:w-1/3 ">
                <div className="flex flex-col mt-10 items-center pb-10">
                  <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400 cursor-pointer" src="/mylene.jpeg" alt="Mylène" />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 ">Mylène Dupuy Rosso</h5>
                  <span className="text-sm text-gray-500 ">Zone Sud-Ouest</span>
                  <p className=" mt-4 text-gray-800 ">38 gratitudes reçues</p>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="flex flex-col mt-10 items-center pb-10">
                  <img onClick={() => router.push('/user/Antoine')} className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400 cursor-pointer" src="/moi2.jpg" alt="Antoine" />
                  <h5 className="mb-1 text-xl font-medium text-gray-900">Antoine Parat</h5>
                  <span className="text-sm text-gray-500 ">Zone Sud-Ouest</span>
                  <p className=" mt-4 text-gray-800 ">29 gratitudes reçues</p>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="flex flex-col mt-10 items-center pb-10">
                  <img onClick={() => router.push('/user/Collaborateur 5')} className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400 cursor-pointer" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt=" image" />
                  <h5 className="mb-1 text-xl font-medium text-gray-900">Collaborateur 5</h5>
                  <span className="text-sm text-gray-500 ">Zone Nord</span>
                  <p className=" mt-4 text-gray-800 ">21 gratitudes reçues</p>
                </div>
              </div>
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
