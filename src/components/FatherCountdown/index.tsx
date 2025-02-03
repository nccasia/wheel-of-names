'use client';
import { useUser } from '@/hooks/useUser';
import { IUser, User } from '@/types';
import { setCookie } from 'cookies-next';
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
        setCookie('userInfo', JSON.stringify(userInfo), {
          maxAge: 2 * 24 * 60 * 60, // 2 days
        });
      }
    );
  }, []);
  return <></>;
};

export default FatherCountdown;
