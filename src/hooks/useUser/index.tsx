'use client';
import { useContext } from 'react';
import { UserContext } from '../../context/user';

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      'useGameSettings must be used within a GameSettingsProvider'
    );
  }
  return context;
};
