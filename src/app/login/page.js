"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

import { auth, db, functions  } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';


export default function Home() {
  const router = useRouter()

  // email sign in logic
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zone, setZone] = useState('Sud Ouest');
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [showAlert, setShowAlert] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Envoi email de vérification adresse

  /* const sendVerificationRequest = async (user) => {
     
     // Obtenir le token d'authentification de l'utilisateur
     const token = await user.getIdToken();
 
     try {
       const response = await fetch('https://europe-west3-sothankstickets.cloudfunctions.net/generateVerificationToken', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}` // Ajoutez le token ici
         },
         body: JSON.stringify({
           user_id: user.uid,
           user_email: user.email
         }),
       });
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       console.log(response.text())
       setEmail(''); 
       setPassword('')
 
       alert(`Un email de vérification valable 10 minutes a été envoyé à l'adresse ${user.email}`);
 
       // You might want to do something with the verification link here,
       // such as showing it to the user or redirecting them to it.
     } catch (error) {
       alert("Erreur vérification email. Contactez antoine.parat@acadomia.fr")
       console.error('Failed to send verification request:', error);
     }
   }; */

  // <----------- SIGN IN -------------->

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
      setIsLoading(true)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password); //signUp
        /*const user = userCredential.user;
        // vérification que l'adresse email a bien été vérifiée
        if (!user.emailVerified) {
          await sendVerificationRequest(user)
          return setIsLoading(false);
        }*/
        setIsLoading(false);
        router.push('/user')
      } catch (error) {
        setIsPasswordError(true)
        console.error(error.code, error.message); // auth/invalid-login-credential ou email inexistant
      }
      setIsLoading(false);
    }

    firebaseLogin(formData)
  };

  // <------------- SIGN UP ------------->

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
      zone,
    };

    firebaseSignUp(formData)

    async function firebaseSignUp(formData) {
      setIsLoading(true)

      function extractNameFromEmail(email) {
        const [name, domain] = email.split('@');
        if (domain) {
          const [firstName, lastName] = name.split('.');
          return { firstName, lastName };
        }
        return { firstName: '', lastName: '' };
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password); //signUp
        const user = userCredential.user;

        // Récupération du prénom et du nom à partir de l'adresse email
        const { firstName, lastName } = extractNameFromEmail(formData.email);

        // Mise à jour des champs displayName et photoURL
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/sothankstickets.appspot.com/o/userProfileImages%2Fuser.jpg?alt=media'
        });

        // 1. Référence au document utilisateur principal
        const userRef = doc(db, 'utilisateurs', user.uid);

        //2.création de la date
        const currentDate = new Date();
        const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        //3. Ajout des informations dans Firestore
        await setDoc(userRef, {
          email: formData.email,
          name: `${firstName} ${lastName}`,
          zone: formData.zone,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/sothankstickets.appspot.com/o/userProfileImages%2Fuser.jpg?alt=media'
        });

        // 4. Définir les données pour le document "gratitudeData"
        const gratitudeDataRef = doc(userRef, currentMonth, 'gratitudeData');

        await setDoc(gratitudeDataRef, {
          gratitudes: 0,
          ticket_zone: 50,
          ticket_horszone: 50
        });

        // 5. Ajouter l'adresse email dans kvWorker
        const formDataEmail = new FormData();
        formDataEmail.append('email', email);

        const response = await fetch('https://suggestion.algosearch.workers.dev/record?token=jRCsWu8aVyIwWhNLEs1x', {
          method: 'POST',
          body: formDataEmail
        });

        if (!response.ok) {
          console.log('problème enregistrement email worker');
        }

        // await sendVerificationRequest(user)

        // Créer une référence à la fonction cloud
        // const sendWelcomeEmail = httpsCallable(functions, 'sendWelcomeEmail');
        // const result = await sendWelcomeEmail({'user_email' : email}); 
        // console.log(result.data);

        setIsLoading(false);
        router.push('/user')
      } catch (error) {
        alert("Une erreur est survenue, merci de contacter antoine.parat@acadomia.fr")
        console.error(error.code, error.message); // auth/invalid-login-credential ou email inexistant
      }
      setIsLoading(false);
    }
  };

  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@acadomia\.fr$/;
    // const regex = /^[\w.-]+@gmail\.com$/;
    return regex.test(email);
  }

  function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+).{8,}$/;
    return regex.test(password);
  }

  async function handleSendNewEmail() {
    try {
      setIsLoading(true)
      setIsModalVisible(false);
      // Envoi de l'email de vérification
      await sendVerificationRequest();
      setIsLoading(false)
    } catch (error) {
      // Gestion des erreurs ici
      console.error('An error occurred while sending the verification email:', error);
    }
  }


  // sign in / signup
  const [showSignUp, setShowSignUp] = useState(false);

  const showSignUpForm = (bool) => {
    setShowSignUp(bool);
  };

  return (
    <div className="min-h-screen bg-slate-100 relative md:flex items-center justify-center">
      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-60 flex justify-center items-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>
        </div>
      )}
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
      {/* Modal email non vérifié */}
      {isModalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          <div className="bg-red-100 p-8 shadow-xl rounded-lg z-10">
            <p className="text-red-800 mb-4">Votre adresse email n'est pas vérifiée.</p>
            <button onClick={() => handleSendNewEmail()} className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded focus:outline-none">
              Envoyer un email de vérification</button>
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
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Mot de passe</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              {isPasswordError && <p className='text-red-500 text-sm block mt-2 text-sm block mt-2'>Mauvaise combinaison email / mot de passe</p>}
              <Link href="/enter-mail" className="text-sm text-gray-400 hover:text-gray-500">Mot de passe oublié ?</Link>
            </div>
            <div className="flex justify-between items-center">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Se connecter</button>
              <button type="submit" onClick={() => { showSignUpForm(true); setEmail(''); setPassword('') }} className="text-sm text-blue-600 hover:underline">Inscription</button>
            </div>
          </form>
        ) : (
          // signup form
          <form onSubmit={handleSignUp} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg mt-12">
            {/* ... Votre formulaire d'inscription ici ... */}
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Adresse email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              <p className={`${isPasswordError ? 'text-red-500 text-sm block mt-2' : 'text-sm block mt-2'}`}>Le mot de passe doit contenir au moins 8 caractères, dont au moins un chiffre et un caractère spécial.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="zone" className="block mb-2 text-sm font-medium text-gray-900">Zone</label>
              <select onChange={(e) => setZone(e.target.value)} id="zone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                <option value="sud_ouest">Sud Ouest</option>
                <option value="Rue de la Baume">Rue de la Baume</option>
                <option value="nord">Nord</option>
                <option value="est">Est</option>
                <option value="sud_est">Sud-Est</option>
                <option value="A Live">A Live</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">S'inscrire</button>
              <button type="button" onClick={() => { showSignUpForm(false); setEmail(''); setPassword('') }} className="text-sm text-blue-600 hover:underline">Connection</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
