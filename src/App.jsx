import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import HeroSection from './Components/HeroSection.jsx';
import Menu from './Components/Menu.jsx';
import Reservaciones from './Components/Reservaciones.jsx';
import ReservacionesHechas from './Components/ReservacionesHechas';
import './App.css';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Navbar />
      <main>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Menu />
            </>
          }
        />
        <Route path="/reservaciones" element={<Reservaciones />} />

        {/* ✅ Solo el ADMIN puede acceder */}
        {user?.rol === 'admin' && (
          <Route path="/reservaciones-hechas" element={<ReservacionesHechas />} />
        )}
      </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
