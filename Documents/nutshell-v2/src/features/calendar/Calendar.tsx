import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { useTracker } from "../../context/TrackerContext";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const { state, dispatch } = useTracker();
  const { subjects, checkboxes } = state;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [popupNotes, setPopupNotes] = useState<string>("");
  const [mainNotes, setMainNotes] = useState<string>(localStorage.getItem("mainNotes") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      const savedNotes = localStorage.getItem(`notes_${selectedDate}`);
      setPopupNotes(savedNotes || "");
    }
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("mainNotes", mainNotes);
  }, [mainNotes]);

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const weeks = Array.from({ length: Math.ceil((daysInMonth + firstDayIndex) / 7) }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const day = weekIndex * 7 + dayIndex - firstDayIndex + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    })
  );

  const handleDayClick = (day: number | null) => {
    if (day) {
      const dateStr = `${month + 1}/${day}/${year}`;
      setSelectedDate(dateStr);
      setPopupNotes(localStorage.getItem(`notes_${dateStr}`) || "");
    }
  };

  const handleTrackProgress = () => {
    if (selectedDate && selectedSubject) {
      const [, day] = selectedDate.split("/").map(Number);
      const dayIndex = day - 1;
      const subjectIndex = subjects.indexOf(selectedSubject);

      if (subjectIndex >= 0) {
        dispatch({
          type: "SET_CHECKBOXES",
          payload: checkboxes.map((row, i) =>
            i === subjectIndex ? row.map((checked, j) => (j === dayIndex ? !checked : checked)) : row
          ),
        });
        if (popupNotes.trim()) {
          localStorage.setItem(`notes_${selectedDate}`, popupNotes);
        }
        setSelectedDate(null);
        setSelectedSubject(null);
      }
    }
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">
        {currentDate.toLocaleString("default", { month: "long" })} {year}
      </h1>
      <div className="calendar-wrapper">
        <div className="notes-section">
          <h2 className="text-xl font-bold mb-4 font-sacramento text-lavender-dark">Main Notes</h2>
          <button
            onClick={() => navigate("/")}
            className="back-button touch-target push-button mb-2"
          >
            Nutshell
          </button>
          <textarea
            className="notes-section textarea"
            placeholder="Add your general notes here..."
            value={mainNotes}
            onChange={(e) => setMainNotes(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <table className="calendar-table">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, index) => (
                <tr key={index}>
                  {week.map((day, idx) => (
                    <td
                      key={idx}
                      className={day ? "" : "empty"}
                      onClick={() => handleDayClick(day)}
                    >
                      {day || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="popup">
            <div className="popup-header">
              <h3 className="text-lg font-sacramento text-lavender-dark mb-2">Day: {selectedDate}</h3>
            </div>
            <div className="popup-content">
              <select
                value={selectedSubject || ""}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="popup select"
              >
                <option value="">Select a Subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <textarea
                className="popup textarea"
                placeholder="Add notes for this day..."
                value={popupNotes}
                onChange={(e) => setPopupNotes(e.target.value)}
              />
            </div>
            <div className="popup-buttons">
              {selectedSubject && (
                <button
                  onClick={handleTrackProgress}
                  className="bg-mint text-gray-800 hover:bg-mint-dark push-button"
                >
                  Track Progress
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedSubject(null);
                }}
                className="bg-pink-light text-gray-800 hover:bg-pink-200 push-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;