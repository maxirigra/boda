"use client"; // Directiva necesaria para que el código interactivo funcione

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Define la estructura de un objeto de regalo para mayor claridad
interface Gift {
  ID: string;
  NombreRegalo: string;
  Precio: number;
  Link: string;
  Estado: string;
}

export default function WeddingPage() {
  // Estados para manejar los datos del componente
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [nombre, setNombre] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL de tu API de Google Apps Script
  const API_URL = "https://script.google.com/macros/s/AKfycbxIZvHnBOkgTVivDfnMrlSAui5SmOKrNBhhj1qgLxsFeO-2___TmpZwJKyKwx3MCM6uMA/exec";

  // useEffect se ejecuta una vez cuando la página carga para obtener los regalos
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch(`${API_URL}?action=getGifts`);
        const data: Gift[] = await response.json();
        setGifts(data);
      } catch (error) {
        console.error('Error al cargar los regalos:', error);
      }
    };
    fetchGifts();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Función para manejar el envío del formulario de confirmación
  const handleRsvpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('Enviando...');

    const formData = {
        action: "submitRSVP",
        nombre,
        confirmacion
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            setMessage('¡Gracias por confirmar!');
            setNombre('');
            setConfirmacion('');
        } else {
            throw new Error(result.message || 'Error desconocido');
        }

    } catch (error) {
        console.error('Error al enviar la confirmación:', error);
        setMessage('¡Gracias por confirmar!');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main>
      <header>
        <h1>¡Nos Casamos!</h1>
        <p>yyyy & xxxx
        </p>
        <p>25 de Octubre, 2025</p>
      </header>

      {/* Aquí usamos la foto que subiste a la carpeta /public */}
      <div className="photo-container">
        <Image 
          src="/foto-novios.jpg" 
          alt="Foto de los novios" 
          width={800} 
          height={500} 
          style={{ objectFit: 'cover', width: '100%', height: 'auto' }} 
        />
      </div>

      <section id="rsvp">
        <h2>Confirma tu Asistencia</h2>
        <form onSubmit={handleRsvpSubmit}>
          <input 
            type="text" 
            placeholder="Tu nombre completo" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required 
          />
          <select 
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          >
            <option value="" disabled>¿Nos acompañarás?</option>
            <option value="Sí Asistiré">¡Sí, allí estaré!</option>
            <option value="No Asistiré">No podré asistir</option>
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Confirmación'}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </section>

      <section id="regalos">
        <h2>Lista de Regalos</h2>
        <p>Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, puedes hacerlo a través de un depósito o eligiendo algo de esta lista.</p>
        
        <h3>Opción 1: Regalo Monetario</h3>
        <div className="bank-info">
          <p><strong>Banco:</strong> Tu Banco</p>
          <p><strong>Tipo de Cuenta:</strong> Cuenta Corriente</p>
          <p><strong>Número:</strong> 1234567890</p>
          <p><strong>A nombre de:</strong> Carolina Aguilar Aldunate</p>
        </div>

        <h3>Opción 2: Elige un Regalo de la Lista</h3>
        <div className="gift-list-container">
          {gifts.length > 0 ? (
            gifts.map(gift => (
              <div key={gift.ID} className="gift-card">
                <h4>{gift.NombreRegalo}</h4>
                <p>Precio: ${Number(gift.Precio).toLocaleString('es-CL')}</p>
                {gift.Link && <a href={gift.Link} target="_blank" rel="noopener noreferrer">Ver producto</a>}
              </div>
            ))
          ) : (
            <p>Cargando regalos...</p>
          )}
        </div>
      </section>
    </main>
  );
}
