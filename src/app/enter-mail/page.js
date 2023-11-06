"use client"

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

import { auth } from '../../firebase';
import { sendPasswordResetEmail } from "firebase/auth";


export default function ResetMail() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!isValidEmail(email)) {
            return alert("email non valide");
          }
        // Envoi email de réinitialisation
        try {
            await sendPasswordResetEmail(auth, email)
            setIsLoading(false)
            setShowAlert(true)
        } catch (error) {
            setIsLoading(false)
            alert('Une erreur est survenue, contactez antoine.parat@acadomia.fr')
            router.replace('/login')
        }
    }

    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@acadomia\.fr$/;
        // const regex = /^[\w.-]+@gmail\.com$/;
        return regex.test(email);
      }

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
                    <div className="bg-green-100 p-8 shadow-xl rounded-lg z-10">
                        <p className="mb-4">✅ Mail de réinitialisation envoyé à {email} </p>
                        <button onClick={() => setShowAlert(false)} className="text-white bg-blue-600 px-4 py-2 rounded focus:outline-none">
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
                <form onSubmit={handleSubmit} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg">
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Adresse email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="collaborateur@acadomia.fr" required />
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Se connecter</button>
                        <Link href='/login' className="text-sm text-blue-600">Connection</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}