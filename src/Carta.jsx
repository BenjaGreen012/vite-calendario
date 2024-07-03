import React from 'react';
import './Carta.css';

const Carta = ({ day, isEmpty, isPreviousMonth, isNextMonth, note }) => {
  let cartaClass = 'carta';
  
  if (isPreviousMonth) {
    cartaClass += ' previous-month';
  }
  
  if (isNextMonth) {
    cartaClass += ' next-month';
  }

  return (
    <div className={cartaClass}>
      <div className="day-number">{day}</div>
      {note && <div className="note">{note}</div>}
    </div>
  );
};

export default Carta;
