// Export all images
import person from "./person.svg";
import addPerson from "./add-person.svg";
import pdf from "./pdf.svg";
import xls from "./xsl.svg";
import txt from "./txt.svg";
import update from "./update.svg";
import calendarStats from "./calendar-stats.svg";
import closeCircle from "./close-circle.svg";
import userCircle from "./user-circle.svg";

// Export as ICON object with properties
export const ICONS = {
  PERSON: person,
  PDF: pdf,
  XLS: xls,
  TXT: txt,
  ADD_PERSON: addPerson,
  UPDATE: update,
  CALENDAR_STATS: calendarStats,
  CLOSE_CIRCLE: closeCircle,
  USER_CIRCLE: userCircle,
} as const;

// Default export for convenience
export default ICONS;
