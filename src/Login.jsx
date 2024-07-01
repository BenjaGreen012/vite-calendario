import React, { useEffect, useState } from 'react';
import ReceptesController from './controllers/ReceptesController';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchPassword, setSearchPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false); 

  const receptesController = new ReceptesController();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArray = await receptesController.getAllUsers();
        setUsers(usersArray);
        setFilteredUsers(usersArray);
        
        // Verificar si hay un usuario logueado en el localStorage
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
          const foundUser = usersArray.find(user => user.id === loggedInUser.id);
          if (foundUser) {
            setSelectedUserId(foundUser.id);
            setLoggedIn(true);
          }
        }
      } catch (error) {
        setError('Error al obtener la lista de usuarios.');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(user => user.username === searchUsername && user.password === searchPassword);

    if (filtered.length === 1) {
      setSelectedUserId(filtered[0].id);
      setFilteredUsers(filtered);
      setLoggedIn(true);
      setError(null);
      
      // Guardar el usuario logueado en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(filtered[0]));
    } else {
      setSelectedUserId(null);
      setFilteredUsers([]);
      setLoggedIn(false);
      setError('Usuario o contraseña incorrecta.');
      
      // Limpiar el localStorage si hay error
      localStorage.removeItem('loggedInUser');
    }
  };

  const handleLogout = () => {
    setSelectedUserId(null);
    setFilteredUsers([]);
    setLoggedIn(false);
    setSearchUsername('');
    setSearchPassword('');
    localStorage.removeItem('loggedInUser');
  };

  if (loggedIn) {
    return (
      <div>
        <h1>Login</h1>
        <p>¡Logueado correctamente!</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="Usuario"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={searchPassword}
          onChange={(e) => setSearchPassword(e.target.value)}
        />
        <button onClick={handleSearch}>Login</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserList;
