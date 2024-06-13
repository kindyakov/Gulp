export function getFormattedDate(format = 'DD.MM.YYYY', date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const shortYear = year.toString().slice(-2);

  let formattedDate = format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year)
    .replace("YY", shortYear);

  return formattedDate;
}