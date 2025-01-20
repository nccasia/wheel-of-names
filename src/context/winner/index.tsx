import ConfettiCanvas from '@/components/ConfettiCanvas';
import NotificationModal from '@/components/NotificationModal';
import { createContext, useState, ReactNode } from 'react';

interface WinnerModalContextProps {
  isOpen: boolean;
  amount: string;
  isOpenConfetti: boolean;
  openModal: (amount: string) => void;
  closeModalConfetti: () => void;
  closeModal: () => void;
}

const WinnerModalContext = createContext<WinnerModalContextProps | undefined>(
  undefined
);
const WinnerModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfetti, setIsOpenConfetti] = useState(false);

  const [amount, setAmount] = useState('');

  const openModal = (amount: string) => {
    setAmount(amount);
    setIsOpen(true);
    setIsOpenConfetti(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const closeModalConfetti = () => {
    setIsOpenConfetti(false);
  };

  return (
    <WinnerModalContext.Provider
      value={{
        isOpen,
        amount,
        openModal,
        closeModal,
        closeModalConfetti,
        isOpenConfetti,
      }}
    >
      {children}
      <NotificationModal />
      <ConfettiCanvas />
    </WinnerModalContext.Provider>
  );
};
export { WinnerModalContext, WinnerModalProvider };
