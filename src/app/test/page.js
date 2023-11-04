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
    </div>
  );
}

export default EmailForm;
