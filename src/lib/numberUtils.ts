export const shortenNumber = (
  value: number,
): { unit: string; value: number } | undefined => {
  if (value >= 1e9) {
    const shortened = value / 1e9;
    const rounded = +shortened.toFixed(isFloat(shortened) ? 1 : 0);

    return { unit: 'b', value: rounded };
  }
  if (value >= 1e6) {
    const shortened = value / 1e6;
    const rounded = +shortened.toFixed(isFloat(shortened) ? 1 : 0);

    return { unit: 'm', value: rounded };
  }
  if (value >= 1e3) {
    const shortened = value / 1e3;
    const rounded = +shortened.toFixed(isFloat(shortened) ? 1 : 0);

    return { unit: 'k', value: rounded };
  }
  return undefined;
};

export const isFloat = (n: number | string) => {
  return typeof n === 'number' && !Number.isInteger(n);
};
