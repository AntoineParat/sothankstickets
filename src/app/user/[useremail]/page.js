"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from '../../../components/navbar';
import TicketFromUser from '../../../components/Feeds';
import GratitudeToSpecificUser from '../../../components/user/GratitudeToSpecifUser';


import { db } from '../../../firebase';
import { collection, doc, getDoc, query, where, orderBy, limit, startAfter, getDocs, onSnapshot } from 'firebase/firestore';


export default function TicketsPage({ params }) {

  const router = useRouter();

  // <---------------  RECUPERATION TICKETS --------------->

  const userEmail = params.useremail ? decodeURIComponent(params.useremail) : '';

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!userEmail) return; // S'assurer que userEmail est disponible
    console.log("lancement")

    fetchTickets();
    const q = query(
      collection(db, "tickets"),
      where("to_email", "==", userEmail), // Filtrer par e-mail de l'utilisateur
      orderBy("date", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      if (snapshot.docs.length === 0) {
        // Aucun ticket trouvé pour cet e-mail
        console.log("aucun user")
        setError('Aucun ticket trouvé pour cet e-mail.');
        return; // Terminez ici si aucun ticket n'est trouvé
      }

      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
    });

    return () => unsubscribe();
  }, []);

  // fonctionnalités pagination
  const [lastDoc, setLastDoc] = useState(null);
  const [allTicketsLoaded, setAllTicketsLoaded] = useState(false);

  // Fonction pour récupérer les tickets
  async function fetchTickets() {
    if (!userEmail) return;

    let q;
    if (lastDoc) {
      q = query(
        collection(db, "tickets"),
        where("to_email", "==", userEmail), // Filtrer par e-mail de l'utilisateur
        orderBy("date", "desc"),
        startAfter(lastDoc),
        limit(10)
      );
    } else {
      q = query(
        collection(db, "tickets"),
        where("to_email", "==", userEmail),
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

  // Fonction pour charger plus de tickets
  function loadMoreTickets() {
    fetchTickets();
  }

  // <---------------  RECUPERATION DONNEES UTILISATEUR --------------->


  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams()

  const userId = searchParams.get('is')

  useEffect(() => {
    if (!userId) return;

    let unsubscribeFromGratitudeData = () => { };

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'utilisateurs', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const baseUserData = userSnap.data();
          setUserData(baseUserData);

          // Calculer le mois en cours pour la sous-collection
          const currentDate = new Date();
          const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

          // Souscription aux données de gratitude
          const gratitudeDataRef = doc(db, 'utilisateurs', userId, currentMonth, 'gratitudeData');
          unsubscribeFromGratitudeData = onSnapshot(gratitudeDataRef, (doc) => {
            if (doc.exists()) {
              const gratitudeData = doc.data();
              setUserData(prevData => ({ ...prevData, ...gratitudeData }));
            }
          });
        } else {
          setError('Les informations de l’utilisateur n’existent pas.');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", err);
        setError('Une erreur est survenue lors de la récupération des données.');
      }
    };

    fetchUserData();

    return () => {
      // Nettoyer l'écouteur lors du démontage du composant
      unsubscribeFromGratitudeData();
    };
  }, []);

  // const fetchUserData = async () => {
  //   if (!userId) return;
  //   console.log("ok")

  //   try {
  //     const userRef = doc(db, 'utilisateurs', userId);
  //     const userSnap = await getDoc(userRef);

  //     if (userSnap.exists()) {
  //       const baseUserData = userSnap.data();
  //       setUserData(baseUserData);

  //       // Calculer le mois en cours pour la sous-collection
  //       const currentDate = new Date();
  //       const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

  //       // Récupérer les données de gratitude pour l'utilisateur
  //       const gratitudeDataRef = doc(db, 'utilisateurs', userId, currentMonth, 'gratitudeData');
  //       const gratitudeDataSnap = await getDoc(gratitudeDataRef);

  //       if (gratitudeDataSnap.exists()) {
  //         const gratitudeData = gratitudeDataSnap.data();
  //         setUserData(prevData => ({ ...prevData, ...gratitudeData }));
  //       } else {
  //         setError('Les données de gratitude pour cet utilisateur ne sont pas disponibles pour le mois en cours.');
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Erreur lors de la récupération des données de l'utilisateur:", err);
  //     setError('Une erreur est survenue lors de la récupération des données.');
  //   }
  // };

  // // fetch user data 
  // useEffect(() => {
  //   fetchUserData();
  // }, []);


  // <---------------  GRATITUDE BOX LOGIC --------------->


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
      setCount(null);
    } else if (!isNaN(value)) {
      setCount(value);
    }
  }

  // suggestion adresses email
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      // Ici, fetchez vos suggestions à partir de votre API ou autre source.
      // Pour cet exemple, utilisons une liste de données factices.
      const dummyData = ['suggestion1@acadomia.fr', 'suggestion2@acadomia.fr'];
      setSuggestions(dummyData);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);


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
              {/* <h2 className="text-lg text-center font-semibold mb-4">Profile</h2> */}
              {/* User box */}
              <div className="flex flex-col mt-10 items-center pb-10">
                {userData && (
                  <>
                    <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400"
                      src={userData.photoURL}
                      alt={userData.name} />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 ">{userData.name}</h5>
                    <span className="text-sm text-gray-500 ">{userData.zone}</span>
                    <p className=" mt-4 text-gray-800 ">{userData.gratitudes} gratitudes reçues</p>
                    <p className=" mt-2 text-gray-800 ">{userData.ticket_zone} tickets zone restants</p>
                    <p className=" mt-2 text-gray-800 ">{userData.ticket_horszone} tickets hors zone restants</p>
                  </>
                )}
              </div>
            </div>

            {/* Dernières activités */}
            <div className="w-full mb-4 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
              <ul role="list" className="divide-y divide-gray-200">
                {tickets.map((ticket, index) =>
                  <li key={index} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src={ticket.from_photoURL} alt="Neil image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          {ticket.from_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          {ticket.from_email}
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

          {/* Main content */}
          <div className="md:w-3/4 md:ml-4 flex-col">

            {/* send gratitude box*/}
            {userData && <GratitudeToSpecificUser userData={userData} userId={userId}/>}

            {/*feeds news*/}
            <div className="border-t p-2 border-b pb-4 mt-4">
              {userData && <p className="font-bold text-lg">Activités récentes de {userData.name} 📡</p>}
            </div>
            <div>
              {tickets.map(ticket => (
                <TicketFromUser key={ticket.id} ticket={ticket} />
              ))}
              {!allTicketsLoaded && <button onClick={loadMoreTickets}>Afficher plus</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
