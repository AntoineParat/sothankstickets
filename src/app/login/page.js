"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


export default function Home() {
  const router = useRouter()

  // email sign in logic
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zone, setZone] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [showAlert, setShowAlert] = useState(false);


  function checkEmail(event) {
    event.preventDefault();
    if (email === "mylene.d-rosso@acadomia.fr" && password === "adminpassword") { //mylene.d-rosso@acadomia.fr
      router.push("/user")
    }
    return;
  }

  const handleSignIn = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    if (!isValidEmail(email)) {
      return setShowAlert(true);
    }

    const formData = {
      email,
      password,
      zone
    };

    async function firebaseLogin(formData) {
      try {
        // const userCredential = await signInWithEmailAndPassword(auth,formData.email, formData.password); //login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password); //signUp
        const user = userCredential.user;
        console.log(user);
        router.push('/user')
      } catch (error) {
        setIsPasswordError(true)
        console.error(error.code, error.message); // auth/invalid-login-credential ou email inexistant
      }
    }

    firebaseLogin(formData)
  };

  const handleSignUp = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    if (!isValidEmail(email)) {
      return setShowAlert(true);
    }

    if (!isValidPassword(password)) {
      setIsPasswordError(true)
      return setPassword('')
    }

    const formData = {
      email,
      password,
      zone
    };

    firebaseSignUp(formData)

    async function firebaseSignUp(formData) {
      try {
        // const userCredential = await signInWithEmailAndPassword(auth,formData.email, formData.password); //login
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password); //signUp
        const user = userCredential.user;
        console.log(user);
        router.push('/user')
      } catch (error) {
        console.error(error.code, error.message); // auth/invalid-login-credential ou email inexistant
      }
    }

    firebaseSignUp(formData)

  };

  function isValidEmail(email) {
    // const regex = /^[a-zA-Z0-9._-]+@acadomia.com\.fr$/;
    const regex = /^[\w.-]+@gmail\.com$/;
    return regex.test(email);
  }

  function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+).{8,}$/;
    return regex.test(password);
  }




  // sign in / signup
  const [showSignUp, setShowSignUp] = useState(false);

  const showSignUpForm = (bool) => {
    setShowSignUp(bool);
  };

  return (
    <div className="min-h-screen bg-slate-100 relative md:flex items-center justify-center">
      {/* Pop up alerte mail */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          <div className="bg-red-100 p-8 shadow-xl rounded-lg z-10">
            <p className="text-red-800 mb-4">Vous devez utiliser votre adresse Acadomia.</p>
            <button onClick={() => setShowAlert(false)} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded focus:outline-none">
              OK</button>
          </div>
        </div>
      )}
      {/* logo */}
      <div className="md:absolute top-4 flex items-center">
        <img src="thumbnail_image001-removebg-preview.png" alt="Logo 1" className="w-52 h-52 mr-2" /> {/* ajustez h-12 selon la taille souhaitée */}
        <span className="text-3xl antialiased font-semibold" style={{ color: '#C29E5B' }}>So'Thanks Tickets</span>
      </div>
      <img src="acad.png" alt="Logo 2" className="absolute top-4 right-4 h-12 w-auto" /> {/* ajustez h-12 selon la taille souhaitée */}
      {/* login form */}
      <div className="flex-grow flex items-center justify-center">
        {!showSignUp ? (
          <form onSubmit={handleSignIn} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg">
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Adresse email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Mot de passe</label>
              <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              { isPasswordError && <p className='text-red-500 text-sm block mt-2 text-sm block mt-2'>Mauvaise combinaison email / mot de passe</p>}
            </div>
            <div className="flex justify-between items-center">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Se connecter</button>
              <button type="submit" onClick={() => showSignUpForm(true)} className="text-sm text-blue-600 hover:underline">Inscription</button>
            </div>
          </form>
        ) : (
          // signup form
          <form onSubmit={handleSignUp} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg mt-12">
            {/* ... Votre formulaire d'inscription ici ... */}
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Adresse email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
              <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              <p className={`${isPasswordError ? 'text-red-500 text-sm block mt-2' : 'text-sm block mt-2'}`}>Le mot de passe doit contenir au moins 8 caractères, dont au moins un chiffre et un caractère spécial.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="zone" className="block mb-2 text-sm font-medium text-gray-900">Zone</label>
              <select onChange={(e) => setZone(e.target.value)} id="zone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                <option value="sud_ouest">Sud Ouest</option>
                <option value="nord">Nord</option>
                <option value="est">Est</option>
                <option value="sud_est">Sud Est</option>
                <option value="siege">Siège</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">S'inscrire</button>
              <button type="button" onClick={() => showSignUpForm(false)} className="text-sm text-blue-600 hover:underline">Connection</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}