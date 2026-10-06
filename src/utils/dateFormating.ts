export const getTimeAgo = (createdAt: string | Date): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) {
    return 'только что';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${getPlural(diffMinutes, 'мин.', 'мин.', 'мин.')}`;
  } else if (diffHours < 24) {
    return `${diffHours} ${getPlural(diffHours, 'час', 'часа', 'часов')}`;
  } else if (diffDays < 7) {
    return `${diffDays} ${getPlural(diffDays, 'день', 'дня', 'дней')}`;
  } else {
    return `${diffWeeks} ${getPlural(diffWeeks, 'неделя', 'недели', 'недель')}`;
  }
};

function getPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
