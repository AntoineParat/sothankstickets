"use client"

import { useState } from "react";
import { useEffect, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";

import { auth } from '../../firebase';
import { confirmPasswordReset } from "firebase/auth";


export default function ResetMail() {
    //si pas de token -> redirect
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(() => {
        const oobCode = searchParams.get('oobCode');
        if (!oobCode) {
            alert('Réinitialisation impossible')
            return router.replace('/login')
        }
    }, [router, searchParams]);

    const [isLoading, setIsLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const oobCode = searchParams.get('oobCode');
        setIsLoading(true)
        if (!isValidPassword(password)) {
            setIsPasswordError(true)
            return setPassword('')
        }
        // Mise à jour password
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setIsLoading(false)
            setShowAlert(true)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            alert('Une erreur est survenue, contactez antoine.parat@acadomia.fr')
            router.replace('/login')
        }
    }

    function isValidPassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+).{8,}$/;
        return regex.test(password);
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
                        <p className="mb-4">✅ Votre mot de passe a été mis à jour</p>
                        <button onClick={() => router.replace('/login')} className="text-white bg-blue-600 px-4 py-2 rounded focus:outline-none">
                            Connection</button>
                    </div>
                </div>
            )}
            {/* logo */}
            <div className="md:absolute top-4 flex items-center">
                <img src="thumbnail_image001-removebg-preview.png" alt="Logo 1" className="w-52 h-52 mr-2" /> {/* ajustez h-12 selon la taille souhaitée */}
                <span className="text-3xl antialiased font-semibold" style={{ color: '#C29E5B' }}>So'Thanks Tickets</span>
            </div>
            <img src="acad.png" alt="Logo 2" className="absolute top-4 right-4 h-12 w-auto" /> {/* ajustez h-12 selon la taille souhaitée */}
            {/* new password form */}
            <div className="flex-grow flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full md:w-4/12 bg-white p-4 shadow-md rounded-lg">
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Nouveau mot de passe</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                        <p className={`${isPasswordError ? 'text-red-500 text-sm block mt-2' : 'text-sm block mt-2'}`}>Le mot de passe doit contenir au moins 8 caractères, dont au moins un chiffre et un caractère spécial.</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Enregistrer</button>
                        <Link href='/login' className="text-sm text-blue-600">Connection</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}