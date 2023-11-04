"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';


export default function VerificationEmail() {
    const router = useRouter();

    const searchParams = useSearchParams()
    const user_id = searchParams.get('user')
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(true)



    useEffect(() => {
        // Définir une fonction asynchrone pour appeler l'API
        if (!user_id && !token) {
            alert('vérification impossible')
            return router.replace('/login')
        }
        const verifyToken = async () => {
            try {
                const response = await fetch('https://europe-west3-sothankstickets.cloudfunctions.net/verifyEmailToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, user_id }),
                });

                if (!response.ok) {
                    // Si la réponse n'est pas ok, lire le texte de la réponse et le lancer comme une erreur
                    const errorText = await response.text();
                    throw new Error(errorText || 'Something went wrong');
                }

                const data = await response.text();
                // Gérer la réponse, par exemple informer l'utilisateur que la vérification est réussie
                console.log(data);
                router.push('/user')
            } catch (error) {
                // Gérer l'erreur, par exemple informer l'utilisateur que la vérification a échoué
                alert(`Echec vérification email, ${error}`);
                router.replace('/login')
            }
        };
        // Appeler la fonction verifyToken si token et user_id sont présents
        if (token && user_id) {
            verifyToken();
        }
    }, [])


    return (
        <div className="flex justify-center items-center h-screen">
            {isLoading && <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-400"></div>}
        </div>
    )
}