import { useEffect, useState } from 'react';
import '../Styles/HeroSection.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Container from './Container';

const mesasDisponibles = Array.from({ length: 16 }, (_, i) => ({
   id: i + 1,
   nombre: `Mesa ${i + 1}`
}));


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
   const [comensales, setComensales] = useState('');
   const [mostrarPaso, setMostrarPaso] = useState('mesas');
   const [userName, setUserName] = useState('');
   const [plato, setPlato] = useState(null);
   const [toastVisible, setToastVisible] = useState(false);
   const [toastMensaje, setToastMensaje] = useState('');
   const [cantidadMesasVisibles, setCantidadMesasVisibles] = useState(8);
   const [reservasHechas, setReservasHechas] = useState([]);


   const [estadoMesas, setEstadoMesas] = useState(() => {
      const estadoInicial = {};
      mesasDisponibles.forEach(mesa => {
         estadoInicial[`mesa${mesa.id}`] = 'disponible';
      });
      return estadoInicial;
   });


   useEffect(() => {
      const userStr = localStorage.getItem('user');
      const platoStr = localStorage.getItem('platoReservado');
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservasHechas')) || [];

      if (userStr) {
         const user = JSON.parse(userStr);
         if (user.name) setUserName(user.name.split('@')[0]);
      }

      if (platoStr) {
         const platoObj = JSON.parse(platoStr);
         if (platoObj.name) setPlato(platoObj);
      }

       // 🟩 Reconstruye el estado de las mesas reservadas desde localStorage
      const nuevoEstadoMesas = {};
      mesasDisponibles.forEach(mesa => nuevoEstadoMesas[`mesa${mesa.id}`] = 'disponible');
      reservasGuardadas.forEach(reserva => {
         const mesaId = mesasDisponibles.find(m => m.nombre === reserva.mesa)?.id;
         if (mesaId) nuevoEstadoMesas[`mesa${mesaId}`] = 'reservado';
      });
      setEstadoMesas(nuevoEstadoMesas);
      setReservasHechas(reservasGuardadas);

   }, []);

     const actualizarReserva = (reservaActualizada, index) => {
         const reservasActuales = JSON.parse(localStorage.getItem('reservasHechas')) || [];
         const reservasActualizadas = [...reservasActuales];
         reservasActualizadas[index] = reservaActualizada;

         localStorage.setItem('reservasHechas', JSON.stringify(reservasActualizadas));
         setReservasHechas(reservasActualizadas);

         const nuevoEstadoMesas = { ...estadoMesas };
         mesasDisponibles.forEach(m => nuevoEstadoMesas[`mesa${m.id}`] = 'disponible');
         reservasActualizadas.forEach(r => {
            const mesaId = mesasDisponibles.find(m => m.nombre === r.mesa)?.id;
            if (mesaId) nuevoEstadoMesas[`mesa${mesaId}`] = 'reservado';
         });

         setEstadoMesas(nuevoEstadoMesas);
         mostrarToast('✅ Reserva actualizada.');
         };


      const confirmarReserva = () => {
         if (!numero.trim()) return alert('Ingresa tu número.');

         const nuevaReserva = {
            cliente: userName,
            plato: plato?.name || '',
            mesa: mesaSeleccionada?.nombre,
            fecha: fechaSeleccionada?.toISOString().split('T')[0],
            hora: horaSeleccionada,
            numero,
            comensales
         };

         const reservasActuales = JSON.parse(localStorage.getItem('reservasHechas')) || [];
         reservasActuales.push(nuevaReserva);
         localStorage.setItem('reservasHechas', JSON.stringify(reservasActuales));
         setReservasHechas(reservasActuales);


      mostrarToast('✅ Reservación confirmada.');
      setMostrarPaso('mesas');
      setNumero('');
      setMesaSeleccionada(null);
      setHoraSeleccionada('');
      setFechaSeleccionada(null);

      // Cambiar el estado de la mesa seleccionada a 'reservada'
      if (mesaSeleccionada) {
         const nuevaMesaEstado = { ...estadoMesas, [`mesa${mesaSeleccionada.id}`]: 'reservada' };
         setEstadoMesas(nuevaMesaEstado);

      }
   };

   const botones = (volverPaso, continuarPaso, puedeContinuar = true) => (
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
         <button onClick={() => setMostrarPaso(volverPaso)}>Atrás</button>
         <button onClick={() => puedeContinuar && setMostrarPaso(continuarPaso)}>Continuar</button>
      </div>
   );

   const mostrarToast = (mensaje) => {
      setToastMensaje(mensaje);
      setToastVisible(true);
      setTimeout(() => {
         setToastVisible(false);
      }, 3000); // Oculta después de 3 segundos
   };

   return (
      <>
     <section className="reservation-section" style={{ paddingBottom: '120px' }}>
         <Container>
            <h2 className="menu-title">Reserva tu mesa</h2>
            <p className="section-text">Selecciona una mesa disponible para continuar con tu reservación.</p>

            {mostrarPaso === 'mesas' && (
               <>
               
               <ul className="mesa-list">
                  {mesasDisponibles.slice(0, cantidadMesasVisibles).map(mesa => {
                     const estado = estadoMesas[`mesa${mesa.id}`];
                     const reservaMesa = reservasHechas.find(r => r.mesa === mesa.nombre);


                     return (
                        <li
                           key={mesa.id}
                           onClick={() => {
                              if (estado === 'disponible') {
                                 setMesaSeleccionada(mesa);
                                 setMostrarPaso('fecha');
                              }
                           }}
                           style={{
                              cursor: estado === 'disponible' ? 'pointer' : 'not-allowed',
                              opacity: estado === 'disponible' ? 1 : 0.6,
                              position: 'relative'
                           }}
                        >
                           <h3>{mesa.nombre}</h3>

                           <p style={{
                              color: estado === 'disponible' ? '#22c55e' : '#ef4444',
                              fontWeight: 'bold',
                           }}>
                              {estado === 'disponible' ? 'Disponible' : 'Reservado'}
                           </p>

                           {estado === 'reservado' && reservaMesa && (
                              <div className="reserva-info">
                                 <span><strong>{reservaMesa.cliente === userName ? 'Tú' : reservaMesa.cliente}</strong></span><br />
                                 <span>{reservaMesa.fecha}</span><br />
                                 <span>{reservaMesa.hora}</span>
                              </div>
                           )}
                        </li>
                     );
                  })}


               </ul>

               {cantidadMesasVisibles < mesasDisponibles.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                     <button
                        onClick={() => setCantidadMesasVisibles(prev => prev + 8)}
                        style={{
                           padding: '10px 20px',
                           backgroundColor: '#22c55e',
                           color: 'white',
                           border: 'none',
                           borderRadius: '8px',
                           cursor: 'pointer',
                           fontWeight: 'bold'
                        }}
                     >
                        Mostrar más mesas
                     </button>
                  </div>
               )}

             </>


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
                     {botones('hora', 'comensales', !!numero.trim())}
                  </div>
               </div>
            )}

            {mostrarPaso === 'comensales' && (
               <div className="modal-overlay">
                  <div className="modal-content">
                     <h3>¿Cuántos comensales asistirán?</h3>
                     <input
                        type="number"
                        min="1"
                        max="8"
                        value={comensales}
                        onChange={(e) => setComensales(e.target.value)}
                        placeholder="Número de personas"
                        required
                     />
                     {botones('numero', 'confirmar', !!comensales)}
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
                     <p><strong>Comensales:</strong> {comensales}</p>
                     <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button onClick={() => setMostrarPaso('numero')}>Volver</button>
                        <button onClick={confirmarReserva}>Confirmar</button>
                     </div>
                  </div>
               </div>
            )}
         </Container>
      </section>

      {toastVisible && (
        <div className="toast-reserva show">
          {toastMensaje}
        </div>
      )}
    </>
);
};

export default Reservaciones;
