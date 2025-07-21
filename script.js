// Pega aquí la URL de tu aplicación web de Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwOz0Lw3NNuULujRtINt261svbc_HSoIUZ6FPNrDyQGAU_ZsW8yPQM_YjGxZcG6cVV_/exec";

document.addEventListener('DOMContentLoaded', () => {
    fetchGifts();
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', handleRsvpSubmit);
});

function fetchGifts() {
    const giftContainer = document.getElementById('gift-list-container');
    fetch(`${API_URL}?action=getGifts`)
        .then(response => response.json())
        .then(gifts => {
            giftContainer.innerHTML = '';
            if (!gifts || gifts.length === 0) {
                giftContainer.innerHTML = '<p>¡Todos los regalos han sido elegidos! Gracias.</p>';
                return;
            }
            gifts.forEach(gift => {
                const card = document.createElement('div');
                card.className = 'gift-card';
                const formattedPrice = gift.Precio ? `$${Number(gift.Precio).toLocaleString('es-CL')}` : 'Consultar';
                card.innerHTML = `
                    <h4>${gift.NombreRegalo}</h4>
                    <p>Precio: ${formattedPrice}</p>
                    ${gift.Link ? `<a href="${gift.Link}" target="_blank">Ver producto</a>` : ''}
                `;
                giftContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al cargar los regalos:', error);
            giftContainer.innerHTML = '<p>No se pudo cargar la lista de regalos. Intenta de nuevo más tarde.</p>';
        });
}

function handleRsvpSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const messageEl = document.getElementById('form-message');
    const submitButton = form.querySelector('button');
    const formData = {
        action: "submitRSVP",
        nombre: document.getElementById('nombre').value,
        confirmacion: document.getElementById('confirmacion').value
    };
    
    submitButton.disabled = true;
    messageEl.textContent = 'Enviando...';
    messageEl.style.color = '#333';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
    })
    .then(response => response.json())
    .then(res => {
        if (res.status === 'success') {
            messageEl.textContent = '¡Gracias por confirmar!';
            messageEl.style.color = 'green';
            form.reset();
        } else {
            throw new Error(res.message || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error al enviar la confirmación:', error);
        messageEl.textContent = 'Hubo un error. Por favor, inténtalo de nuevo.';
        messageEl.style.color = 'red';
    })
    .finally(() => {
        submitButton.disabled = false;
    });
}