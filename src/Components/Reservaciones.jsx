import { useEffect, useState } from 'react';
import '../Styles/HeroSection.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Container from './Container';

const mesasDisponibles = [
   { id: 1, nombre: 'Mesa 1' },
   { id: 2, nombre: 'Mesa 2' },
   { id: 3, nombre: 'Mesa 3' },
   { id: 4, nombre: 'Mesa 4' },
   { id: 5, nombre: 'Mesa 5' },
   { id: 6, nombre: 'Mesa 6' },
   { id: 7, nombre: 'Mesa 7' },
   { id: 8, nombre: 'Mesa 8' }
];

const horasDisponibles = [
   '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
   '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
   '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const Reservaciones = () => {
   const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
   const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
   const [horaSeleccionada, setHoraSeleccionada] = useState('');
   const [numero, setNumero] = useState('');
   const [mostrarPaso, setMostrarPaso] = useState('mesas');
   const [userName, setUserName] = useState('');
   const [plato, setPlato] = useState(null);

   const [estadoMesas, setEstadoMesas] = useState({
      mesa1: 'disponible',
      mesa2: 'disponible',
      mesa3: 'disponible',
      mesa4: 'disponible',
      mesa5: 'disponible',
      mesa6: 'disponible',
      mesa7: 'disponible',
      mesa8: 'disponible'
   });

   useEffect(() => {
      const userStr = localStorage.getItem('user');
      const platoStr = localStorage.getItem('platoReservado');

      console.log('Usuario:', userStr); // ✅
      console.log('Plato:', platoStr);  // ✅

      if (userStr) {
         const user = JSON.parse(userStr);
         if (user.name) setUserName(user.name.split('@')[0]);
      }

      if (platoStr) {
         const platoObj = JSON.parse(platoStr);
         if (platoObj.name) setPlato(platoObj);
      }
   }, []);

   const confirmarReserva = () => {
      if (!numero.trim()) return alert('Ingresa tu número.');

       // Guardar reserva en localStorage
   const nuevaReserva = {
      cliente: userName,
      plato: plato?.name || '',
      mesa: mesaSeleccionada?.nombre,
      fecha: fechaSeleccionada?.toISOString().split('T')[0], // YYYY-MM-DD
      hora: horaSeleccionada,
      numero
   };

   const reservasActuales = JSON.parse(localStorage.getItem('reservasHechas')) || [];
   reservasActuales.push(nuevaReserva);
   localStorage.setItem('reservasHechas', JSON.stringify(reservasActuales));

      alert('✅ Reservación confirmada.');
      setMostrarPaso('mesas');
      setNumero('');
      setMesaSeleccionada(null);
      setHoraSeleccionada('');
      setFechaSeleccionada(null);

      // Cambiar el estado de la mesa seleccionada a 'reservada'
      if (mesaSeleccionada) {
         const nuevaMesaEstado = { ...estadoMesas, [`mesa${mesaSeleccionada.id}`]: 'reservada' };
         setEstadoMesas(nuevaMesaEstado); // Actualiza el estado de las mesas
      }
   };

   const botones = (volverPaso, continuarPaso, puedeContinuar = true) => (
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
         <button onClick={() => setMostrarPaso(volverPaso)}>Atrás</button>
         <button onClick={() => puedeContinuar && setMostrarPaso(continuarPaso)}>Continuar</button>
      </div>
   );

   return (
     <section className="reservation-section" style={{ paddingBottom: '120px' }}>
         <Container>
            <h2 className="menu-title">Reserva tu mesa</h2>
            <p className="section-text">Selecciona una mesa disponible para continuar con tu reservación.</p>

            {mostrarPaso === 'mesas' && (
               <ul className="mesa-list">
                  {mesasDisponibles.map(mesa => (
                     <li
                        key={mesa.id}
                        onClick={() => {
                           setMesaSeleccionada(mesa);
                           setMostrarPaso('fecha');
                        }}
                        style={{
                           cursor: estadoMesas[`mesa${mesa.id}`] === 'disponible' ? 'pointer' : 'not-allowed',
                           opacity: estadoMesas[`mesa${mesa.id}`] === 'disponible' ? 1 : 0.5,
                        }}
                     >
                        <h3>
                           {/* Mesa 1 2 ... */}
                           {mesa.nombre}</h3> 

                        <p
                           style={{
                              color: estadoMesas[`mesa${mesa.id}`] === 'disponible' ? '#22c55e' : '#ef4444',
                              fontWeight: 'bold',
                           }}
                           >
                              {/* disponible / reservado */}
                           {estadoMesas[`mesa${mesa.id}`] === 'disponible' ? `Disponible ` : 'Reservado'} 
                        </p>
                     </li>
                  ))}
               </ul>
            )}

            {mostrarPaso === 'fecha' && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3>Selecciona una fecha</h3>
                     <DatePicker
                        selected={fechaSeleccionada}
                        onChange={(fecha) => setFechaSeleccionada(fecha)}
                        minDate={new Date()}
                        inline
                     />
                     {botones('mesas', 'hora', !!fechaSeleccionada)}
                  </div>
               </div>
            )}

            {mostrarPaso === 'hora' && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3>Selecciona una hora</h3>
                     <select onChange={(e) => setHoraSeleccionada(e.target.value)} defaultValue="">
                        <option disabled value="">Seleccionar hora</option>
                        {horasDisponibles.map(hora => (
                           <option key={hora} value={hora}>{hora}</option>
                        ))}
                     </select>
                     {botones('fecha', 'numero', !!horaSeleccionada)}
                  </div>
               </div>
            )}

            {mostrarPaso === 'numero' && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3>Ingresa tu número de celular</h3>
                     <input
                        type="tel"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Número de celular"
                        required
                     />
                     {botones('hora', 'confirmar', !!numero.trim())}
                  </div>
               </div>
            )}

            {mostrarPaso === 'confirmar' && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3>Resumen de Reservación</h3>
                     <p><strong>Nombre:</strong> {userName}</p>
                     <p><strong>Plato:</strong> {plato?.name || 'No seleccionado'}</p>
                     <p><strong>Mesa:</strong> {mesaSeleccionada?.nombre}</p>
                     <p><strong>Fecha:</strong> {fechaSeleccionada?.toLocaleDateString()}</p>
                     <p><strong>Hora:</strong> {horaSeleccionada}</p>
                     <p><strong>Número:</strong> {numero}</p>
                     <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button onClick={() => setMostrarPaso('numero')}>Volver</button>
                        <button onClick={confirmarReserva}>Confirmar</button>
                     </div>
                  </div>
               </div>
            )}
         </Container>
      </section>
   );
};

export default Reservaciones;
