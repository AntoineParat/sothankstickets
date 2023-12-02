import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, storage, db } from '../../firebase';  // Votre configuration firebase
import { updateProfile } from "firebase/auth";

import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";



function UserBox() {
    const router = useRouter()

    const user = auth.currentUser;

    const [showModal, setShowModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(user ? user.photoURL : null)

    const [zone, setZone] = useState(null);


    const [gratitudes, setGratitudes] = useState(0);
    const [ticketZone, setTicketZone] = useState(0);
    const [ticketHorsZone, setTicketHorsZone] = useState(0);

    // récupérer la zone utilisateur
    useEffect(() => {
        if (user && user.uid) {
            const userDocRef = doc(db, 'utilisateurs', user.uid);

            getDoc(userDocRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    setZone(docSnapshot.data().zone || null);
                } else {
                    console.error('Document utilisateur non trouvé.');
                }
            }).catch((error) => {
                console.error('Erreur lors de la récupération de la zone de l\'utilisateur:', error);
            });
        }
    }, [user]);


    //mise à jour des tikcets restants 
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        // Assurez-vous que 'user' est défini et qu'il a une propriété 'uid'
        if (user && user.uid) {
            const gratitudeDocRef = doc(db, 'utilisateurs', user.uid, currentMonth, 'gratitudeData');

            const unsubscribe = onSnapshot(gratitudeDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();

                    setGratitudes(data.gratitudes || 0);
                    setTicketZone(data.ticket_zone || 0);
                    setTicketHorsZone(data.ticket_horszone || 0);
                } else {
                    console.error('Document "gratitudeData" non trouvé pour le mois en cours.');
                }
            });

            return () => unsubscribe();
        }
    }, [user]);  // dépendance sur 'user', donc l'écouteur se réinitialise si 'user' change


    //update de l'image de profil
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function (event) {
                // L'URL de données de l'image.
                const imageDataUrl = event.target.result;

                // Enregistrez l'image dans Firebase Storage.
                saveImageToFirebase(imageDataUrl);

                setShowModal(false);
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const saveImageToFirebase = (imageDataUrl) => {

        // Créez une référence pour l'emplacement où vous souhaitez stocker l'image.
        // Par exemple, "userProfileImages/" suivi de l'ID utilisateur pour garantir un nom de fichier unique.
        const userId = user.uid; // Remplacez ceci par l'ID de l'utilisateur réel.
        const imageRef = ref(storage, 'userProfileImages/' + userId);

        // Enregistrez l'image dans Firebase Storage.
        uploadString(imageRef, imageDataUrl, 'data_url')
            .then((snapshot) => {
                console.log("Image uploaded!");

                // Si vous souhaitez également obtenir l'URL de téléchargement public de l'image
                return getDownloadURL(snapshot.ref);
            })
            .then(async (downloadURL) => {
                // Mise à jour du photoURL dans Firebase Auth
                setPhotoUrl(downloadURL);
                await updateProfile(user, {
                    photoURL: downloadURL
                });

                // Mettre à jour le photoURL dans la collection "utilisateurs"
                const userRef = doc(db, "utilisateurs", user.uid);

                await updateDoc(userRef, {
                    photoURL: downloadURL
                });

                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error uploading image: ", error);
            });
    }

    const handleImageClick = () => {
        setShowModal(true);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user ? user.displayName : null);

    async function handleNameChange() {
        // if (!user) {
        //     console.error("Aucun utilisateur connecté");
        //     return;
        // } else {
        //     updateProfile(user, {
        //         displayName: name,
        //         // Vous pouvez également mettre à jour le `photoURL` ou d'autres propriétés si nécessaire
        //     })
        //         .then(() => {
        //             console.log("Nom d'utilisateur mis à jour avec succès");
        //         })
        //         .catch(error => {
        //             console.error("Erreur lors de la mise à jour du nom d'utilisateur :", error);
        //         });
        // }

        if (!user) {
            console.error("Aucun utilisateur connecté");
            return;
        }

        try {
            // Mise à jour du profil Firebase Auth
            await updateProfile(user, { displayName: name });

            // Mise à jour du nom d'utilisateur dans Firestore
            const userDocRef = doc(db, 'utilisateurs', user.uid);

            await updateDoc(userDocRef, { name: name });
            // !!! pour bien faire il faudrait actualiser le nom dans tous les tickets et dans le top 3


            console.log("Nom d'utilisateur mis à jour avec succès dans Firebase Auth et Firestore");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du nom d'utilisateur :", error);
        }
        setIsEditing(false)
    }

    // const [isEditingZone, setIsEditingZone] = useState(false);
    // const [zone, setZone] = useState("Zone Sud-Ouest");

    // const zones = [
    //     "Zone Nord",
    //     "Zone Sud-Ouest",
    //     "Zone Sud-Est",
    //     "Zone Ouest",
    //     // ... ajoutez d'autres zones si nécessaire
    // ];

    // function handleSetZone(e) {
    //     setZone(e.target.value)
    // }

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.replace('/login');
        } catch (error) {
            console.error("Erreur lors de la déconnexion: ", error);
        }
    };

    function CurrentMonthAndYear() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long' };
        let formattedDate = date.toLocaleDateString('fr-FR', options);

        return formattedDate
    }

    return (
        <div className="flex flex-col mt-10 items-center pb-10">
            {/* user photo */}
            <div className="relative group cursor-pointer">
                <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src={photoUrl} alt="profil" />
                <div
                    className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100"
                    onClick={handleImageClick}
                >
                    <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed z-50 inset-0 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white p-6 rounded-lg shadow-lg relative z-10">
                        <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-xl">✖️</button>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choisir une photo:
                            </label>
                            <input type="file" accept="image/*" capture onChange={handleImageChange} className='rounded' />
                        </div>
                    </div>
                </div>
            )}
            {/* user name */}
            <div className="relative group cursor-pointer inline-block">
                {isEditing ? (
                    <input
                        type="text"
                        value={name}
                        onClick={() => setIsEditing(true)}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleNameChange()}
                        className="text-xl font-medium text-gray-900 border rounded p-1"
                        autoFocus
                    />
                ) : (
                    <>
                        <div className="text-xl font-medium text-gray-900 mb-2" onClick={() => setIsEditing(true)}>
                            {name}
                        </div>
                    </>
                )}
            </div>
            {/* {isEditingZone ? (
                <select
                    value={zone}
                    onChange={(e) => handleSetZone(e)}
                    onBlur={() => setIsEditingZone(false)}
                    className="text-sm text-gray-500 border rounded p-1"
                    autoFocus
                >
                    {zones.map((z, idx) => (
                        <option key={idx} value={z}>
                            {z}
                        </option>
                    ))}
                </select>
            ) : (
                <span
                    className="text-sm text-gray-500 cursor-pointer"
                    onClick={() => setIsEditingZone(true)}
                >
                    {zone}
                </span>
            )} */}
            <p className="text-sm text-gray-500">Zone {zone}</p>

            <p className="mt-4 text-gray-800 underline decoration-4" style={{ textDecorationColor: '#fbbf24' }}>{CurrentMonthAndYear()}:</p>

            <p className="mt-4 text-gray-800">{gratitudes}  gratitudes reçues</p>
            <p className="mt-2 text-gray-800">{ticketZone} tickets zone restants</p>
            <p className="mt-2 text-gray-800">{ticketHorsZone} tickets hors zone restants</p>

            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
            >
                Déconnexion
            </button>
        </div>
    );
}

export default UserBox;
