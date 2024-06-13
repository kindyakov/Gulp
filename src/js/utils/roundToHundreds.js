export function roundToHundreds(number) {
  if (number < 100) {
    return number;
  }

  if (number % 100 === 0) {
    return number; // Возвращаем число без изменений
  }
  // Округляем число вниз до ближайшего кратного 100
  const roundedDown = Math.floor(number / 100) * 100;

  return roundedDown + 100;
}