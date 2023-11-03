import React from 'react';
import { useEffect, useState } from 'react';

const userModal = ({ email, isOpen, onClose, onInvite }) => {
    if (!isOpen) return null;

    const [name, setName] = useState('')

    useEffect(() => {
        // Divise l'e-mail en utilisant le caractère '@' comme séparateur
        const [localPart] = email.split('@');

        // Divise la partie locale en utilisant le caractère '.' comme séparateur et retourne le premier élément
        const [prenom] = localPart.split('.');

        setName(prenom)
    }, [])

    return (
        <>
            <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .shake {
          animation: shake 2s ease-in-out infinite;
        }
      `}</style>

            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
                <div className="bg-green-200 p-12 rounded-lg shadow-xl text-center z-10">
                    {/* Bouton de fermeture */}
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-500"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <p className="text-xl font-bold mb-6">{name} n'est pas inscrit</p>
                    <div className="relative mb-6">
                        {/* Gros bouton qui bouge un peu */}
                        <button
                            onClick={onInvite}
                            className="shake px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600 focus:outline-none focus:ring transition ease-in-out duration-300 animate-pulse"
                        >
                            Inviter par mail {name} à nous rejoindre 🚀
                        </button>
                    </div>
                    <button onClick={onClose} className="text-sm text-gray-700 underline">
                        Fermer
                    </button>
                </div>
            </div>
        </>
    );
};

export default userModal;
