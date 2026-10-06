export function shortenString(str: string): string {
  if (str.length <= 5) return str;
  return `${str.slice(0, 3)}...${str.slice(-2)}`;
}
