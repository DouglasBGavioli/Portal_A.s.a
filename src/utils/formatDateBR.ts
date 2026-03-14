import { format, isValid, parseISO } from "date-fns";

export function formatDateBR(dateString: string): string {
  if (!dateString) {
    return "";
  }

  const parsedDate = parseISO(dateString);

  if (isValid(parsedDate)) {
    return format(parsedDate, "dd/MM/yyyy");
  }

  const [year, month, day] = dateString.split("T")[0].split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return dateString;
}
