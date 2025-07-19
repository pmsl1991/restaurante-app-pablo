import { useState } from 'react';
import '../Styles/Authentication.css';
import { ChefHat, User } from 'lucide-react';

const Authentication = ({ onClose }) => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [password1, setPassword1] = useState('');
   const [password2, setPassword2] = useState('');
   const [error, setError] = useState('');
   const [showRegister, setShowRegister] = useState(false)

   // VALIDADION DEL INPUT EMAIL
   const validarEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   // VALIDADION DEL INPUT PASSWORD
   const validarPassword = (pass) => {
      return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(pass);
   };

   const mostrarToast = (mensaje, tipo = 'success') => {
      const toast = document.getElementById('toast');
      toast.textContent = mensaje;
      toast.className = `toast show ${tipo}`;
      setTimeout(() => {
         toast.className = 'toast';
      }, 3000);
   };


   //FUNCION DEL BTNLOGIN
   const handleLogin = (e) => {
      e.preventDefault();

      if (!validarEmail(username)) {
         setError('Correo inválido. Debe tener un formato válido como nombre@dominio.com');
         return;
      }

      if (!validarPassword(password)) {
         setError('Contraseña inválida. Debe tener mínimo 6 caracteres, incluyendo letras y números.');
         return;
      }

      fetch('https://json-backend-reservas2.onrender.com/usuarios')
         .then(res => res.json())
         .then(data => {
            const usuarioEncontrado = data.find(u => u.username === username && u.password === password);
            if (usuarioEncontrado) {
            const user = {
               name: usuarioEncontrado.username,
               rol: usuarioEncontrado.username === 'admin@gmail.com' ? 'admin' : 'cliente'
            };
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('userLoggedIn'));
            onClose();
            window.location.href = '/';
            } else {
            setError('Credenciales incorrectas.');
            }
         })
         .catch(err => {
            console.error('Error al iniciar sesión:', err);
            setError('Error de conexión con el servidor.');
         });
      };


   //FUNCION DEL BTNREGISTRER
   const handleRegister = async (e) => {
      e.preventDefault();

      if (!validarEmail(username)) {
         mostrarToast('Correo inválido. Debe tener un formato válido.', 'error');
         return;
      }

      if (!validarPassword(password1 || password2)) {
         mostrarToast('Contraseña inválida. Debe tener mínimo 6 caracteres, incluyendo letras y números.', 'error');
         return;
      }

      if (password1 !== password2) {
         mostrarToast('Las contraseñas no coinciden.', 'error');
         return;
      }

      // Validar si ya existe el usuario en la base de datos
      const response = await fetch(`https://json-backend-reservas2.onrender.com/usuarios?username=${username}`);
      const usuarios = await response.json();

      if (usuarios.length > 0) {
         mostrarToast('Este correo ya está registrado. Intenta iniciar sesión.', 'error');
         return;
      }

      // Crear nuevo usuario
      const nuevoUsuario = { username, password: password1, rol: 'cliente' };

      await fetch('https://json-backend-reservas2.onrender.com/usuarios', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(nuevoUsuario)
      });

      mostrarToast('Usuario registrado correctamente ✅', 'success');

      setUsername('');
      setPassword1('');
      setPassword2('');
      setError('');
      setShowRegister(false); // Cambia a vista de login
      };


   //FUNCION DE VISTA DEL LOGIN O REGISTER
   const handleShowRegister = () => {
      setShowRegister(!showRegister)
   }

   return (
      <article>
         {
            !showRegister ?

               //Login
               <div className='login-container'>
                  <section style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem', alignItems: 'center', gap: '.6rem' }}>
                     <div style={{ backgroundColor: '#f97316', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '65px', height: '65px', borderRadius: '50%' }}>
                        <ChefHat style={{ color: '#eeee', width: '32px', height: '32px' }} />
                     </div>
                     <h2 style={{ textAlign: 'center', fontSize: '1.7rem' }}>Iniciar Sesión</h2>
                     <p style={{ color: '#9ca3af' }}>Accede a tu cuenta para continuar</p>
                  </section>
                  <section className='login-form'>
                     <label>Correo Electrónico</label>
                     <input
                        type="text"
                        placeholder="tu@email.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                        style={{ marginBottom: '.8rem' }}
                     />

                        <input
                        type="password"
                        placeholder="..............."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                     />


                     {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

                  </section>
                  <section style={{ padding: '16px 0', display: 'flex', justifyContent: 'flex-end' }}>
                     <a href="" className='a'>¿Olvidaste tu contraseña?</a>
                  </section>
                  <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
                     <button onClick={handleLogin} className='btn-login'>Iniciar Sesión</button>
                     <button onClick={onClose} className='btn-close'>Cancelar</button>
                  </section>
                  <section style={{ padding: '18px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <p style={{ color: '#9ca3af' }}>¿No tienes cuenta?<a onClick={handleShowRegister} className='a' style={{ marginLeft: '5px', fontSize: '16px', cursor: 'pointer' }}>Regístrate aquí</a></p>
                  </section>
               </div>

               :

               //Register
               <div className='login-container'>
                  <section style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem', alignItems: 'center', gap: '.6rem' }}>
                     <div style={{ backgroundColor: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '65px', height: '65px', borderRadius: '50%' }}>
                        <User style={{ color: '#eeee', width: '32px', height: '32px' }} />
                     </div>
                     <h2 style={{ textAlign: 'center', fontSize: '1.7rem' }}>Crear Cuenta</h2>
                     <p style={{ color: '#9ca3af' }}>Accede a tu cuenta para continuar</p>
                  </section>
                  <section className='login-form'>
                     <label>Correo Electrónico</label>
                     <input
                        type="text"
                        placeholder="tu@email.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '.8rem' }}
                     />
                     <label>Contraseña</label>
                     <input
                        type="password"
                        placeholder="..............."
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        style={{ marginBottom: '.8rem' }}
                     />
                     <label>Confirmar Contraseña</label>
                     <input
                        type="password"
                        placeholder="..............."
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                     />

                     {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

                  </section>
                  <section style={{ padding: '16px 0', display: 'flex', alignItems: 'center' }}>
                     <input type="checkbox" style={{ cursor: 'pointer' }} /><p style={{ fontSize: '14px', paddingLeft: '8px' }}>Acepto los <a className='a' style={{ color: '#22c55e' }}>términos y condiciones</a></p>
                  </section>
                  <section style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
                     <button onClick={handleRegister} className='btn-register'>Crear Cuenta</button>
                     <button onClick={onClose} className='btn-close'>Cancelar</button>
                  </section>
                  <section style={{ padding: '18px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     <p style={{ color: '#9ca3af' }}>¿Ya tienes cuenta?<a onClick={handleShowRegister} className='a' style={{ marginLeft: '5px', fontSize: '16px', cursor: 'pointer' }}>Inicia sesión</a></p>
                  </section>
               </div>
         }

         <div id="toast" className="toast"></div>



      </article>
   );
};

export default Authentication;
