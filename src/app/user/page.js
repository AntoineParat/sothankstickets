"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed for that component, making it a Client Component:

import { useState, useEffect } from "react";

import CommentBox from '../../components/comments';
import Navbar from '../../components/navbar';

export default function App() {

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
              {/* photo nom et infos*/}
              <div class="flex flex-col mt-10 items-center pb-10">
                <img class="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/mylene.jpeg" alt="Mylène" />
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Mylène Dupuy Rosso</h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">Zone Sud-Ouest</span>
                <p class=" mt-4 text-gray-800 dark:text-white">38 gratitudes reçues</p>
                <p class=" mt-2 text-gray-800 dark:text-white">92 tickets restants</p>
              </div>
            </div>

            {/* Dernières activités */}
            <div class="w-full mb-4 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Derniers tickets reçus</h5>
                {/* <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                  View all
                </a> */}
              </div>
              <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                  <li class="py-3 sm:py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Neil image" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          collaborateur 1
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          collaborateur1@acadomia.fr
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        6
                      </div>
                    </div>
                  </li>
                  <li class="py-3 sm:py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Bonnie image" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          collaborateur 2
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          collaborateur2@acadomia.fr
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        5
                      </div>
                    </div>
                  </li>
                  <li class="py-3 sm:py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Michael image" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          Collaborateur 3
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          collaborateur3@acadomia.fr
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        11
                      </div>
                    </div>
                  </li>
                  <li class="py-3 sm:py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Lana image" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          collaborateur 4
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          collaborateur4@acadomia.fr
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        9
                      </div>
                    </div>
                  </li>
                  <li class="pt-3 pb-0 sm:pt-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Thomas image" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                          collaborateur 5
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                          collaborateur5@acadomia.fr
                        </p>
                      </div>
                      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
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
            <div className="bg-white p-4 shadow rounded order-1">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-xl">Envoi de gratitude👇</label>
              <input type="search" value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true)
              }}
                aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="collaborateur@acadomia.fr" />
              {searchTerm && suggestions.length > 0 && showDropdown && (
                <div className="absolute mt-2 rounded border border-gray-300 bg-white z-10">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => {
                      setSearchTerm(suggestion);
                      setShowDropdown(false); // si vous utilisez un état pour gérer l'affichage du dropdown
                    }} className="p-2 hover:bg-gray-200 cursor-pointer">
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              {/* tickets counter input*/}
              <div className="flex mt-2">
                <button
                  className="bg-gray-200 p-2 rounded-l-md hover:bg-gray-300"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  // type="number"
                  placeholder="nombre tickets"
                  className="bg-white rounded border p-2 w-36 text-center"
                  onChange={e => setNumberOfTickets(e.target.value)}
                  value={count === 0 ? "" : count}
                />
                <button
                  className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>

              {/* textarea commentaire de gratitude */}
              <div className="border-b pb-4 mb-4 mt-2">
                <textarea
                  rows="4"
                  className="w-full p-2 rounded border"
                  placeholder="Message de gratitude...">
                </textarea>
                <button className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
                  Envoyer 💌
                </button>
              </div>

              {/* Feed/Posts */}
              <div>
                {/* Single Post */}
              </div>
            </div>

            {/* gratitude heroes*/}
            <div className="border-t p-2 border-b pb-4 mt-4">
              <p className="font-bold text-lg">Gratitude Heroes</p>
            </div>

            {/*TOP 3*/}
            <div className="w-full md:flex">
              <div className="md:w-1/3 ">
                <div class="flex flex-col mt-10 items-center pb-10">
                  <img class="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/mylene.jpeg" alt="Mylène" />
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Mylène Dupuy Rosso</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                  <p class=" mt-4 text-gray-800 dark:text-white">38 gratitudes reçues</p>
                </div>
              </div>
              <div className="md:w-1/3">
                <div class="flex flex-col mt-10 items-center pb-10">
                  <img class="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/moi2.jpg" alt="Antoine" />
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Antoine Parat</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Zone Sud-Ouest</span>
                  <p class=" mt-4 text-gray-800 dark:text-white">29 gratitudes reçues</p>
                </div>
              </div>
              <div className="md:w-1/3">
                <div class="flex flex-col mt-10 items-center pb-10">
                  <img class="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg" alt="Bonnie image" />
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Collaborateur 5</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Zone Nord</span>
                  <p class=" mt-4 text-gray-800 dark:text-white">21 gratitudes reçues</p>
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
