import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, NavLink } from "react-router-dom";
import './App.css';
import LoginContext from './components/LoginContext';

function App() {
  const [user, setUser] = useState(null); // Estado para manejar el usuario logueado

  useEffect(() => {
    // Comprobar si hay un usuario logueado en localStorage al cargar la aplicación
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // Función para manejar el logout del usuario
  function handleLogout() {
    setUser(null); // Limpiar el estado del usuario
    localStorage.removeItem('loggedInUser'); // Eliminar el usuario del localStorage al hacer logout
  }

  return (
    <>
      <LoginContext.Provider value={{ user, setUser }}>
        <Navbar bg="light" expand="lg">
          <Container>
            <NavLink to="/" className="navbar-brand">Calendario</NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {user === null ? (
                  // Mostrar enlaces de Login y Register si no hay usuario logueado
                  <>
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                      Login
                    </NavLink>
                    <NavLink 
                      to="/register" 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                      Register
                    </NavLink>
                  </>
                ) : (
                  // Mostrar enlace de Logout si hay un usuario logueado
                  <NavLink 
                    to="/" 
                    className="nav-link" 
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet /> {/* Renderiza los componentes de las rutas hijas */}
      </LoginContext.Provider>
    </>
  );
}

export default App;
