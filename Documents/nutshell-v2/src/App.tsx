import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { COLORS, FONTS, APP } from './config';
import ChartComponent from './ChartComponent';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const resetTracker = () => {
  setStudentName("");
  setSubjects([]);
  setCheckboxes([]);
  setLessonSubject1(""); // Reset lesson subject fields
  setLessonSubject2("");
  setLessonSubject3("");
  setLessonSubject4("");
  setLessonGrid1(Array(3).fill([]).map(() => Array(3).fill(""))); // Reset lesson grids
  setLessonGrid2(Array(3).fill([]).map(() => Array(3).fill("")));
  setLessonGrid3(Array(3).fill([]).map(() => Array(3).fill("")));
  setLessonGrid4(Array(3).fill([]).map(() => Array(3).fill("")));
  setHeaderFont(FONTS.DEFAULT_HEADER_FONT);
  setMonthColor(COLORS.DEFAULT_MONTH_COLOR);
  localStorage.clear();
};

  const days: string[] = ["S", "M", "T", "W", "T", "F", "S"];
  const dayCycle: string[] = [...days, ...days, ...days, ...days, ...days].slice(0, 31);
  const dates: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  const addSubject = () => {
  setSubjects((prevSubjects) => {
    const newSubjects = [...prevSubjects, `Subject ${prevSubjects.length + 1}`];
    setCheckboxes((prevCheckboxes) => [...prevCheckboxes, Array(31).fill(false)]);
    setCompletedLessons((prevLessons) => ({
      ...prevLessons,
      [`Subject ${newSubjects.length}`]: Array.from({ length: 3 }, () => Array(5).fill("")),
    }));
    return newSubjects;
  });
};

  const handleSubjectChange = (index: number, value: string) => {
  setSubjects((prevSubjects) => {
    const oldSubject = prevSubjects[index];
    const newSubjects = [...prevSubjects];
    newSubjects[index] = value;

    // Update completedLessons to rename the key
    if (oldSubject !== value) {
      setCompletedLessons((prevLessons) => {
        const { [oldSubject]: oldGrid, ...rest } = prevLessons;
        const newGrid = oldGrid || Array.from({ length: 3 }, () => Array(5).fill(""));
        return {
          ...rest,
          [value]: newGrid,
        };
      });

      // Update selectedSubject if it matches the old subject
      if (selectedSubject === oldSubject) {
        setSelectedSubject(value);
      }
    }

    return newSubjects;
  });
};

  const handleCheckboxChange = (subjectIndex: number, dayIndex: number) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[subjectIndex][dayIndex] = !newCheckboxes[subjectIndex][dayIndex];
    setCheckboxes(newCheckboxes);
    localStorage.setItem("checkboxes", JSON.stringify(newCheckboxes));
  };

  const [completedLessons, setCompletedLessons] = useState<Record<string, string[][]>>({
  Math: Array.from({ length: 3 }, () => Array(5).fill("")),
  History: Array.from({ length: 3 }, () => Array(5).fill("")),
  English: Array.from({ length: 3 }, () => Array(5).fill("")),
  Writing: Array.from({ length: 3 }, () => Array(5).fill("")),
  French: Array.from({ length: 3 }, () => Array(5).fill("")),
});

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

  const handleCompletedLessonChange = (rowIndex: number, colIndex: number, value: string) => {
  if (selectedSubject) {
    setCompletedLessons((prev) => {
      const currentGrid = prev[selectedSubject] || Array.from({ length: 3 }, () => Array(5).fill(""));
      return {
        ...prev,
        [selectedSubject]: currentGrid.map((row, i) =>
          i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
        ),
      };
    });
  }
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
  const exportToPDF = () => {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font and initial position
  doc.setFont("helvetica");
  doc.setFontSize(12);

  // Add title
  doc.text("Nutshell Tracker Report", 105, 20, { align: "center" });

  // Add student name
  doc.text(`Student Name: ${studentName || "N/A"}`, 20, 30);

  // Add tracker table
  const startY = 40;
  doc.text("Tracker Table", 20, startY - 5);
  const tableData = [
    ["Subject", ...dates.map(String)],
    ...subjects
      .map((subject, idx) => [subject || "", ...checkboxes[idx].map(checked => (checked ? "✓" : ""))])
      .filter(row => row[0]),
  ];
  autoTable(doc, {
    startY: startY,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [200, 200, 200] },
    columnStyles: {
      0: { cellWidth: 30 },
      ...Object.fromEntries(dates.map((_, i) => [i + 1, { cellWidth: 6 }])),
    },
    margin: { left: 20, right: 20 },
  });

  // Add progress summary
  let progressStartY = (doc as any).lastAutoTable?.finalY + 10 || startY + 50; // Fallback if lastAutoTable is undefined
  doc.text("Progress Summary", 20, progressStartY - 5);
  const progressData = [
  ["Subject", "Completion (%)"],
  ...subjects
    .map((subject, idx) => {
      if (!subject) return null;
      const checked = checkboxes[idx]?.filter(Boolean).length || 0;
      const percentage = Math.round((checked / 31) * 100);
      return [subject, `${percentage}%`];
    })
    .filter((row): row is string[] => row !== null), // Type guard to exclude null
];
  autoTable(doc, {
    startY: progressStartY,
    head: [progressData[0]],
    body: progressData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 20, right: 20 },
  });

  // Add lesson grids
  let lessonStartY = (doc as any).lastAutoTable?.finalY + 10 || progressStartY + 50; // Fallback if lastAutoTable is undefined
  doc.text("Lesson Grids", 20, lessonStartY - 5);
  const lessonGrids = [
    { title: `Lesson Grid 1: ${lessonSubject1 || "N/A"}`, data: lessonGrid1 },
    { title: `Lesson Grid 2: ${lessonSubject2 || "N/A"}`, data: lessonGrid2 },
    { title: `Lesson Grid 3: ${lessonSubject3 || "N/A"}`, data: lessonGrid3 },
    { title: `Lesson Grid 4: ${lessonSubject4 || "N/A"}`, data: lessonGrid4 },
  ];
  lessonGrids.forEach((grid, index) => {
    // Check if we need a new page
    if (lessonStartY > 250) {
      doc.addPage();
      lessonStartY = 20;
    }
    doc.text(grid.title, 20, lessonStartY);
    autoTable(doc, {
      startY: lessonStartY + 5,
      body: grid.data,
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
      },
      margin: { left: 20, right: 20 },
    });
    lessonStartY = (doc as any).lastAutoTable?.finalY + 10 || lessonStartY + 30; // Fallback if lastAutoTable is undefined
  });

  // Save the PDF
  doc.save("Nutshell_Tracker_Report.pdf");
};
   console.log("Tracker state:", { studentName, subjects, headerFont, monthColor });


