import { useTranslations } from 'next-intl';
import { TaskCategory } from '@/api/constants';

export function usePluralize() {
  const t = useTranslations('EarnPage.tasks');

  const pluralize = ({
    obj: { one, few, many },
    count,
  }: {
    count: number;
    obj: { one: string; few: string; many: string };
  }) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  };

  const withPlural = ({
    withTo,
    category,
    count,
  }: {
    count: number;
    category: TaskCategory;
    withTo?: boolean;
  }) => {
    const generateText = (name: TaskCategory): [string, string, string] => {
      const base: [string, string, string] = [
        t(`plurals.${name}`, { count }),
        t(`plurals.${name}_plural`, { count }),
        t(`plurals.${name}_plural_other`, { count }),
      ];

      if (!withTo) return base;

      return base.map((text) => `${t(`actions.to_${name}`)} ${text}`) as [
        string,
        string,
        string,
      ];
    };

    const [one, few, many] = generateText(category);
    return pluralize({ obj: { one, few, many }, count });
  };

  return { withPlural };
}
