import React, { useState } from 'react';
import ReceptesController from './controllers/ReceptesController';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const receptesController = new ReceptesController();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar que las contraseñas sean iguales
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Verificar complejidad de la contraseña usando regex
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('La contraseña debe contener al menos 1 número y 1 carácter especial, y ser de al menos 8 caracteres');
      return;
    }

    // Aquí podrías enviar los datos a tu controlador o hacer cualquier otra lógica
    receptesController.registerUser(username, password);

    // Limpiar los campos después de enviar
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
