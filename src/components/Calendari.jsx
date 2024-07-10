import React, { useState, useContext, useEffect } from 'react';
import Carta from '../Carta';
import ReceptesController from '../controllers/ReceptesController';
import LoginContext from './LoginContext';
import '../styles/Calendari.css';
import '../styles/ButtonAddNote.css';
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
    console.log(selectedDate);

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
    const selectedDate = `${currentYear}-${formatTwoDigits(currentMonth + 1)}-${formatTwoDigits(selectedDay)}`;
    await receptesController.createNota(selectedDate, Nota, user.Id);
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
          <div className='backgroundNotes'>
            <form className='note-form' onSubmit={handleAddNote}>
              <textarea
                value={Nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Add a note"
                rows={"6"}
                className="note-input"
              />
              <button type='submit' className='add-note-button'>
                <div class="svg-wrapper-1">
                  <div class="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      fill="white" version="1.1" id="Capa_1"
                      viewBox="0 0 45.402 45.402"
                      xml:space="preserve"
                      width="20"
                      height="20"
                      class="icon"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g>
                    </svg>
                  </div>
                </div>
                <span>Save</span>
              </button>

            </form>
          </div>
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
        </div>

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
          <div className="calendari">
            {renderCalendari()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendari;
