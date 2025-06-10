import React from "react";
import { useTracker } from "../../context/TrackerContext";
import Header from "../../components/Header";
import ChartComponent from "../../ChartComponent";
import { useNavigate } from "react-router-dom";

const NavButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/calendar")}
      className="px-4 py-2 bg-blue-light text-gray-800 rounded-full hover:bg-blue-200 mb-4 text-sm sm:text-base shadow-soft touch-target push-button"
    >
      Go to Calendar
    </button>
  );
};

const Tracker = () => {
  const { state, dispatch } = useTracker();
  const {
    studentName,
    subjects,
    checkboxes,
    lessonSubject1,
    lessonSubject2,
    lessonSubject3,
    lessonSubject4,
    lessonGrid1,
    lessonGrid2,
    lessonGrid3,
    lessonGrid4,
    headerFont,
    fixedFont,
    dayFont,
    textBoxFont,
    textBoxFontSize,
    textBoxAlignment,
    selectedSubject,
    showSettings,
    showResetConfirm,
    completedLessons,
  } = state;
  const navigate = useNavigate();

  const handleSubjectChange = (index: number, value: string) => {
    dispatch({ type: "SET_SUBJECTS", payload: subjects.map((s, i) => (i === index ? value : s)) });
  };

  const handleCheckboxChange = (subjectIndex: number, dayIndex: number) => {
    dispatch({
      type: "SET_CHECKBOXES",
      payload: checkboxes.map((row, i) =>
        i === subjectIndex ? row.map((checked, j) => (j === dayIndex ? !checked : checked)) : row
      ),
    });
  };

  const handleHeaderFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_FONT", payload: { type: "header", value: e.target.value } });
  };

  const handleFixedFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_FONT", payload: { type: "fixed", value: e.target.value } });
  };

  const handleDayFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_FONT", payload: { type: "day", value: e.target.value } });
  };

  const handleTextBoxFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_FONT", payload: { type: "textBox", value: e.target.value } });
  };

  const handleTextBoxFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_TEXTBOX_STYLE", payload: { type: "size", value: parseInt(e.target.value) } });
  };

  const handleTextBoxAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_TEXTBOX_STYLE", payload: { type: "alignment", value: e.target.value } });
  };

  const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_STUDENT_NAME", payload: e.target.value });
  };

  const handleCompletedLessonChange = (rowIndex: number, colIndex: number, value: string) => {
    if (selectedSubject) {
      dispatch({
        type: "SET_COMPLETED_LESSONS",
        payload: {
          ...completedLessons,
          [selectedSubject]: completedLessons[selectedSubject].map((row, i) =>
            i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
          ),
        },
      });
    }
  };

  const addSubject = () => {
    dispatch({
      type: "SET_SUBJECTS",
      payload: [...subjects, `Subject ${subjects.length + 1}`],
    });
    dispatch({
      type: "SET_CHECKBOXES",
      payload: [...checkboxes, Array(31).fill(false)],
    });
  };

  const removeLastSubject = () => {
    if (subjects.length === 0) return;
    dispatch({
      type: "SET_SUBJECTS",
      payload: subjects.slice(0, -1),
    });
    dispatch({
      type: "SET_CHECKBOXES",
      payload: checkboxes.slice(0, -1),
    });
  };

  const setDefaultSettings = () => {
    dispatch({ type: "SET_FONT", payload: { type: "header", value: "Arial" } });
    dispatch({ type: "SET_FONT", payload: { type: "fixed", value: "Arial" } });
    dispatch({ type: "SET_FONT", payload: { type: "day", value: "Arial" } });
    dispatch({ type: "SET_FONT", payload: { type: "textBox", value: "Arial" } });
    dispatch({ type: "SET_TEXTBOX_STYLE", payload: { type: "size", value: 16 } });
    dispatch({ type: "SET_TEXTBOX_STYLE", payload: { type: "alignment", value: "left" } });
  };

  const saveProfile = () => {
    const profile = {
      studentName,
      subjects,
      checkboxes,
      lessonSubject1,
      lessonSubject2,
      lessonSubject3,
      lessonSubject4,
      lessonGrid1,
      lessonGrid2,
      lessonGrid3,
      lessonGrid4,
      headerFont,
    };
    const profileName = prompt("Enter a name for this profile:");
    if (profileName) {
      localStorage.setItem(`profile_${profileName}`, JSON.stringify(profile));
      alert("Profile saved!");
    }
  };

  const loadProfile = () => {
    const profileName = prompt("Enter the name of the profile to load:");
    const profileData = localStorage.getItem(`profile_${profileName}`);
    if (profileData) {
      const profile = JSON.parse(profileData);
      dispatch({ type: "SET_STUDENT_NAME", payload: profile.studentName });
      dispatch({ type: "SET_SUBJECTS", payload: profile.subjects });
      dispatch({ type: "SET_CHECKBOXES", payload: profile.checkboxes });
      dispatch({ type: "SET_LESSON_SUBJECT", payload: { index: 1, value: profile.lessonSubject1 } });
      dispatch({ type: "SET_LESSON_SUBJECT", payload: { index: 2, value: profile.lessonSubject2 } });
      dispatch({ type: "SET_LESSON_SUBJECT", payload: { index: 3, value: profile.lessonSubject3 } });
      dispatch({ type: "SET_LESSON_SUBJECT", payload: { index: 4, value: profile.lessonSubject4 } });
      dispatch({ type: "SET_LESSON_GRID", payload: { index: 1, value: profile.lessonGrid1 } });
      dispatch({ type: "SET_LESSON_GRID", payload: { index: 2, value: profile.lessonGrid2 } });
      dispatch({ type: "SET_LESSON_GRID", payload: { index: 3, value: profile.lessonGrid3 } });
      dispatch({ type: "SET_LESSON_GRID", payload: { index: 4, value: profile.lessonGrid4 } });
      dispatch({ type: "SET_FONT", payload: { type: "header", value: profile.headerFont } });
      alert("Profile loaded!");
    } else {
      alert("Profile not found!");
    }
  };

  const resetTracker = () => {
    dispatch({ type: "RESET_ALL" });
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dayCycle = [...days, ...days, ...days, ...days, ...days].slice(0, 31);
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const headerStyle = {
    fontFamily: `${headerFont}, cursive`,
    textAlign: "center" as const,
  };

  const fixedStyle = {
    fontFamily: `${fixedFont}, cursive`,
  };

  const dayStyle = {
    fontFamily: `${dayFont}, cursive`,
  };

  const textBoxStyle = {
    fontFamily: `${textBoxFont}, cursive`,
    fontSize: `${textBoxFontSize}px`,
    textAlign: textBoxAlignment as "left" | "center" | "right",
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="w-full mb-4 sm:mb-8 flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-1/2">
          <label className="block text-lg sm:text-xl font-medium font-sacramento text-lavender-dark" style={fixedStyle}>
            Student Name:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={handleStudentNameChange}
            className="w-full p-2 sm:p-3 border border-gray-light rounded-lg text-sm sm:text-base"
            style={textBoxStyle}
          />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
            className="w-full sm:w-auto bg-lavender text-gray-800 p-2 sm:p-3 rounded-full text-sm sm:text-base shadow-soft touch-target push-button"
          >
            Customize
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="custom-panel fixed inset-0 bg-cream p-4 overflow-y-auto z-30 md:max-w-md mx-auto rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2 font-sacramento text-lavender-dark">Customization</h3>
          <button
            onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
            className="mt-2 bg-pink-light text-gray-800 p-2 rounded-full text-sm shadow-soft push-button"
          >
            Close
          </button>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Header Font:</label>
            <select
              value={headerFont}
              onChange={handleHeaderFontChange}
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
              style={{ ...textBoxStyle, fontFamily: headerFont }}
            >
              <option value="Sacramento" style={{ fontFamily: "Sacramento, cursive" }}>Sacramento</option>
              <option value="Pacifico" style={{ fontFamily: "Pacifico, cursive" }}>Pacifico</option>
              <option value="Dancing Script" style={{ fontFamily: "Dancing Script, cursive" }}>Dancing Script</option>
              <option value="Lobster" style={{ fontFamily: "Lobster, cursive" }}>Lobster</option>
              <option value="Caveat" style={{ fontFamily: "Caveat, cursive" }}>Caveat</option>
              <option value="Great Vibes" style={{ fontFamily: "Great Vibes, cursive" }}>Great Vibes</option>
              <option value="Allura" style={{ fontFamily: "Allura, cursive" }}>Allura</option>
              <option value="Amatic SC" style={{ fontFamily: "Amatic SC, cursive" }}>Amatic SC</option>
              <option value="Arial" style={{ fontFamily: "Arial, sans-serif" }}>Arial</option>
              <option value="Times New Roman" style={{ fontFamily: "Times New Roman, serif" }}>Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Fixed Font:</label>
            <select
              value={fixedFont}
              onChange={handleFixedFontChange}
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
              style={{ ...textBoxStyle, fontFamily: fixedFont }}
            >
              <option value="Sacramento" style={{ fontFamily: "Sacramento, cursive" }}>Sacramento</option>
              <option value="Pacifico" style={{ fontFamily: "Pacifico, cursive" }}>Pacifico</option>
              <option value="Dancing Script" style={{ fontFamily: "Dancing Script, cursive" }}>Dancing Script</option>
              <option value="Lobster" style={{ fontFamily: "Lobster, cursive" }}>Lobster</option>
              <option value="Caveat" style={{ fontFamily: "Caveat, cursive" }}>Caveat</option>
              <option value="Great Vibes" style={{ fontFamily: "Great Vibes, cursive" }}>Great Vibes</option>
              <option value="Allura" style={{ fontFamily: "Allura, cursive" }}>Allura</option>
              <option value="Amatic SC" style={{ fontFamily: "Amatic SC, cursive" }}>Amatic SC</option>
              <option value="Arial" style={{ fontFamily: "Arial, sans-serif" }}>Arial</option>
              <option value="Times New Roman" style={{ fontFamily: "Times New Roman, serif" }}>Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Day Font:</label>
            <select
              value={dayFont}
              onChange={handleDayFontChange}
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
              style={{ ...textBoxStyle, fontFamily: dayFont }}
            >
              <option value="Sacramento" style={{ fontFamily: "Sacramento, cursive" }}>Sacramento</option>
              <option value="Pacifico" style={{ fontFamily: "Pacifico, cursive" }}>Pacifico</option>
              <option value="Dancing Script" style={{ fontFamily: "Dancing Script, cursive" }}>Dancing Script</option>
              <option value="Lobster" style={{ fontFamily: "Lobster, cursive" }}>Lobster</option>
              <option value="Caveat" style={{ fontFamily: "Caveat, cursive" }}>Caveat</option>
              <option value="Great Vibes" style={{ fontFamily: "Great Vibes, cursive" }}>Great Vibes</option>
              <option value="Allura" style={{ fontFamily: "Allura, cursive" }}>Allura</option>
              <option value="Amatic SC" style={{ fontFamily: "Amatic SC, cursive" }}>Amatic SC</option>
              <option value="Arial" style={{ fontFamily: "Arial, sans-serif" }}>Arial</option>
              <option value="Times New Roman" style={{ fontFamily: "Times New Roman, serif" }}>Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Text Box Font:</label>
            <select
              value={textBoxFont}
              onChange={handleTextBoxFontChange}
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
              style={{ ...textBoxStyle, fontFamily: textBoxFont }}
            >
              <option value="Sacramento" style={{ fontFamily: "Sacramento, cursive" }}>Sacramento</option>
              <option value="Pacifico" style={{ fontFamily: "Pacifico, cursive" }}>Pacifico</option>
              <option value="Dancing Script" style={{ fontFamily: "Dancing Script, cursive" }}>Dancing Script</option>
              <option value="Lobster" style={{ fontFamily: "Lobster, cursive" }}>Lobster</option>
              <option value="Caveat" style={{ fontFamily: "Caveat, cursive" }}>Caveat</option>
              <option value="Great Vibes" style={{ fontFamily: "Great Vibes, cursive" }}>Great Vibes</option>
              <option value="Allura" style={{ fontFamily: "Allura, cursive" }}>Allura</option>
              <option value="Amatic SC" style={{ fontFamily: "Amatic SC, cursive" }}>Amatic SC</option>
              <option value="Arial" style={{ fontFamily: "Arial, sans-serif" }}>Arial</option>
              <option value="Times New Roman" style={{ fontFamily: "Times New Roman, serif" }}>Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Text Box Font Size:</label>
            <input
              type="number"
              value={textBoxFontSize}
              onChange={handleTextBoxFontSizeChange}
              min="8"
              max="24"
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-sacramento text-lavender-dark">Text Box Alignment:</label>
            <select
              value={textBoxAlignment}
              onChange={handleTextBoxAlignmentChange}
              className="w-full p-2 border border-gray-light rounded-lg text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="mt-6 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <button
              onClick={() => dispatch({ type: "TOGGLE_RESET_CONFIRM" })}
              className="px-4 py-2 bg-pink-light text-gray-800 rounded-full hover:bg-pink-200 text-sm shadow-soft push-button"
            >
              Reset Tracker
            </button>
            <button
              onClick={setDefaultSettings}
              className="px-4 py-2 bg-lavender text-gray-800 rounded-full hover:bg-lavender-dark text-sm shadow-soft push-button"
            >
              Default Settings
            </button>
            <button
              onClick={saveProfile}
              className="px-4 py-2 bg-mint text-gray-800 rounded-full hover:bg-mint-dark text-sm shadow-soft push-button"
            >
              Save Profile
            </button>
            <button
              onClick={loadProfile}
              className="px-4 py-2 bg-blue-light text-gray-800 rounded-full hover:bg-blue-200 text-sm shadow-soft push-button"
            >
              Load Profile
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content bg-white p-8 rounded-xl shadow-2xl text-center w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <p className="text-xl sm:text-2xl font-sacramento text-lavender-dark mb-6">
              WARNING: You are about to erase all data on this tracker. Confirm to proceed?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => dispatch({ type: "TOGGLE_RESET_CONFIRM" })}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 text-base shadow-soft push-button"
              >
                Cancel
              </button>
              <button
                onClick={resetTracker}
                className="px-6 py-3 bg-pink-light text-gray-800 rounded-full hover:bg-pink-200 text-base shadow-soft push-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tracker-container mb-4">
        <div className="tracker-table-wrapper overflow-x-auto min-w-max">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-lavender sticky top-0 z-10">
                <th
                  className="border border-gray-light p-1 sm:p-2 text-center w-1/5 font-sacramento text-lavender-dark sticky-left"
                  style={fixedStyle}
                >
                  Subjects
                </th>
                {Array.from({ length: 31 }, (_, index) => (
                  <th
                    key={index}
                    className={`border border-gray-light p-0.5 sm:p-1 text-center w-1/32 ${
                      index % 7 === 0 ? "week-start" : ""
                    } font-sacramento text-lavender-dark`}
                    style={dayStyle}
                  >
                    <div className="day-header text-xs sm:text-sm">{dayCycle[index]}</div>
                    <div className="date-header text-xs sm:text-sm">{dates[index]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject: string, subjectIndex: number) => (
                <tr
                  key={subjectIndex}
                  className={`border border-gray-light ${subjectIndex % 2 === 0 ? "bg-mint-light" : "bg-pink-light"}`}
                >
                  <td className="border border-gray-light p-1 sm:p-2 w-1/5 sticky-left">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                      className="p-1 sm:p-2 border border-gray-light rounded-lg text-xs sm:text-sm w-full"
                      style={textBoxStyle}
                    />
                  </td>
                  {Array.from({ length: 31 }, (_, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`border border-gray-light p-0.5 sm:p-1 text-center ${dayIndex % 7 === 0 ? "week-start" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          checkboxes[subjectIndex] && checkboxes[subjectIndex][dayIndex] !== undefined
                            ? checkboxes[subjectIndex][dayIndex]
                            : false
                        }
                        onChange={() => handleCheckboxChange(subjectIndex, dayIndex)}
                        className="rounded-full w-0.5 h-0.5 sm:w-0.75 sm:h-0.75 touch-target"
                        style={{
                          borderColor: "#000000",
                          backgroundColor:
                            checkboxes[subjectIndex] && checkboxes[subjectIndex][dayIndex] ? "#000000" : "#fff",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={addSubject}
        className="px-2 sm:px-4 py-2 sm:py-3 bg-mint text-gray-800 rounded-full hover:bg-mint-dark w-10 sm:w-12 mb-4 text-sm sm:text-base shadow-soft touch-target push-button"
        aria-label="Add new subject and tracker row"
      >
        +
      </button>
      <button
        onClick={removeLastSubject}
        className="px-2 sm:px-4 py-2 sm:py-3 bg-red-light text-gray-800 rounded-full hover:bg-red-200 w-10 sm:w-12 mb-4 text-sm sm:text-base shadow-soft touch-target push-button"
        aria-label="Remove last subject and tracker row"
      >
        -
      </button>
      <NavButton />

      <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm p-2 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold mb-2 font-sacramento text-lavender-dark">Completed Lessons</h2>
        <div className="mb-2">
          <select
            value={selectedSubject || ""}
            onChange={(e) => dispatch({ type: "SET_SELECTED_SUBJECT", payload: e.target.value })}
            className="w-full p-2 sm:p-3 border border-gray-light rounded-lg text-sm sm:text-base"
            style={textBoxStyle}
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        {selectedSubject && (
          <div className="grid grid-cols-4 grid-rows-4 gap-2 p-2 completed-lessons-grid">
            {(completedLessons[selectedSubject] || Array.from({ length: 4 }, () => Array(4).fill(""))).map(
              (row: string[], rowIndex: number) =>
                row.map((cell: string, colIndex: number) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell}
                    onChange={(e) => handleCompletedLessonChange(rowIndex, colIndex, e.target.value)}
                    className="p-1 sm:p-2 border border-gray-light rounded-lg text-xs sm:text-sm w-full h-full"
                    style={{ ...textBoxStyle, fontSize: "0.75rem" }}
                  />
                ))
            )}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm p-2 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold mb-2 font-sacramento text-lavender-dark">Progress Summary</h2>
        <div className="chart-container" style={{ height: "200px", maxWidth: "100%" }}>
          {subjects.length > 0 && <ChartComponent subjects={subjects} checkboxes={checkboxes} />}
        </div>
      </div>
    </div>
  );
};

export default Tracker;