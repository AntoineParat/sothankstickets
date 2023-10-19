"use client"; // you should add "use client" at the top to tell Next.js to send the JavaScript needed htmlFor that component, making it a Client Component:

import { useState, useEffect } from "react";

import CommentBox from '../../../components/username-comments';
import Navbar from '../../../components/navbar';

export default function App({params}) {

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
              <div className="flex flex-col mt-10 items-center pb-10">
                <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src={params.username === 'Antoine' ? '/moi2.jpg' : "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"} alt="Antoine" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{decodeURIComponent(params.username)}</h5>
                <span className="text-sm text-gray-500 ">Zone xxxxx</span>
                <p className=" mt-4 text-gray-800 ">{Math.floor(Math.random() * 10) + 1} gratitudes reçues</p>
                <p className=" mt-2 text-gray-800 ">{Math.floor(Math.random() * 10) + 1} tickets restants</p>
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
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
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
            <div className="bg-white p-4 shadow rounded order-1">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900  text-xl">Donner des tickets de gratitude à {decodeURIComponent(params.username)}👇</label>
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

            {/*feeds news*/}
            <div className="border-t p-2 border-b pb-4 mt-4">
              <p className="font-bold text-lg">Activités récentes de {decodeURIComponent(params.username)} 📡</p>
            </div>
            <CommentBox username={decodeURIComponent(params.username)} />
          </div>
        </div>
      </div>
    </div>
  );
};
