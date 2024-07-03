import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, NavLink } from "react-router-dom";
import './App.css';
import LoginContext from './components/LoginContext';

function App() {
  const [user, setUser] = React.useState(null);
  const handleLogout = () => {
    setUser(null);
  };
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
                  <>
                    <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
                    <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Register</NavLink>
                  </>
                ) : (
                  <NavLink onClick={handleLogout}>Logout</NavLink>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <Outlet />
      </LoginContext.Provider>
    </>
  );
}

export default App;
