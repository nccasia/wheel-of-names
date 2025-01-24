'use client';
import { WheelComponent } from '@/components/WheelSpin';

export default function Home() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hinhnen.jpg')",
        }}
      ></div>
      <div className="relative z-10 w-full  px-4">
        <WheelComponent />
      </div>
    </section>
  );
}
