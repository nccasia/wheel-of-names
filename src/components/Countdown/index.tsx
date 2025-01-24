'use client';
import { TimeConstants } from '@/constants/timeConstants';
import { checkNewYear } from '@/helpers';
import { useUser } from '@/hooks/useUser';
import { IUser, User } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Countdown = ({ setIsSpinning }: any) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showLuckyDraw, setShowLuckyDraw] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const lunarNewYear = new Date(TimeConstants.NEW_LUNAR_YEAR).getTime();
      const now = new Date().getTime();
      const difference = lunarNewYear - now;

      if (difference <= 0 || checkNewYear()) {
        setShowLuckyDraw(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    if (checkNewYear()) {
      setShowLuckyDraw(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-red-600 rounded-lg p-4 w-24">
      <div className="text-4xl font-bold text-yellow-300">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-white text-sm mt-1">{label}</div>
    </div>
  );

  return (
    <div className="lg:w-full lg:max-w-3xl mx-auto bg-red-500 rounded-xl shadow-lg p-4 lg:p-8">
      <h1 className="text-center text-white font-bold text-2xl mb-8">
        {showLuckyDraw
          ? '🎊 Chúc Mừng Năm Mới 2025! 🎊'
          : 'Đếm ngược nhận lì xì cùng NCC'}
      </h1>

      {!showLuckyDraw && (
        <div className="flex justify-center gap-4">
          <TimeBox value={timeLeft.days} label="Ngày" />
          <TimeBox value={timeLeft.hours} label="Giờ" />
          <TimeBox value={timeLeft.minutes} label="Phút" />
          <TimeBox value={timeLeft.seconds} label="Giây" />
        </div>
      )}

      {showLuckyDraw && (
        <div className="text-center">
          <button
            onClick={() => setIsSpinning(true)}
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-red-700 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Vào Nhận Lì Xì Ngay 🧧
          </button>
        </div>
      )}
    </div>
  );
};

export default Countdown;
