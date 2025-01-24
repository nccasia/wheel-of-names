"use client";

import { useState } from "react";
import Countdown from "@/components/Countdown";
import FatherCountdown from "@/components/FatherCountdown";
import { WheelComponent } from "@/components/WheelSpin";

export default function HomePage() {
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center bg-cover h-screen max-w-none w-full flex-grow bg-no-repeat  gap-4 lg:gap-10"
      style={{
        backgroundImage: "url('/images/hinhnen.jpg')",
      }}
    >
      {!isSpinning && (
        <>
          <h1
            className=" text-6xl lg:text-8xl font-extrabold  drop-shadow-lg animate-bounce px-16"
            style={{
              WebkitTextStroke: "0.3px white",
              color: "red",
            }}
          >
            Chúc Mừng Năm Mới
          </h1>
          <FatherCountdown />
          <Countdown setIsSpinning={setIsSpinning} />
        </>
      )}
      {isSpinning && (
        <div className="relative z-10 w-full  px-4">
          <WheelComponent />
        </div>
      )}
    </div>
  );
}
