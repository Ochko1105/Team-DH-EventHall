export default function generateCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0).getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const weeks: { day: number; current: boolean }[][] = [];
  let currentWeek: { day: number; current: boolean }[] = [];

  for (let i = 0; i < startDay; i++) {
    currentWeek.push({
      day: prevLastDay - (startDay - 1 - i),
      current: false,
    });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    currentWeek.push({ day: d, current: true });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({ day: nextDay++, current: false });
    }
    weeks.push(currentWeek);
  }
  return weeks;
}
// bookingPrices.ts