const setDefaultSettings = () => {
  setHeaderFont("Arial");
  setFixedFont("Arial");
  setDayFont("Arial");
  setTextBoxFont("Arial");
  setTextBoxFontSize(16);
  setTextBoxAlignment("left");
  setMonthColor("#000000");
  setDayColor("#000000");
  setTextColor("#000000");
  setShadowColor("#000000");
  localStorage.setItem("headerFont", "Arial");
  localStorage.setItem("fixedFont", "Arial");
  localStorage.setItem("dayFont", "Arial");
  localStorage.setItem("textBoxFont", "Arial");
  localStorage.setItem("textBoxFontSize", "16");
  localStorage.setItem("textBoxAlignment", "left");
  localStorage.setItem("monthColor", "#000000");
  localStorage.setItem("dayColor", "#000000");
  localStorage.setItem("textColor", "#000000");
  localStorage.setItem("shadowColor", "#000000");
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
    monthColor,
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
    setStudentName(profile.studentName);
    setSubjects(profile.subjects);
    setCheckboxes(profile.checkboxes);
    setLessonSubject1(profile.lessonSubject1);
    setLessonSubject2(profile.lessonSubject2);
    setLessonSubject3(profile.lessonSubject3);
    setLessonSubject4(profile.lessonSubject4);
    setLessonGrid1(profile.lessonGrid1);
    setLessonGrid2(profile.lessonGrid2);
    setLessonGrid3(profile.lessonGrid3);
    setLessonGrid4(profile.lessonGrid4);
    setHeaderFont(profile.headerFont);
    setMonthColor(profile.monthColor);
    alert("Profile loaded!");
  } else {
    alert("Profile not found!");
  }
};

