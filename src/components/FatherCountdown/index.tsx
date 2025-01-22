'use client';
import { useUser } from '@/hooks/useUser';
import { IUser, User } from '@/types';
import React, { useEffect } from 'react';

const FatherCountdown = () => {
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
  return <></>;
};

export default FatherCountdown;
