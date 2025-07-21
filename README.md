import Image from 'next/image';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
      
      {/* Saludo y Nombres */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: '300' }}>
        ¡Nos Casamos!
      </h1>
      <h2 style={{ fontSize: '3.5rem', margin: '0' }}>
        Olivia & Mateo
      </h2>
      
      {/* Imagen de la Pareja */}
      <div style={{ margin: '2rem 0' }}>
        <Image
          src="/foto-novios.jpg" // Asegúrate de subir una foto con este nombre a la carpeta /public
          alt="Foto de los novios"
          width={500}
          height={350}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
          }}
        />|
      </div>

      {/* Información del Evento */}
      <div style={{ fontSize: '1.2rem' }}>
        <p>
          <strong>SÁBADO, 15 DE MARZO DE 2025</strong>
        </p>
        <p>
          Viña Santa Carolina, Santiago
        </p>
      </div>

    </main>
  );
}