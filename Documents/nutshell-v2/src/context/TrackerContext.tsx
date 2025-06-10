import React, { createContext, useReducer, useContext, ReactNode } from "react";

interface TrackerState {
  studentName: string;
  subjects: string[];
  checkboxes: boolean[][];
  lessonSubject1: string;
  lessonSubject2: string;
  lessonSubject3: string;
  lessonSubject4: string;
  lessonGrid1: string[][];
  lessonGrid2: string[][];
  lessonGrid3: string[][];
  lessonGrid4: string[][];
  headerFont: string;
  fixedFont: string;
  dayFont: string;
  textBoxFont: string;
  textBoxFontSize: number;
  textBoxAlignment: string;
  selectedSubject: string | null;
  showSettings: boolean;
  showResetConfirm: boolean;
  completedLessons: Record<string, string[][]>;
  features: { calendarEnabled: boolean; reportsEnabled: boolean };
}

type TrackerAction =
  | { type: "SET_STUDENT_NAME"; payload: string }
  | { type: "SET_SUBJECTS"; payload: string[] }
  | { type: "SET_CHECKBOXES"; payload: boolean[][] }
  | { type: "SET_LESSON_SUBJECT"; payload: { index: 1 | 2 | 3 | 4; value: string } }
  | { type: "SET_LESSON_GRID"; payload: { index: 1 | 2 | 3 | 4; value: string[][] } }
  | { type: "SET_FONT"; payload: { type: string; value: string } }
  | { type: "SET_TEXTBOX_STYLE"; payload: { type: "size" | "alignment"; value: number | string } }
  | { type: "SET_SELECTED_SUBJECT"; payload: string | null }
  | { type: "TOGGLE_SETTINGS" }
  | { type: "TOGGLE_RESET_CONFIRM" }
  | { type: "SET_COMPLETED_LESSONS"; payload: Record<string, string[][]> }
  | { type: "RESET_ALL" };

const initialState: TrackerState = {
  studentName: localStorage.getItem("studentName") || "",
  subjects: JSON.parse(localStorage.getItem("subjects") || JSON.stringify(Array(14).fill(""))),
  checkboxes: JSON.parse(
    localStorage.getItem("checkboxes") || JSON.stringify(Array(14).fill([]).map(() => Array(31).fill(false)))
  ),
  lessonSubject1: localStorage.getItem("lessonSubject1") || "",
  lessonSubject2: localStorage.getItem("lessonSubject2") || "",
  lessonSubject3: localStorage.getItem("lessonSubject3") || "",
  lessonSubject4: localStorage.getItem("lessonSubject4") || "",
  lessonGrid1: JSON.parse(localStorage.getItem("lessonGrid1") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))),
  lessonGrid2: JSON.parse(localStorage.getItem("lessonGrid2") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))),
  lessonGrid3: JSON.parse(localStorage.getItem("lessonGrid3") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))),
  lessonGrid4: JSON.parse(localStorage.getItem("lessonGrid4") || JSON.stringify(Array(3).fill([]).map(() => Array(3).fill("")))),
  headerFont: localStorage.getItem("headerFont") || "Sacramento",
  fixedFont: localStorage.getItem("fixedFont") || "Sacramento",
  dayFont: localStorage.getItem("dayFont") || "Sacramento",
  textBoxFont: localStorage.getItem("textBoxFont") || "Sacramento",
  textBoxFontSize: parseInt(localStorage.getItem("textBoxFontSize") || "16"),
  textBoxAlignment: localStorage.getItem("textBoxAlignment") || "left",
  selectedSubject: null,
  showSettings: false,
  showResetConfirm: false,
  completedLessons: {
    Math: Array.from({ length: 4 }, () => Array(4).fill("")),
    History: Array.from({ length: 4 }, () => Array(4).fill("")),
    English: Array.from({ length: 4 }, () => Array(4).fill("")),
    Writing: Array.from({ length: 4 }, () => Array(4).fill("")),
    French: Array.from({ length: 4 }, () => Array(4).fill("")),
  },
  features: { calendarEnabled: true, reportsEnabled: true },
};

const trackerReducer = (state: TrackerState, action: TrackerAction): TrackerState => {
  switch (action.type) {
    case "SET_STUDENT_NAME":
      localStorage.setItem("studentName", action.payload);
      return { ...state, studentName: action.payload };
    case "SET_SUBJECTS":
      localStorage.setItem("subjects", JSON.stringify(action.payload));
      return { ...state, subjects: action.payload };
    case "SET_CHECKBOXES":
      localStorage.setItem("checkboxes", JSON.stringify(action.payload));
      return { ...state, checkboxes: action.payload };
    case "SET_LESSON_SUBJECT":
      localStorage.setItem(`lessonSubject${action.payload.index}`, action.payload.value);
      return {
        ...state,
        [`lessonSubject${action.payload.index}`]: action.payload.value,
      };
    case "SET_LESSON_GRID":
      localStorage.setItem(`lessonGrid${action.payload.index}`, JSON.stringify(action.payload.value));
      return {
        ...state,
        [`lessonGrid${action.payload.index}`]: action.payload.value,
      };
    case "SET_FONT":
      localStorage.setItem(`${action.payload.type}Font`, action.payload.value);
      return { ...state, [action.payload.type + "Font"]: action.payload.value };
    case "SET_TEXTBOX_STYLE":
      localStorage.setItem(`textBox${action.payload.type.charAt(0).toUpperCase() + action.payload.type.slice(1)}`, action.payload.value.toString());
      return { ...state, [`textBox${action.payload.type.charAt(0).toUpperCase() + action.payload.type.slice(1)}`]: action.payload.value };
    case "SET_SELECTED_SUBJECT":
      return { ...state, selectedSubject: action.payload };
    case "TOGGLE_SETTINGS":
      return { ...state, showSettings: !state.showSettings };
    case "TOGGLE_RESET_CONFIRM":
      if (action.type === "TOGGLE_RESET_CONFIRM" && state.showResetConfirm) document.body.classList.remove("modal-open");
      else if (action.type === "TOGGLE_RESET_CONFIRM") document.body.classList.add("modal-open");
      return { ...state, showSettings: false, showResetConfirm: !state.showResetConfirm };
    case "SET_COMPLETED_LESSONS":
      return { ...state, completedLessons: action.payload };
    case "RESET_ALL":
      localStorage.clear();
      return initialState;
    default:
      return state;
  }
};

const TrackerContext = createContext<{
  state: TrackerState;
  dispatch: React.Dispatch<TrackerAction>;
} | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(trackerReducer, initialState);

  return <TrackerContext.Provider value={{ state, dispatch }}>{children}</TrackerContext.Provider>;
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) throw new Error("useTracker must be used within a TrackerProvider");
  return context;
};