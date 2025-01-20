import { User } from '@/types';
import { createContext, useState } from 'react';

interface IUserType {
  userInfo: User | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<User | undefined>>;
}
const UserContext = createContext<IUserType | undefined>(undefined);
const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
