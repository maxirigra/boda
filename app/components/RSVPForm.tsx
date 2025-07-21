'use client';

import { useState } from 'react';

export default function RSVPForm() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  // Nuevos estados para manejar el envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!nombre || !asistencia) {
      alert('Por favor, completa tu nombre y si asistes.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          asistencia,
          mensaje,
        }),
      });

      if (!response.ok) {
        // Si el servidor responde con un error (ej. 500)
        throw new Error('Falló la respuesta del servidor');
      }

      // Si todo sale bien
      setSubmissionStatus('success');
      setNombre('');
      setAsistencia('');
      setMensaje('');

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle = { /* ... tus estilos ... */ };
  const inputStyle = { /* ... tus estilos ... */ };
  const buttonStyle = { /* ... tus estilos ... */ };

  return (
    <div style={{...formStyle, background: '#f9f9f9', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '2rem auto', border: '1px solid #ddd'}}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Confirma tu Asistencia</h3>
      <form onSubmit={handleSubmit}>
        {/* ... (Las secciones de nombre, asistencia y mensaje no cambian) ... */}
        <div>
          <label htmlFor="nombre">Tu nombre completo:</label>
          <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{...inputStyle, width: '100%', padding: '0.75rem', margin: '0.5rem 0 1rem 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box'}}/>
        </div>
        <div>
          <label>¿Asistirás?</label>
          <div style={{ margin: '0.5rem 0 1rem 0' }}>
            <input type="radio" id="si" name="asistencia" value="Si" checked={asistencia === 'Si'} onChange={(e) => setAsistencia(e.target.value)} />
            <label htmlFor="si" style={{ marginRight: '1rem' }}> Sí, ¡allí estaré!</label>
            <input type="radio" id="no" name="asistencia" value="No" checked={asistencia === 'No'} onChange={(e) => setAsistencia(e.target.value)} />
            <label htmlFor="no"> No podré asistir</label>
          </div>
        </div>
        <div>
          <label htmlFor="mensaje">Déjanos un mensaje (opcional):</label>
          <textarea id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} style={{...inputStyle, width: '100%', padding: '0.75rem', margin: '0.5rem 0 1rem 0', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box'}}></textarea>
        </div>
        
        {/* El botón ahora es dinámico */}
        <button type="submit" disabled={isSubmitting} style={{...buttonStyle, width: '100%', padding: '1rem', border: 'none', borderRadius: '4px', background: isSubmitting ? '#999' : '#333', color: 'white', fontSize: '1rem', cursor: 'pointer'}}>
          {isSubmitting ? 'Enviando...' : 'Enviar Confirmación'}
        </button>

        {/* Mensajes de éxito o error */}
        {submissionStatus === 'success' && (
          <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>
            ¡Gracias por confirmar! Tu respuesta ha sido guardada.
          </p>
        )}
        {submissionStatus === 'error' && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
            Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.
          </p>
        )}
      </form>
    </div>
  );
}