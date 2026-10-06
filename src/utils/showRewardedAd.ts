import { useEarnTasksStore } from '@/store/earnTasksStore';
import { useEarnTaskBottomSheetStore } from '@/store/useEarnTaskBottomSheetStore';
import { TaskCategory } from '@/api/constants';

/**
 * Эта функция показывает rewarded рекламу и обрабатывает события жизненного цикла с помощью коллбэков.
 */
export const showRewardedAd = () => {
  if (typeof window === 'undefined' || !window.Sonar) return;

  window.Sonar.show({
    adUnit: (process.env.NEXT_PUBLIC_SONAR_UNIT_NAME ||
      'task_ad_view') as string, // Замените {bannerAdUnitName} на актуальное

    loader: true, // опционально, можно включать или отключать показ лоадера перед показом рекламы. По-умолчанию: true

    onStart: () => {
      // Добавьте логику для момента начала загрузки рекламы
    },

    onShow: () => {
      // Добавьте логику для момента, когда реклама становится видимой пользователю
    },

    onError: () => {
      // Обработайте ошибки, которые могут возникнуть во время жизненного цикла рекламы
    },

    onClose: () => {
      // Добавьте логику для момента, когда объявление закрылось (например, возобновить контент, показать следующую страницу)
    },

    onReward: () => {
      // Обработайте выдачу пользователю его награды (например, разблокировка контента или внутриигровой валюты)
    },
  }).then((result) => {
    // Здесь вы также можете обработать результат попытки показа рекламы с помощью Promise
    if (result.status === 'error') {
      console.error('Не удалось показать рекламу:', result.message); // Лог ошибки, если что-то пошло не так
    } else {
      const { tasks } = useEarnTasksStore.getState();
      const { updateHistory } = useEarnTaskBottomSheetStore.getState();

      const task = tasks.find((task) => task.category === TaskCategory.AdView);
      if (!task) return;

      updateHistory((task) => ({
        ...task,
        progress: Math.min((task.progress || 0) + 1, 5),
        receivable: true,
      }));
    }
  });
};