// UI below
return (
  <div className="container mx-auto p-2 sm:p-4 bg-gray-100 min-h-screen relative">
    <button
      onClick={() => setShowSettings(!showSettings)}
      className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-500 text-white p-1 sm:p-2 rounded cursor-pointer z-20 w-24 sm:w-32 text-sm sm:text-base"
    >
      Customize
    </button>

    {showSettings && (
      <div className="custom-panel fixed inset-0 bg-white p-2 sm:p-4 overflow-y-auto z-30 sm:max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-bold mb-2" style={customPanelStyle}>Customization</h3>
        <button
          onClick={() => setShowSettings(false)}
          className="mt-1 sm:mt-2 bg-red-500 text-white p-1 sm:p-2 rounded text-sm sm:text-base"
          style={customPanelStyle}
        >
          Close
        </button>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Header Font:</label>
          <select
            value={headerFont}
            onChange={handleHeaderFontChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
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
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Fixed Font:</label>
          <select
            value={fixedFont}
            onChange={handleFixedFontChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
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
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Days Font:</label>
          <select
            value={dayFont}
            onChange={handleDayFontChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
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
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Text Box Font:</label>
          <select
            value={textBoxFont}
            onChange={handleTextBoxFontChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
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
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Text Box Alignment:</label>
          <select
            value={textBoxAlignment}
            onChange={handleTextBoxAlignmentChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
            style={textBoxStyle}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Text Box Font Size (px):</label>
          <input
            type="range"
            min="12"
            max="20"
            value={textBoxFontSize}
            onChange={handleTextBoxFontSizeChange}
            className="w-full"
            style={textBoxStyle}
          />
          <span className="text-sm sm:text-base" style={textBoxStyle}>{textBoxFontSize}px</span>
        </div>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Month Color:</label>
          <input
            type="color"
            value={monthColor}
            onChange={handleMonthColorChange}
            className="w-full p-1 sm:p-2 border rounded"
            style={textBoxStyle}
          />
        </div>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Day Color:</label>
          <input
            type="color"
            value={dayColor}
            onChange={handleDayColorChange}
            className="w-full p-1 sm:p-2 border rounded"
            style={textBoxStyle}
          />
        </div>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="w-full p-1 sm:p-2 border rounded"
            style={textBoxStyle}
          />
        </div>
        <div className="mb-2 sm:mb-4">
          <label className="block mb-1 text-sm sm:text-base" style={customPanelStyle}>Shadow Color:</label>
          <input
            type="color"
            value={shadowColor}
            onChange={handleShadowColorChange}
            className="w-full p-1 sm:p-2 border rounded"
            style={textBoxStyle}
          />
        </div>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={resetTracker}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
          >
            Reset Tracker
          </button>
          <button
            onClick={setDefaultSettings}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            Default Settings
          </button>
          <button
            onClick={saveProfile}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
          >
            Save Profile
          </button>
          <button
            onClick={loadProfile}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm sm:text-base"
          >
            Load Profile
          </button>
        </div>
      </div>
    )}

    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">{APP.TITLE}</h1>
    <Header headerFont={headerFont} monthColor={monthColor} />

    <div className="p-2 sm:p-4">
      {/* Student Name, Export Button Section */}
      <div className="w-full mb-4 sm:mb-8 flex flex-col sm:flex-row gap-2">
        <div className="max-w-xs">
          <label className="paintbrush block text-lg sm:text-xl font-medium" style={fixedStyle}>Student Name:</label>
          <input
            type="text"
            value={studentName}
            onChange={handleStudentNameChange}
            className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
            style={{ ...textBoxStyle, fontSize: "0.875rem" }}
          />
        </div>
        <button onClick={exportToPDF} className="bg-green-500 text-white p-1 sm:p-2 rounded max-w-xs text-sm sm:text-base">
          Export to PDF
        </button>
      </div>

      {/* Tracker Table Section */}
      <div className="tracker-table overflow-x-auto mb-4" style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <table className="min-w-[1000px] sm:min-w-[2000px] border-collapse">
          <thead>
            <tr>
              <th className="paintbrush border p-1 sm:p-2 text-center w-1/7" style={fixedStyle}>Subjects</th>
              {Array.from({ length: 31 }, (_, index) => (
                <th key={index} className={`paintbrush border p-0.5 sm:p-1 text-center w-1/7 ${index % 7 === 0 ? 'week-start' : ''}`} style={dayStyle}>
                  <div className="day-header text-xs sm:text-sm">{dayCycle[index]}</div>
                  <div className="date-header text-xs sm:text-sm">{dates[index]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject: string, subjectIndex: number) => (
              <tr key={subjectIndex} className="border">
                <td className="border p-1 sm:p-2 w-1/7">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                    className={`p-0.5 sm:p-1 border rounded text-xs sm:text-sm ${subjectIndex % 2 === 1 ? "w-3/4 ml-4" : "w-70%"}`}
                    style={textBoxStyle}
                  />
                </td>
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <td key={dayIndex} className={`border p-0.5 sm:p-1 text-center ${dayIndex % 7 === 0 ? 'week-start' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checkboxes[subjectIndex][dayIndex]}
                      onChange={() => handleCheckboxChange(subjectIndex, dayIndex)}
                      className="rounded-full w-3 h-3 sm:w-4 sm:h-4"
                      style={{ borderColor: textColor, backgroundColor: checkboxes[subjectIndex][dayIndex] ? textColor : '#fff' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Subject Button */}
      <button
        onClick={addSubject}
        className="px-2 sm:px-4 py-1 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 w-10 sm:w-12 mb-4 text-sm sm:text-base"
        aria-label="Add new subject and tracker row"
      >
        +
      </button>

      {/* Progress Summary */}
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2">Progress Summary</h2>
        <div className="chart-container" style={{ height: '200px' }}>
          {subjects.length > 0 && (
            <ChartComponent subjects={subjects} checkboxes={checkboxes} />
          )}
        </div>
      </div>

      {/* Completed Lessons Section */}
<div className="mt-4 sm:mt-6">
  <h2 className="text-lg sm:text-xl font-bold mb-2">Completed Lessons</h2>
  <div className="mb-2">
    <select
      value={selectedSubject || ""}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="w-full p-1 sm:p-2 border rounded text-sm sm:text-base"
      style={textBoxStyle}
    >
      <option value="">Select a Subject</option>
      {subjects.map((subject, index) => (
        <option key={index} value={subject}>{subject}</option>
      ))}
    </select>
  </div>
  {selectedSubject && (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2">
      {(completedLessons[selectedSubject] || Array.from({ length: 3 }, () => Array(5).fill(""))).map((row: string[], rowIndex: number) =>
        row.map((cell: string, colIndex: number) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            type="text"
            value={cell}
            onChange={(e) => handleCompletedLessonChange(rowIndex, colIndex, e.target.value)}
            className="p-0.5 sm:p-2 border rounded text-xs sm:text-base"
            style={{ ...textBoxStyle, fontSize: "0.75rem" }}
          />
        ))
      )}
    </div>
  )}
</div>
    </div>
  </div>
);
}
function App() {
  return <Tracker />;
}

export default App;