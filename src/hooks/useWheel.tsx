'use client';
import { useState, useRef, useCallback, RefObject, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Wheel } from 'spin-wheel';
import { UseWheelReturn, WheelProps } from '../types';
import { GameRewards } from '@/constants/gameRewards';
import { toast } from 'react-toastify';
import { useUser } from './useUser';
import { getCookie } from 'cookies-next';

export const useWheel = (
  containerRef: RefObject<HTMLDivElement>
): UseWheelReturn => {
  const [names, _] = useState<string[]>(GameRewards.map((item) => item.text));
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const wheelRef = useRef<Wheel | null>(null);
  const { userInfo } = useUser();

  // Initialize wheel
  const initWheel = useCallback(() => {
    if (!containerRef.current || names.length === 0) return;

    if (wheelRef.current) {
      wheelRef.current.remove();
      wheelRef.current = null;
    }

    const items = names.map((name) => ({
      label: name,
      weight: 1,
      labelColor: '#000',
    }));
    const wheelProps: WheelProps = {
      items,
      radius: 1,
      borderColor: '#FFFFFF',
      borderWidth: 4,

      lineColor: '#FFFFFF',
      lineWidth: 1,
      pointerAngle: 90,
      itemLabelColors: ['#333'],
      itemBackgroundColors: [
        '#FF9999',
        '#99FF99',
        '#9999FF',
        '#FFFF99',
        '#FF99FF',
        '#99FFFF',
      ],

      itemLabelFont: 'Helvetica, Arial, sans-serif',
      itemLabelFontSizeMax: 24,
      rotationResistance: 0.95,
      rotationSpeedMax: 300,
      onRest: (event) => {
        setIsSpinning(false);
        setCurrentWinner(names[event.currentIndex]);
      },
    };

    wheelRef.current = new Wheel(containerRef.current, wheelProps);
  }, [names, containerRef]);
  const finalUserInfo =
    userInfo ||
    (() => {
      // Use cookies-next to get user info
      const storedUserInfo = getCookie('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo as string) : null;
    })();
  const spin = async () => {
    try {
      setIsSpinning(true);
      setCurrentWinner(null);
      const res = await fetch('/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalUserInfo),
      });
      const response = await res.json();
      if (response.data) {
        wheelRef.current.spinToItem(response.data.index, 5000, true, 8, 1);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update wheel when names change
  useEffect(() => {
    initWheel();
  }, [initWheel]);

  return {
    names,
    spin,
    isSpinning,
    currentWinner,
  };
};
