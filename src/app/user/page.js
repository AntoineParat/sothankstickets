"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import ProtectRoute from '../../protectRoute';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { db } from '../../firebase';  // Assurez-vous que le chemin est correct
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

import GratitudeBox from "../../components/gratitudeBox";
import CommentBox from '../../components/comments';
import Navbar from '../../components/navbar';

function UserPage() {
  const router = useRouter()

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
              {/* <h2 className="text-lg text-center font-semibold mb-4">Profile</h2> */}
              {/* photo nom et infos*/}
              <div className="flex flex-col mt-10 items-center pb-10">
                <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/mylene.jpeg" alt="Mylène" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 ">Mylène Dupuy Rosso</h5>
                <span className="text-sm text-gray-500 ">Zone Sud-Ouest</span>
                <p className=" mt-4 text-gray-800 ">38 gratitudes reçues</p>
                <p className=" mt-2 text-gray-800 ">92 tickets restants</p>
              </div>
            </div>

            {/* Dernières activités */}
            <div className="w-full mb-4 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">Derniers tickets reçus</h5>
                {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                  View all
                </a> */}
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Neil image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          collaborateur 1
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          collaborateur1@acadomia.fr
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                        6
                      </div>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt=" image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          collaborateur 2
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          collaborateur2@acadomia.fr
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                        5
                      </div>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Michael image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          Collaborateur 3
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          collaborateur3@acadomia.fr
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                        11
                      </div>
                    </div>
                  </li>
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Lana image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          collaborateur 4
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          collaborateur4@acadomia.fr
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                        9
                      </div>
                    </div>
                  </li>
                  <li className="pt-3 pb-0 sm:pt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Thomas image" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate ">
                          collaborateur 5
                        </p>
                        <p className="text-sm text-gray-500 truncate ">
                          collaborateur5@acadomia.fr
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                        21
                      </div>
                    </div>
                  </li>
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
            <CommentBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectRoute(UserPage);
