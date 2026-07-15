// Export all images
import person from "./person.svg";
import addPerson from "./add-person.svg";
import pdf from "./pdf.svg";
import xls from "./xsl.svg";
import txt from "./txt.svg";

// Export as ICON object with properties
export const ICONS = {
  PERSON: person,
  PDF: pdf,
  XLS: xls,
  TXT: txt,
  ADD_PERSON: addPerson,
} as const;

// Default export for convenience
export default ICONS;
