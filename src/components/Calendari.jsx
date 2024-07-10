import React, { useState, useContext, useEffect } from 'react';
import Carta from '../Carta';
import ReceptesController from '../controllers/ReceptesController';
import LoginContext from './LoginContext';
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

const formatTwoDigits = (number) => {
  return number < 10 ? `0${number}` : number;
};

const Calendari = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [notes, setNotes] = useState({});
  const [Nota, setNota] = useState('');
  const { user } = useContext(LoginContext);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayNotes, setSelectedDayNotes] = useState([]);
  const receptesController = new ReceptesController();

  useEffect(() => {
    if (selectedDay) {
      fetchNotesForSelectedDay(selectedDay);
    }
  }, [selectedDay]);

  const fetchNotesForSelectedDay = async (day) => {
    if (!user || !user.Id) {
      console.error('User is not defined');
      return;
    }

    const selectedDate = `${currentYear}-${formatTwoDigits(currentMonth + 1)}-${formatTwoDigits(day)}`;
    try {
      const notesData = await receptesController.getNotaByIdDate(selectedDate, user.Id);
      if (notesData) {
        setSelectedDayNotes(notesData);
      } else {
        setSelectedDayNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setSelectedDayNotes([]);
    }
  };

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

  const handleAddNote = async (event) => {
    event.preventDefault();
    await receptesController.createNota(fecha, Nota, user.Id);
    if (selectedDay) {
      fetchNotesForSelectedDay(selectedDay);
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
      const selectedDate = `${currentYear}-${formatTwoDigits(currentMonth + 1)}-${formatTwoDigits(day)}`;
      const note = notes[selectedDate];
      days.push(<Carta key={`day-${day}`} day={day} isEmpty={false} note={note} onClick={() => setSelectedDay(day)} />);
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
        <div className='leftContainer'>
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
          <div className="calendari">
            {renderCalendari()}
          </div>
        </div>
        <div className='rightContainer'>
          {selectedDay && (
            <div className='notesContainer'>
              <h3>Notes for {formatTwoDigits(selectedDay)}/{formatTwoDigits(currentMonth + 1)}/{currentYear}</h3>
              {selectedDayNotes && selectedDayNotes.length > 0 ? (
                selectedDayNotes.map((note, index) => (
                  <div key={index} className="note">
                    {note.record}
                  </div>
                ))
              ) : (
                <p>No notes for this day.</p>
              )}
            </div>
          )}
          <form className='note-form' onSubmit={handleAddNote}>
            <input type='date' value={fecha} onChange={(e) => setFecha(e.target.value)}></input>
            <textarea 
              value={Nota}
              onChange={(e) => setNota(e.target.value)} 
              placeholder="Add a note" 
              className="note-input"
            />
            <button type="submit" className="add-note-button">Add Note</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Calendari;
