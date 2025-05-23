import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { COLORS, FONTS, APP } from './config';

const Tracker: React.FC = () => {
  const [studentName, setStudentName] = useState<string>(localStorage.getItem("studentName") || "");
  const [subjects, setSubjects] = useState<string[]>(JSON.parse(localStorage.getItem("subjects") || JSON.stringify(Array(14).fill(""))));
  const [checkboxes, setCheckboxes] = useState<boolean[][]>(JSON.parse(localStorage.getItem("checkboxes") || JSON.stringify(Array(14).fill([]).map(() => Array(31).fill(false)))));
  const [lessonSubject1, setLessonSubject1] = useState<string>(localStorage.getItem("lessonSubject1") || "");
  const [lessonSubject2, setLessonSubject2] = useState<string>(localStorage.getItem("lessonSubject2") || "");
  const [lessonSubject3, setLessonSubject3] = useState<string>(localStorage.getItem("lessonSubject3") || "");
  const [lessonSubject4, setLessonSubject4] = useState<string>(localStorage.getItem("lessonSubject4") || "");
  const [lessonGrid1, setLessonGrid1] = useState<string[][]>(JSON.parse(localStorage.getItem("lessonGrid1") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))));
  const [lessonGrid2, setLessonGrid2] = useState<string[][]>(JSON.parse(localStorage.getItem("lessonGrid2") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))));
  const [lessonGrid3, setLessonGrid3] = useState<string[][]>(JSON.parse(localStorage.getItem("lessonGrid3") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))));
  const [lessonGrid4, setLessonGrid4] = useState<string[][]>(JSON.parse(localStorage.getItem("lessonGrid4") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))));
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [headerFont, setHeaderFont] = useState<string>(localStorage.getItem("headerFont") || "Sacramento");
  const [fixedFont, setFixedFont] = useState<string>(localStorage.getItem("fixedFont") || "Sacramento");
  const [dayFont, setDayFont] = useState<string>(localStorage.getItem("dayFont") || "Sacramento");
  const [textBoxFont, setTextBoxFont] = useState<string>(localStorage.getItem("textBoxFont") || "Sacramento");
  const [textBoxFontSize, setTextBoxFontSize] = useState<number>(parseInt(localStorage.getItem("textBoxFontSize") || "16"));
  const [textBoxAlignment, setTextBoxAlignment] = useState<string>(localStorage.getItem("textBoxAlignment") || "left");
  const [monthColor, setMonthColor] = useState<string>(localStorage.getItem("monthColor") || "#1A3C34");
  const [dayColor, setDayColor] = useState<string>(localStorage.getItem("dayColor") || "#1A3C34");
  const [textColor, setTextColor] = useState<string>(localStorage.getItem("textColor") || "#000000");
  const [shadowColor, setShadowColor] = useState<string>(localStorage.getItem("shadowColor") || "#F4C430");

  const days: string[] = ["S", "M", "T", "W", "T", "F", "S"];
  const dayCycle: string[] = [...days, ...days, ...days, ...days, ...days].slice(0, 31);
  const dates: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
    localStorage.setItem("subjects", JSON.stringify(newSubjects));
  };

  const handleCheckboxChange = (subjectIndex: number, dayIndex: number) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[subjectIndex][dayIndex] = !newCheckboxes[subjectIndex][dayIndex];
    setCheckboxes(newCheckboxes);
    localStorage.setItem("checkboxes", JSON.stringify(newCheckboxes));
  };

  const handleLessonGridChange = (gridSetter: React.Dispatch<React.SetStateAction<string[][]>>, row: number, col: number, value: string) => {
    gridSetter((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = value;
      if (gridSetter === setLessonGrid1) localStorage.setItem("lessonGrid1", JSON.stringify(newGrid));
      if (gridSetter === setLessonGrid2) localStorage.setItem("lessonGrid2", JSON.stringify(newGrid));
      if (gridSetter === setLessonGrid3) localStorage.setItem("lessonGrid3", JSON.stringify(newGrid));
      if (gridSetter === setLessonGrid4) localStorage.setItem("lessonGrid4", JSON.stringify(newGrid));
      return newGrid;
    });
  };

  const handleHeaderFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setHeaderFont(value);
    localStorage.setItem("headerFont", value);
  };

  const handleFixedFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFixedFont(value);
    localStorage.setItem("fixedFont", value);
  };

  const handleDayFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDayFont(value);
    localStorage.setItem("dayFont", value);
  };

  const handleTextBoxFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTextBoxFont(value);
    localStorage.setItem("textBoxFont", value);
  };

  const handleTextBoxFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTextBoxFontSize(value);
    localStorage.setItem("textBoxFontSize", value.toString());
  };

  const handleTextBoxAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTextBoxAlignment(value);
    localStorage.setItem("textBoxAlignment", value);
  };

  const handleMonthColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthColor(value);
    localStorage.setItem("monthColor", value);
  };

  const handleDayColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDayColor(value);
    localStorage.setItem("dayColor", value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextColor(value);
    localStorage.setItem("textColor", value);
  };

  const handleShadowColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShadowColor(value);
    localStorage.setItem("shadowColor", value);
  };

  const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentName(value);
    localStorage.setItem("studentName", value);
  };

  const handleLessonSubject1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLessonSubject1(value);
    localStorage.setItem("lessonSubject1", value);
  };

  const handleLessonSubject2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLessonSubject2(value);
    localStorage.setItem("lessonSubject2", value);
  };

  const handleLessonSubject3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLessonSubject3(value);
    localStorage.setItem("lessonSubject3", value);
  };

  const handleLessonSubject4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLessonSubject4(value);
    localStorage.setItem("lessonSubject4", value);
  };

  const headerStyle = {
    fontFamily: `${headerFont}, cursive`,
    color: monthColor,
  };

  const fixedStyle = {
    fontFamily: `${fixedFont}, cursive`,
    color: textColor,
  };

  const dayStyle = {
    fontFamily: `${dayFont}, cursive`,
    color: dayColor,
  };

  const textBoxStyle = {
    fontFamily: `${textBoxFont}, cursive`,
    color: textColor,
    fontSize: `${textBoxFontSize}px`,
    textAlign: textBoxAlignment as 'left' | 'center' | 'right',
  };

  const customPanelStyle = {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#000000",
    textAlign: "center" as const,
  };

  const exportProfile = () => {
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
      fixedFont,
      dayFont,
      textBoxFont,
      textBoxFontSize,
      textBoxAlignment,
      monthColor,
      dayColor,
      textColor,
      shadowColor,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "profile.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

//Intentional error throwing location
console.log("Tracker state:", { studentName, subjects, headerFont, monthColor });

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded cursor-pointer z-20"
      >
        Customize
      </button>

      {showSettings && (
        <div className="custom-panel">
          <h3 className="text-lg font-bold mb-2" style={customPanelStyle}>Customization</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="mt-2 bg-red-500 text-white p-1 rounded"
            style={customPanelStyle}
          >
            Close
          </button>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Header Font:</label>
            <select
              value={headerFont}
              onChange={handleHeaderFontChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            >
              <option value="Sacramento">Sacramento</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Lobster">Lobster</option>
              <option value="Caveat">Caveat</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Allura">Allura</option>
              <option value="Amatic SC">Amatic SC</option>
              <option value="Architects Daughter">Architects Daughter</option>
              <option value="Bad Script">Bad Script</option>
              <option value="Bilbo">Bilbo</option>
              <option value="Cinzel Decorative">Cinzel Decorative</option>
              <option value="Courgette">Courgette</option>
              <option value="Crafty Girls">Crafty Girls</option>
              <option value="Fredericka the Great">Fredericka the Great</option>
              <option value="Handlee">Handlee</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Josefin Slab">Josefin Slab</option>
              <option value="Kaushan Script">Kaushan Script</option>
              <option value="Lora">Lora</option>
              <option value="Merienda">Merienda</option>
              <option value="Montez">Montez</option>
              <option value="Nothing You Could Do">Nothing You Could Do</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Playball">Playball</option>
              <option value="Quicksand">Quicksand</option>
              <option value="Roboto Slab">Roboto Slab</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Fixed Font:</label>
            <select
              value={fixedFont}
              onChange={handleFixedFontChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            >
              <option value="Sacramento">Sacramento</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Lobster">Lobster</option>
              <option value="Caveat">Caveat</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Allura">Allura</option>
              <option value="Amatic SC">Amatic SC</option>
              <option value="Architects Daughter">Architects Daughter</option>
              <option value="Bad Script">Bad Script</option>
              <option value="Bilbo">Bilbo</option>
              <option value="Cinzel Decorative">Cinzel Decorative</option>
              <option value="Courgette">Courgette</option>
              <option value="Crafty Girls">Crafty Girls</option>
              <option value="Fredericka the Great">Fredericka the Great</option>
              <option value="Handlee">Handlee</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Josefin Slab">Josefin Slab</option>
              <option value="Kaushan Script">Kaushan Script</option>
              <option value="Lora">Lora</option>
              <option value="Merienda">Merienda</option>
              <option value="Montez">Montez</option>
              <option value="Nothing You Could Do">Nothing You Could Do</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Playball">Playball</option>
              <option value="Quicksand">Quicksand</option>
              <option value="Roboto Slab">Roboto Slab</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Days Font:</label>
            <select
              value={dayFont}
              onChange={handleDayFontChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            >
              <option value="Sacramento">Sacramento</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Lobster">Lobster</option>
              <option value="Caveat">Caveat</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Allura">Allura</option>
              <option value="Amatic SC">Amatic SC</option>
              <option value="Architects Daughter">Architects Daughter</option>
              <option value="Bad Script">Bad Script</option>
              <option value="Bilbo">Bilbo</option>
              <option value="Cinzel Decorative">Cinzel Decorative</option>
              <option value="Courgette">Courgette</option>
              <option value="Crafty Girls">Crafty Girls</option>
              <option value="Fredericka the Great">Fredericka the Great</option>
              <option value="Handlee">Handlee</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Josefin Slab">Josefin Slab</option>
              <option value="Kaushan Script">Kaushan Script</option>
              <option value="Lora">Lora</option>
              <option value="Merienda">Merienda</option>
              <option value="Montez">Montez</option>
              <option value="Nothing You Could Do">Nothing You Could Do</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Playball">Playball</option>
              <option value="Quicksand">Quicksand</option>
              <option value="Roboto Slab">Roboto Slab</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Text Box Font:</label>
            <select
              value={textBoxFont}
              onChange={handleTextBoxFontChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            >
              <option value="Sacramento">Sacramento</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Lobster">Lobster</option>
              <option value="Caveat">Caveat</option>
              <option value="Great Vibes">Great Vibes</option>
              <option value="Allura">Allura</option>
              <option value="Amatic SC">Amatic SC</option>
              <option value="Architects Daughter">Architects Daughter</option>
              <option value="Bad Script">Bad Script</option>
              <option value="Bilbo">Bilbo</option>
              <option value="Cinzel Decorative">Cinzel Decorative</option>
              <option value="Courgette">Courgette</option>
              <option value="Crafty Girls">Crafty Girls</option>
              <option value="Fredericka the Great">Fredericka the Great</option>
              <option value="Handlee">Handlee</option>
              <option value="Indie Flower">Indie Flower</option>
              <option value="Josefin Slab">Josefin Slab</option>
              <option value="Kaushan Script">Kaushan Script</option>
              <option value="Lora">Lora</option>
              <option value="Merienda">Merienda</option>
              <option value="Montez">Montez</option>
              <option value="Nothing You Could Do">Nothing You Could Do</option>
              <option value="Parisienne">Parisienne</option>
              <option value="Playball">Playball</option>
              <option value="Quicksand">Quicksand</option>
              <option value="Roboto Slab">Roboto Slab</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Text Box Alignment:</label>
            <select
              value={textBoxAlignment}
              onChange={handleTextBoxAlignmentChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Text Box Font Size (px):</label>
            <input
              type="range"
              min="12"
              max="20"
              value={textBoxFontSize}
              onChange={handleTextBoxFontSizeChange}
              className="w-full"
              style={textBoxStyle}
            />
            <span style={textBoxStyle}>{textBoxFontSize}px</span>
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Month Color:</label>
            <input
              type="color"
              value={monthColor}
              onChange={handleMonthColorChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Day Color:</label>
            <input
              type="color"
              value={dayColor}
              onChange={handleDayColorChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Text Color:</label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" style={customPanelStyle}>Shadow Color:</label>
            <input
              type="color"
              value={shadowColor}
              onChange={handleShadowColorChange}
              className="w-full p-2 border rounded"
              style={textBoxStyle}
            />
          </div>
        </div>
      )}
<h1 className="text-3xl font-bold text-center mb-6">{APP.TITLE}</h1>
<Header headerFont={headerFont} monthColor={monthColor} />

      <div className="mb-4 w-1/4">
        <label className="paintbrush block text-xl font-medium" style={fixedStyle}>Student Name:</label>
        <input
          type="text"
          value={studentName}
          onChange={handleStudentNameChange}
          className="w-full p-2 border rounded"
          style={textBoxStyle}
        />
        <button onClick={exportProfile} className="bg-green-500 text-white p-2 rounded mt-2">Export Profile</button>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="paintbrush border p-2 text-center w-1/7" style={fixedStyle}>Subjects</th>
              {Array.from({ length: 31 }, (_, index) => (
                <th key={index} className={`paintbrush border p-1 text-center w-1/7 ${index % 7 === 0 ? 'week-start' : ''}`} style={dayStyle}>
                  <div className="day-header">{dayCycle[index]}</div>
                  <div className="date-header">{dates[index]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject: string, subjectIndex: number) => (
              <tr key={subjectIndex} className="border">
                <td className="border p-2 w-1/7">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                    className={`p-1 border rounded ${subjectIndex % 2 === 1 ? "w-3/4 ml-4" : "w-70%"}`}
                    style={textBoxStyle}
                  />
                </td>
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <td key={dayIndex} className={`border p-1 text-center ${dayIndex % 7 === 0 ? 'week-start' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checkboxes[subjectIndex][dayIndex]}
                      onChange={() => handleCheckboxChange(subjectIndex, dayIndex)}
                      className="rounded-full"
                      style={{ borderColor: textColor, backgroundColor: checkboxes[subjectIndex][dayIndex] ? textColor : '#fff' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex space-x-4">
        <div className="flex-1">
          <label className="paintbrush block text-xl font-medium" style={fixedStyle}>Subject:</label>
          <input
            type="text"
            value={lessonSubject1}
            onChange={handleLessonSubject1Change}
            className="w-full p-2 border rounded mb-2"
            style={textBoxStyle}
          />
          <div className="grid grid-cols-3 gap-1 lesson-grid">
            {lessonGrid1.map((row: string[], rowIndex: number) =>
              row.map((cell: string, colIndex: number) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleLessonGridChange(setLessonGrid1, rowIndex, colIndex, e.target.value)}
                  className="lesson-grid p-1 border rounded"
                  style={textBoxStyle}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="paintbrush block text-xl font-medium" style={fixedStyle}>Subject:</label>
          <input
            type="text"
            value={lessonSubject2}
            onChange={handleLessonSubject2Change}
            className="w-full p-2 border rounded mb-2"
            style={textBoxStyle}
          />
          <div className="grid grid-cols-3 gap-1 lesson-grid">
            {lessonGrid2.map((row: string[], rowIndex: number) =>
              row.map((cell: string, colIndex: number) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleLessonGridChange(setLessonGrid2, rowIndex, colIndex, e.target.value)}
                  className="lesson-grid p-1 border rounded"
                  style={textBoxStyle}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="paintbrush block text-xl font-medium" style={fixedStyle}>Subject:</label>
          <input
            type="text"
            value={lessonSubject3}
            onChange={handleLessonSubject3Change}
            className="w-full p-2 border rounded mb-2"
            style={textBoxStyle}
          />
          <div className="grid grid-cols-3 gap-1 lesson-grid">
            {lessonGrid3.map((row: string[], rowIndex: number) =>
              row.map((cell: string, colIndex: number) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleLessonGridChange(setLessonGrid3, rowIndex, colIndex, e.target.value)}
                  className="lesson-grid p-1 border rounded"
                  style={textBoxStyle}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="paintbrush block text-xl font-medium" style={fixedStyle}>Subject:</label>
          <input
            type="text"
            value={lessonSubject4}
            onChange={handleLessonSubject4Change}
            className="w-full p-2 border rounded mb-2"
            style={textBoxStyle}
          />
          <div className="grid grid-cols-3 gap-1 lesson-grid">
            {lessonGrid4.map((row: string[], rowIndex: number) =>
              row.map((cell: string, colIndex: number) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleLessonGridChange(setLessonGrid4, rowIndex, colIndex, e.target.value)}
                  className="lesson-grid p-1 border rounded"
                  style={textBoxStyle}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App(){
  return <Tracker />;
}

export default App;