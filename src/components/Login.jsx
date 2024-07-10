import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptesController from '../controllers/ReceptesController';
import LoginContext from './LoginContext';
import '../styles/Login.css';

const UserList = () => {
  const [users, setUsers] = useState([]); // Lista de todos los usuarios
  const [error, setError] = useState(null); // Estado para manejar errores
  const [searchUsername, setSearchUsername] = useState(''); // Estado para el nombre de usuario ingresado
  const [searchPassword, setSearchPassword] = useState(''); // Estado para la contraseña ingresada
  const [loggedIn, setLoggedIn] = useState(false); // Estado para manejar si el usuario está logueado
  const { setUser } = useContext(LoginContext); // Contexto de login para manejar el usuario actual
  
  const receptesController = new ReceptesController(); // Controlador para obtener usuarios
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    // Función para obtener la lista de usuarios
    async function fetchUsers() {
      try {
        const usersArray = await receptesController.getAllUsers(); // Obtener todos los usuarios
        setUsers(usersArray); // Guardar usuarios en el estado
      } catch (error) {
        setError('Error al obtener la lista de usuarios.');
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, [receptesController]);

  // Función para manejar el login
  function handleSearch() {
    const filtered = users.filter(user => user.username === searchUsername && user.password === searchPassword);

    if (filtered.length === 1) {
      setLoggedIn(true); // Establecer como logueado
      setError(null); // Limpiar cualquier error previo
      setUser(filtered[0]); // Establecer el usuario en el contexto
      
      // Almacenar información en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(filtered[0]));
    } else {
      setLoggedIn(false); // Establecer como no logueado
      setError('Usuario o contraseña incorrecta.'); // Establecer mensaje de error
      
      // Eliminar cualquier información previa en localStorage si el login falla
      localStorage.removeItem('loggedInUser');
    }
  }

  // Función para manejar la navegación a la página de registro
  function handleRegister() {
    navigate('/register');
  }

  // Función para manejar la navegación a la página del calendario
  function handleIrCalendario() {
    navigate('/');
  }

  // Renderizado condicional basado en el estado de login
  if (loggedIn) {
    return (
      <div>
        <h1>Login</h1>
        <p>¡Logueado correctamente!</p>
        <button onClick={handleIrCalendario}>Ir a Calendario</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className='titleLogin'>Login</h1>
      <div className='form'>
        <div class="brutalist-container">
          <input
            className='brutalist-input smooth-type'
            type="text"
            name='text'
            placeholder="Usuario"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
          <label class="brutalist-label">Name</label>
        </div>

        <div class="brutalist-container">
        <input
            className='brutalist-input smooth-type'
            type="password"
            name='text'
            placeholder="Contraseña"
            value={searchPassword}
            onChange={(e) => setSearchPassword(e.target.value)}
          />
          <label class="brutalist-label">Password</label>
        </div>
        <button className='loginBt' onClick={handleSearch}>Login</button>
        <button className='registerBt' onClick={handleRegister}>Register</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserList;