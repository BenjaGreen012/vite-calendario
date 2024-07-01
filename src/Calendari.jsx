import React, { useState } from 'react';
import Carta from './Carta';
import './Calendari.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const Calendari = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendari = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = (firstDay + 6) % 7; // Adjusting to make Monday the first day
    const lastDay = new Date(currentYear, currentMonth, daysInMonth).getDay();
    const adjustedLastDay = (lastDay + 6) % 7; // Adjusting to make Monday the first day for the last day of the month

    let days = [];

    // Determine the previous month and year
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Determine the next month and year
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    // Add empty days for the first week
    for (let i = 0; i < adjustedFirstDay; i++) {
      const prevMonthDays = getDaysInMonth(previousMonth, previousYear);
      days.push(
        <Carta
          key={`empty-start-${i}`}
          day={prevMonthDays - (adjustedFirstDay - i - 1)}
          isEmpty={true}
          isPreviousMonth={true}
        />
      );
    }

    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(<Carta key={`day-${day}`} day={day} isEmpty={false} />);
    }

    // Add empty days for the last week
    for (let i = 0; i < (6 - adjustedLastDay); i++) {
      days.push(<Carta key={`empty-end-${i}`} day={i + 1} isEmpty={true} isNextMonth={true} />);
    }

    return (
      <div className="month">
        <h3>{months[currentMonth]} {currentYear}</h3>
        <div className="days-of-week">
          {daysOfWeek.map(day => <div key={day} className="carta day-name">{day}</div>)}
        </div>
        <div className="days">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="calendari">
      <button onClick={handlePreviousMonth}>Anterior</button>
      <button onClick={handleNextMonth}>Siguiente</button>
      {renderCalendari()}
    </div>
  );
};

export default Calendari;
