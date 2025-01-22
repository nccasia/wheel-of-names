'use client';
import { WheelComponent } from '@/components/WheelSpin';
import { useUser } from '@/hooks/useUser';
import { IUser, User } from '@/types';
import { useEffect } from 'react';

export default function Home() {
  const { setUserInfo } = useUser();

  useEffect(() => {
    window.Mezon?.WebView?.postEvent('PING', 'Ping', () => {
      console.log('Hello Mezon!');
    });

    window.Mezon?.WebView?.onEvent<{ user: IUser; wallet: string }>(
      'CURRENT_USER_INFO',
      (_, userData) => {
        if (!userData || !userData.user) {
          return;
        }
        const userInfo: User = {
          id: userData.user.id,
          name: userData.user.display_name,
          userName: userData.user.username,
        };
        setUserInfo(userInfo);
      }
    );
  }, []);
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
