// Export all images
import PersonIcon from "./person.svg";
import PdfIcon from "./pdf.svg";
import XlsIcon from "./xsl.svg";

// Export as ICON object with properties
export const ICONS = {
  PERSON: PersonIcon,
  PDF: PdfIcon,
  XLS: XlsIcon,
} as const;

// Default export for convenience
export default ICONS;
