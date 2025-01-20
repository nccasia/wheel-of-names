'use client';

import { WinnerModalContext } from '@/context/winner';
import { useUser } from '@/hooks/useUser';
import { useWheel } from '@/hooks/useWheel';
import { useContext, useEffect, useRef } from 'react';
import DistiquesRouges from '../DistiquesRouges';
import HistorySpin from '../HistorySpin';

export const WheelComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useContext(WinnerModalContext);
  if (!context) return null;
  const { openModal } = context;
  const { names, spin, isSpinning, currentWinner } = useWheel(containerRef);
  useEffect(() => {
    if (currentWinner) {
      openModal(currentWinner);
    }
  }, [currentWinner]);
  const { userInfo } = useUser();

  return (
    <>
      {userInfo ? (
        <div className="w-full flex flex-col md:flex-row md:gap-8 lg:gap-20 items-center justify-between lg:px-20 px-6">
          {/* Left Distique */}
          <div className="hidden lg:block ">
            <DistiquesRouges text="Xuân sang cội phúc sinh nhành lộc" />
          </div>

          {/* Wheel Container */}
          <div className="w-full  relative p-4">
            <div className="aspect-square w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] mx-auto relative">
              <div
                ref={containerRef}
                className={`w-full h-full rounded-full relative  ${isSpinning ? 'disabled: true' : ''}  `}
              >
                {names.length >= 1 && (
                  <div className="absolute top-1/2 -right-5 sm:-right-7 md:-right-9 -translate-y-1/2 z-20">
                    <div className="w-0 h-0 border-t-[10px] sm:border-t-[15px] md:border-t-[20px] border-t-transparent border-b-[10px] sm:border-b-[15px] md:border-b-[20px] border-b-transparent border-r-[20px] sm:border-r-[30px] md:border-r-[40px] border-red-500" />
                  </div>
                )}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <HistorySpin />
                </div>
                {names.length >= 1 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                      onClick={spin}
                      className={`
                    h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24
                    disabled:opacity-50 transition-all duration-300 hover:scale-105
                    ${isSpinning ? 'animate-pulse' : ''} 
                    bg-blue-500 rounded-full border-4 border-white 
                    flex flex-col justify-center items-center 
                    disabled:opacity-50 shadow-lg
                  `}
                      disabled={isSpinning || names.length < 2}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                      <span className="font-bold text-sm sm:text-lg md:text-xl text-white">
                        Spin
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Distique */}
          <div className="hidden lg:block ">
            <DistiquesRouges text="Tết về cây đức trổ thêm hoa" />
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <h1
            className="text-5xl font-extrabold  drop-shadow-lg animate-bounce"
            style={{
              WebkitTextStroke: '0.3px white',
              color: 'red',
            }}
          >
            Vui lòng sử dụng ứng dụng Mezon để tham gia nhận lì xì
          </h1>
        </div>
      )}
    </>
  );
};
