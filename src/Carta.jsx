import React from 'react';
import './Carta.css';

const Carta = ({ day, isEmpty, isPreviousMonth, isNextMonth, note, onClick }) => {
  let cartaClass = 'carta';
  
  if (isPreviousMonth) {
    cartaClass += ' previous-month';
  }
  
  if (isNextMonth) {
    cartaClass += ' next-month';
  }

  return (
    <div className={cartaClass} onClick={onClick}>
      <div className="day-number">{day}</div>
      {note && note.length > 0 && note.map((n, index) => (
        <div key={index} className="note">{n.record}</div>
      ))}
    </div>
  );
};

export default Carta;
