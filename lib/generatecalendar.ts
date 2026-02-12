export default function generateCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Get days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const weeks: { day: number; current: boolean }[][] = [];
  let currentWeek: { day: number; current: boolean }[] = [];

  // Add days from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    currentWeek.push({ day: prevMonthLastDay - i, current: false });
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push({ day, current: true });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add days from next month
  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({ day: nextDay++, current: false });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}
