import '../Styles/HeroSection.css';
import Container from './Container';

const Menu = () => {
   const menuItems = [
      { name: 'Pasta Carbonara', price: '$12', description: 'Deliciosa pasta con salsa cremosa y panceta', image: '/assets/pasta.jpeg' },
      { name: 'Pizza Margherita', price: '$10', description: 'Pizza clásica con tomate, mozzarella y albahaca', image: '/assets/pizza.jpeg' },
      { name: 'Carne Asada', price: '$8', description: 'Jugosa carne a la parrilla con especias especiales', image: '/assets/carne.jpeg' },
      { name: 'Pollo Asado', price: '$20', description: 'Pollo marinado y asado a la perfección', image: '/assets/pollo.jpeg' },
   ];

   const handleElegirPlato = (plato) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
         alert("Debes iniciar sesión primero");
         return;
      }

      localStorage.setItem('platoReservado', JSON.stringify(plato));
      alert(`${plato.name} agregado a tu reservación.`);
   };



   return (
      <section id="menu" className="menu-section">
         <Container>
            <h2 className="menu-title">Nuestro Menú</h2>
            <p className='menu-subtitle'>Descubre nuestros platos más populares, preparados con ingredientes frescos y técnicas tradicionales</p>
            <ul className="menu-list">
               {menuItems.map((item, index) => (
                  <li key={index} className="menu-item">
                     <img src={item.image} alt={item.name} className="menu-image" />
                     <h3>{item.name}</h3>
                     <p>{item.description}</p>
                     <span>{item.price}</span>
                     <button
                        className="add-button"
                        onClick={() => handleElegirPlato(item)}
                     >
                        Agregar a reservación
                     </button>

                  </li>
               ))}
            </ul>
         </Container>
      </section>
   );
};

export default Menu;
