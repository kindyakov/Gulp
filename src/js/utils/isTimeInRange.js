export function isTimeInRange(startTime, endTime) {
  // Преобразование текущего времени в минуты
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Преобразование входного времени в минуты
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Проверка, попадает ли текущее время в заданный диапазон
  if (startTotalMinutes <= endTotalMinutes) {
    return currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes;
  } else {
    return currentMinutes >= startTotalMinutes || currentMinutes <= endTotalMinutes;
  }
}
