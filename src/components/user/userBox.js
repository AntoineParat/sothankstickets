import { useState } from 'react';

import { auth } from '../../firebase';  // Votre configuration firebase


function UserBox() {

    const user = auth.currentUser;
    console.log(user.email, user.uid)

    const [showModal, setShowModal] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function (event) {
                // Vous pouvez définir l'URL de l'image ici et l'envoyer au serveur ou à Firebase Storage.
                console.log(event.target.result);
                setShowModal(false)
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleImageClick = () => {
        setShowModal(true);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Mylène Dupuy Rosso');

    function handleNameChange() {
        console.log(name)
        setIsEditing(false)
    }

    const [isEditingZone, setIsEditingZone] = useState(false);
    const [zone, setZone] = useState("Zone Sud-Ouest");

    const zones = [
        "Zone Nord",
        "Zone Sud-Ouest",
        "Zone Sud-Est",
        "Zone Ouest",
        // ... ajoutez d'autres zones si nécessaire
    ];

    function handleSetZone(e) {
        setZone(e.target.value)
    }

    return (
        <div className="flex flex-col mt-10 items-center pb-10">
            {/* user photo */}
            <div className="relative group cursor-pointer">
                <img className="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/mylene.jpeg" alt="Mylène" />
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
            {isEditingZone ? (
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
            )}

            <p className="mt-4 text-gray-800">38 gratitudes reçues</p>
            <p className="mt-2 text-gray-800">92 tickets restants</p>
        </div>
    );
}

export default UserBox;
