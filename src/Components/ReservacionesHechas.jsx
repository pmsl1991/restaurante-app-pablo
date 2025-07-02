import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/HeroSection.css';
import Container from './Container';
import EditarReservaModal from './EditarReservaModal';


const localizer = momentLocalizer(moment);

const ReservacionesHechas = () => {
   const [eventos, setEventos] = useState([]);
   const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
   const [reservasDelDia, setReservasDelDia] = useState([]);
   const [reservaSeleccionada, setReservaSeleccionada] = useState(null);


   useEffect(() => {
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservasHechas')) || [];

      // Mapeamos las reservas a eventos para el calendario
      const eventosConvertidos = reservasGuardadas.map((reserva, index) => {
         const fechaHora = moment(`${reserva.fecha} ${reserva.hora}`, 'YYYY-MM-DD HH:mm');
         return {
            id: index,
            title: `${reserva.mesa} - ${reserva.cliente}`,
            start: fechaHora.toDate(),
            end: fechaHora.add(30, 'minutes').toDate(),
            reserva
         };
      });

      setEventos(eventosConvertidos);
      setReservasDelDia(reservasGuardadas);
   }, []);

   // Manejar clic en fecha
   const handleSelectSlot = ({ start }) => {
      const fecha = moment(start).format('YYYY-MM-DD');
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservasHechas')) || [];
      setFechaSeleccionada(fecha);
      setReservasDelDia(reservasGuardadas); // Mostrar todas las reservas sin filtrar

   };

   return (
      <section className="reservation-section">
         <Container>
            <h2 className="menu-title">Reservaciones Hechas</h2>
            <p className="section-text">Consulta las reservaciones registradas por fecha.</p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
               <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
                  <Calendar
                     localizer={localizer}
                     events={eventos}
                     startAccessor="start"
                     endAccessor="end"
                     style={{ height: 500, backgroundColor: 'white', color: '#111827', borderRadius: '10px', padding: '10px' }}
                     selectable
                     onSelectSlot={handleSelectSlot}
                     onSelectEvent={(event) => handleSelectSlot({ start: event.start })}
                     views={['month']}
                     popup
                  />
               </div>

               <div style={{ flex: '1 1 300px', backgroundColor: '#f9fafb', borderRadius: '10px', padding: '1rem' }}>
                  <h3 style={{ color: '#111827', marginBottom: '1rem' }}>
                    {fechaSeleccionada ? `Reservas para ${fechaSeleccionada}` : 'Todas las reservas'}
                  </h3>

                  {reservasDelDia.length === 0 ? (
                     <p style={{ color: '#6b7280' }}>No hay reservas para esta fecha.</p>
                  ) : (
                     reservasDelDia.map((reserva, i) => (
                        <div
                            key={i}
                            className="reserva-item"
                            onClick={() => setReservaSeleccionada(reserva)}
                            style={{ cursor: 'pointer' }}
                            >
                            <div>
                                <strong>{reserva.mesa}</strong> — {reserva.hora}
                            </div>
                            <span className="cliente">{reserva.cliente}</span>
                        </div>

                     ))
                  )}
               </div>
            </div>
         </Container>
         {reservaSeleccionada && (
            <EditarReservaModal
                reserva={reservaSeleccionada}
                onClose={() => setReservaSeleccionada(null)}
                onGuardar={(reservaActualizada) => {
                const reservas = JSON.parse(localStorage.getItem('reservasHechas')) || [];
                const index = reservas.findIndex(r =>
                    r.mesa === reservaSeleccionada.mesa &&
                    r.fecha === reservaSeleccionada.fecha &&
                    r.hora === reservaSeleccionada.hora &&
                    r.cliente === reservaSeleccionada.cliente
                );
                if (index !== -1) {
                    reservas[index] = reservaActualizada;
                    localStorage.setItem('reservasHechas', JSON.stringify(reservas));
                    window.location.reload(); // Más adelante podemos cambiar esto por actualizar solo el estado
                }
                }}
                onEliminar={() => {
                const reservas = JSON.parse(localStorage.getItem('reservasHechas')) || [];
                const filtradas = reservas.filter(r =>
                    !(r.mesa === reservaSeleccionada.mesa &&
                    r.fecha === reservaSeleccionada.fecha &&
                    r.hora === reservaSeleccionada.hora &&
                    r.cliente === reservaSeleccionada.cliente)
                );
                localStorage.setItem('reservasHechas', JSON.stringify(filtradas));
                window.location.reload();
                }}
            />
            )}

      </section>
   );
};

export default ReservacionesHechas;
