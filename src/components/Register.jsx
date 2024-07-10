import React, { useState } from 'react';
import ReceptesController from '../controllers/ReceptesController';

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
    <div className='form'>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className='form'>
          <div class="brutalist-container">
            <input
              className='brutalist-input smooth-type'
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label class="brutalist-label">Nombre de usuario:</label>
          </div>


          <div class="brutalist-container">
            <input
              className='brutalist-input smooth-type'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label class="brutalist-label">Contraseña:</label>
          </div>
          <div class="brutalist-container">
            <input
              className='brutalist-input smooth-type'
              type="password"
              placeholder="Repeat Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label class="brutalist-label">Confirmar Contraseña:</label>
          </div>
        </div>

        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <button type="submit" className='btn'>Registrarse</button>
        
      </form>
    </div>
  );
};

export default Register;
