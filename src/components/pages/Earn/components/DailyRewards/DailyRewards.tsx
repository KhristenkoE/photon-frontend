import { Swiper, SwiperSlide } from 'swiper/react';
import { DailyRewardsItem } from '@/components/pages/Earn/components';
import { useDailyRewards } from '@/components/pages/Earn/hooks';

export const DailyRewards = () => {
  const rewards = useDailyRewards();
  return (
    <section className='pb-30'>
      <h2 className='text-h25 mt-7 mb-4 text-black'>Ежедневная награда</h2>
      <Swiper slidesPerView={3.5} spaceBetween={6} className='mySwiper'>
        {rewards.map((item) => (
          <SwiperSlide key={item.day}>
            <DailyRewardsItem
              reward={item.reward}
              day={item.day}
              isCollected={item.day < 3}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
