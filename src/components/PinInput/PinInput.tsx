import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './PinInput.module.css';

interface PinInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  pins: string[];
  setPins: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
  onEnter: () => void;
}

let currentActiveIndex: number = 0;
const PinInput = ({
  pins,
  setPins,
  isLoading = false,
  onEnter,
  ...props
}: PinInputProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const pinRef = useRef<HTMLInputElement>(null);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value } = target;
    const newPins: string[] = [...pins];
    newPins[currentActiveIndex] = value.substring(value.length - 1);

    if (!value) {
      setActiveIndex(currentActiveIndex - 1);
    } else {
      setActiveIndex(currentActiveIndex + 1);
    }
    setPins(newPins);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    currentActiveIndex = index;

    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      setActiveIndex(currentActiveIndex + 1);
    }
    if (e.key === 'Backspace' && !pins[index]) {
      setActiveIndex(currentActiveIndex - 1);
    }
    if (e.key === 'Enter') {
      onEnter();
    }
  }

  useEffect(() => {
    pinRef.current?.focus();
  }, [activeIndex]);
  return (
    <div className="flex items-center space-x-1">
      {pins.map((_, index) => (
        <input
          ref={index === activeIndex ? pinRef : null}
          key={index}
          type="number"
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          value={pins[index]}
          disabled={isLoading}
          onWheel={(e) => e.currentTarget.blur()}
          className={` ${styles.hideIndicator} aspect-square w-10 border-[1px] rounded bg-transparent outline-none text-center text-xl border-gray-500 focus:border-black focus:text-black text-gray-500 opacity-60 focus:opacity-100 sm:w-12 sm:text-2xl`}
          {...props}
        />
      ))}
    </div>
  );
};

export default PinInput;
