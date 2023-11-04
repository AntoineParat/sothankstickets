"use client"

import React, { useState, useEffect } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    // Fonction pour envoyer l'email
    const sendEmail = async () => {
      if (email) {
        const formData = new FormData();
        formData.append('email', email);

        try {
          const response = await fetch('https://suggestion.algosearch.workers.dev/record?token=jRCsWu8aVyIwWhNLEs1x', {
            method: 'POST',
            body: formData
          });
          const data = await response.text();
          setResponseMessage(data);
        } catch (error) {
          console.error('Erreur:', error);
          setResponseMessage('Une erreur est survenue lors de l\'envoi de l\'email.');
        }
      }
    };

    sendEmail();
  }, [email]); // Déclencher l'effet lors du changement de l'email

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmail(event.target.email.value);
  };

  // send email on signup 
  const [verificationLink, setVerificationLink] = useState('');

  const sendVerificationRequest = async () => {
    try {
      const response = await fetch('https://europe-west3-sothankstickets.cloudfunctions.net/generateVerificationToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: 'BsGwyKG9RUX6ZGc7DUe4fcMOnMP2' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const verificationLink = await response.text();
      setVerificationLink(verificationLink);

      // You might want to do something with the verification link here,
      // such as showing it to the user or redirecting them to it.
    } catch (error) {
      console.error('Failed to send verification request:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Entrez votre e-mail"
          required
        />
        <button type="submit">Envoyer</button>
      </form>

      {responseMessage && <div>{responseMessage}</div>}

      {verificationLink && (
        <p>Verification link: <a href={verificationLink} target="_blank" rel="noopener noreferrer">{verificationLink}</a></p>
      )}

      {/* Trigger the fetch call */}
      <button onClick={sendVerificationRequest}>Send Verification Email</button>
    </div>
  );
}

export default EmailForm;
