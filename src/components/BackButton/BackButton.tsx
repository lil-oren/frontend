import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './BackButton.module.scss';

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  onClick: () => void;
}

const BackButton = ({ icon, onClick }: BackButtonProps) => {
  return (
    <button onClick={onClick} className={styles.back__button}>
      {icon}
    </button>
  );
};

export default BackButton;
