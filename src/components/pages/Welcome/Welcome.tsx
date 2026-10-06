'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import Onboarding1Image from '@/../public/assets/images/onboarding-1.jpg';
import Onboarding2Image from '@/../public/assets/images/onboarding-2.jpg';
import Onboarding3Image from '@/../public/assets/images/onboarding-3.jpg';
import Onboarding4Image from '@/../public/assets/images/onboarding-4.jpg';
import Onboarding5Image from '@/../public/assets/images/onboarding-5.jpg';
import WelcomeStarIcon from '@/../public/assets/icons/welcome-star.svg';
import { Button } from '@/components/ui';
import { useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/BottomSheet';
import { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import './styles.css';
import { useUserStore } from '@/store';
import { parseStartParam } from '@/providers/TMA/utils';

export const Welcome = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const { push } = useRouter();
  const alreadyRegistered = useUserStore((state) => state.alreadyRegistered);
  const router = useRouter();

  useEffect(() => {
    if (isChecked && alreadyRegistered) {
      const { referrer, toProfile } = parseStartParam();
      if (toProfile && referrer) {
        router.push(`/profile/${referrer}?fromInvite=true`);
      } else {
        push('/feed');
      }
    }
  }, [isChecked, alreadyRegistered]);

  const handleCheck = () => {
    setIsChecked((prev) => !prev);
  };

  const onSubmit = async () => {
    if (isChecked) {
      const { referrer, toProfile } = parseStartParam();
      if (toProfile && referrer) {
        router.push(`/profile/${referrer}?fromInvite=true`);
      } else {
        push('/feed');
      }
    } else {
      setIsInvalid(true);
    }
  };

  if (alreadyRegistered) return null;

  return (
    <section className='flex h-screen flex-col'>
      <div className='relative min-h-0 flex-1'>
        <div className='absolute z-10 flex h-full w-full items-center justify-center px-4'>
          <h1 className='text-h05 flex flex-col items-center gap-2 text-white'>
            <span>Photon</span>
            <span>Путь к себе </span>
            <span className='flex items-center gap-1'>
              и своим <WelcomeStarIcon className='mt-2' />
            </span>
            <span>целям</span>
          </h1>
        </div>
        <Swiper
          className='h-full w-full'
          modules={[Autoplay]}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
        >
          {[
            Onboarding1Image,
            Onboarding2Image,
            Onboarding3Image,
            Onboarding4Image,
            Onboarding5Image,
          ].map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                className='h-full w-full rounded-b-3xl object-cover'
                src={image}
                alt=''
                priority
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='flex-none shrink-0 bg-white px-4 py-4'>
        <p className='text-l20 welcome-line-bg py-14 text-center text-black'>
          Попробуй новый формат социальной сети. Проявляй активность и
          зарабатывай крипту!
        </p>
        <Button
          onClick={onSubmit}
          className='mb-3'
          fullWidth
          size='large'
          variant='default'
        >
          Хочу попробовать
        </Button>
        <div className='flex items-start gap-2 pb-4'>
          <Input
            checked={isChecked}
            onChange={handleCheck}
            type='checkbox'
            invalid={isInvalid}
          />
          <span className='text-s10 text-[#A4A4A8]'>
            Архив интерфейса Photon. Информация об использовании:{' '}
            <a
              className='text-purple-dark'
              target='_blank'
              rel='noopener noreferrer'
              href='/terms-and-conditions.html'
            >
              Пользовательское соглашение
            </a>{' '}
            и{' '}
            <a
              className='text-purple-dark'
              target='_blank'
              rel='noopener noreferrer'
              href='/privacy-policy.html'
            >
              Политику конфиденциальности
            </a>
          </span>
        </div>
      </div>
    </section>
  );
};
