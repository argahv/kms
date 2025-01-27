export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCurrentWeek(): string[] {
  const today = new Date();
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - today.getDay() + i);
    week.push(formatDate(day));
  }
  return week;
}

