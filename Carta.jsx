import React from 'react';
import './Carta.css';

const Carta = ({ day, isEmpty, isPreviousMonth, isNextMonth }) => {
  let cartaClass = 'carta';
  
//   if (isEmpty) {
//     cartaClass += ' empty';
//   }
  
  if (isPreviousMonth) {
    cartaClass += ' previous-month';
  }
  
  if (isNextMonth) {
    cartaClass += ' next-month';
  }

  return (
    <div className={cartaClass}>
      {day}
    </div>
  );
};

export default Carta;
