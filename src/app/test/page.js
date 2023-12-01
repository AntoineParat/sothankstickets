"use client"

import { useEffect } from "react";

export default function HomePage() {
    const showNotification = () => {
        // Vérifier si le navigateur supporte les notifications
        if (!("Notification" in window)) {
            alert("Ce navigateur ne supporte pas les notifications de bureau");
        }
        // Demander la permission
        else if (Notification.permission === "granted") {
            // Si la permission est déjà accordée
            new Notification("Notification", { body: "Vous avez reçu un nouveau ticket!" });
        }
        else if (Notification.permission !== "denied") {
            // Demander la permission
            Notification.requestPermission().then(permission => {
                // Si la permission est accordée
                if (permission === "granted") {
                    new Notification("Notification", { body: "Vous avez reçu un nouveau ticket!" });
                }
            });
        }
    };

    const pushNotification = () => {
        Notification.requestPermission().then(function (result) {
            console.log(result);
            const text =
                'coucou';
            new Notification("Liste de trucs à faire", {
                body: text,
            });
        });
    }



    return (
        <div>
            <button onClick={showNotification}>Vérifier les tickets</button>
            <button onClick={pushNotification}>notification</button>
        </div>
    );
}
