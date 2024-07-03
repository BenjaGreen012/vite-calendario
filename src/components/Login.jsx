import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceptesController from '../controllers/ReceptesController';
import { useContext } from 'react';
import LoginContext from './LoginContext';


const UserList = () => {


  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchPassword, setSearchPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const { user, setUser } = useContext(LoginContext);

  const receptesController = new ReceptesController();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArray = await receptesController.getAllUsers();
        setUsers(usersArray);
        setFilteredUsers(usersArray);

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
      setUser(filtered[0]);

    } else {
      setSelectedUserId(null);
      setFilteredUsers([]);
      setLoggedIn(false);
      setError('Usuario o contraseña incorrecta.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRegister = () => {
    navigate('/register');
  };
  const handleIrCalendario = () => {
    navigate('/caledari');
  };

  if (loggedIn) {
    return (
      <div>
        <h1>Login</h1>
        <p>¡Logueado correctamente!</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
        <button onClick={handleIrCalendario}>Ir a Calendario</button>
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
        <button onClick={handleRegister}>Register</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserList;
