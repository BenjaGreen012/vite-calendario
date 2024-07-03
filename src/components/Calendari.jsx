import React, { useState } from 'react';
import Carta from '../Carta';
import ReceptesController from '../controllers/ReceptesController';
import LoginContext from './LoginContext';
import { useContext } from 'react';
import '../styles/Calendari.css';
import '../styles/ButtonNextBack.css';

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
  const [notes, setNotes] = useState({});
  const [Nota, setNota] = useState('');
  const { user } = useContext(LoginContext);
  const [fecha, setFecha] = useState(new Date());
  const receptesController = new ReceptesController();

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

  const handleAddNote = (event) => {
    event.preventDefault();
    receptesController.createNota(fecha, Nota, user.Id);
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
      const note = notes[`${currentYear}-${currentMonth}-${day}`];
      days.push(<Carta key={`day-${day}`} day={day} isEmpty={false} note={note} />);
    }

    // Add empty days for the last week
    for (let i = 0; i < (6 - adjustedLastDay); i++) {
      days.push(<Carta key={`empty-end-${i}`} day={i + 1} isEmpty={true} isNextMonth={true} />);
    }

    return (
      <div className="month">
        <div className="days-of-week">
          {daysOfWeek.map(day => <div key={day} className="day-name">{day}</div>)}
        </div>
        <div className="days">
          {days}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='containerCalendar'>
        <div className='rightContainer'>
          <div className='buttonsContainer'>
            <a className="fancy" onClick={handlePreviousMonth}>
              <span className="top-key"></span>
              <span className="text">PREVIOUS</span>
              <span className="bottom-key-1"></span>
              <span className="bottom-key-2"></span>
            </a>
            <h3 className='monthAndYearTitle'>
              {months[currentMonth]} {currentYear}
            </h3>
            <a className="fancy" onClick={handleNextMonth}>
              <span className="top-key"></span>
              <span className="text">NEXT</span>
              <span className="bottom-key-1"></span>
              <span className="bottom-key-2"></span>
            </a>
          </div>
                  <form className='note-form' onSubmit={handleAddNote}>
            <input type='date' value={fecha} onChange={(e) => setFecha(e.target.value)}></input>
          <textarea 
            value={Nota}
        //    defaultValue={Nota} 
            onChange={(e) => setNota(e.target.value)} 
            placeholder="Add a note" 
            className="note-input"
          />
          <button onClick={handleAddNote} className="add-note-button">Add Note</button>
        </form>
          <div className="calendari">
            {renderCalendari()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendari;
