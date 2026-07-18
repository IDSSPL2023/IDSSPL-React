// Export all images
import person from "./person.svg";
import addPerson from "./add-person.svg";
import pdf from "./pdf.svg";
import xls from "./xsl.svg";
import txt from "./txt.svg";
import update from "./update.svg";
import calendar from "./calendar.svg";
import calendarStats from "./calendar-stats.svg";
import closeCircle from "./close-circle.svg";
import userCircle from "./user-circle.svg";
import userSquare from "./user-square.svg";
import messageLanguage from "./message-language.svg";
import personEdit from "./person-edit.svg"


// Export as ICON object with properties
export const ICONS = {
  PERSON: person,
  PDF: pdf,
  XLS: xls,
  TXT: txt,
  ADD_PERSON: addPerson,
  EDIT_PERSON: personEdit,
  UPDATE: update,
  CALENDAR: calendar,
  CALENDAR_STATS: calendarStats,
  CLOSE_CIRCLE: closeCircle,
  USER_CIRCLE: userCircle,
  USER_SQUARE: userSquare,
  MESSAGE_LANGUAGE: messageLanguage,
} as const;

// Default export for convenience
export default ICONS;
