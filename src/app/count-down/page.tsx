import Countdown from '@/components/Countdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Đếm ngược xuân Ất Tỵ 2025",
};

export default function CountDownPage() {
  
  return (
    <div
      className="flex flex-col items-center justify-center bg-cover h-screen max-w-none w-full flex-grow bg-no-repeat "
      style={{
        backgroundImage: "url('/images/hinhnen.jpg')",
      }}
    >
      <h1
        className="text-8xl font-extrabold  drop-shadow-lg animate-bounce"
        style={{
          WebkitTextStroke: '0.3px white',
          color: 'red',
        }}
      >
        Chúc Mừng Năm Mới
      </h1>
      <Countdown />
    </div>
  );
}
