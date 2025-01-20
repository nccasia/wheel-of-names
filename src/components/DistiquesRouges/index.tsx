import React, { useState, useEffect } from 'react';
interface Prop {
  text: string;
}
const DistiquesRouges = ({ text }: Prop) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-start items-star lg:min-w-60 min-w-40 p-10">
      <div className="relative w-full max-w-64">
        <div
          className={`
          bg-yellow-50 
          rounded-lg 
          shadow-xl 
          transition-all 
          duration-1000 
          transform 
          ${isOpen ? 'h-auto' : 'h-20'}
          relative 
          overflow-hidden
          border-8 
          border-red-800
        `}
        >
          <div className="absolute top-0 left-0 w-full h-8 bg-red-800 flex justify-between items-center px-4">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
          <div
            className={`
            p-8 
            pt-12
            text-center 
            transition-opacity 
            duration-3000
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
          >
            {text.split(' ').map((item, index) => {
              return (
                <h1
                  key={index}
                  className="lg:text-4xl font-bold text-red-800 mb-8 text-xl"
                >
                  {item}
                </h1>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-8 bg-red-800 flex justify-between items-center px-4">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistiquesRouges;
