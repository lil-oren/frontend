import React, { Dispatch, SetStateAction, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import styles from './QuantityController.module.css';

interface QuantityControllerProps extends React.HTMLAttributes<HTMLDivElement> {
  inputValue: number | '';
  setInputValue: Dispatch<SetStateAction<number | ''>>;
  maximum: number;
  handleMaximumValid?: (sing: 'minus' | 'plus') => void;
}

function QuantityController({
  inputValue,
  setInputValue,
  maximum,
  handleMaximumValid,
}: QuantityControllerProps) {
  const [isInput, setIsInput] = useState<boolean>(false);

  function handleMinus() {
    if (handleMaximumValid !== undefined) {
      handleMaximumValid('minus');
      return;
    }
    setInputValue((prev) => (prev === '' ? 1 : prev - 1));
  }
  function handlePlus() {
    if (handleMaximumValid !== undefined) {
      handleMaximumValid('plus');
      return;
    }
    setInputValue((prev) => (prev === '' ? 1 : prev + 1));
  }

  function handleNumeKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      if (inputValue === '' || isNaN(inputValue)) {
        setInputValue(1);
        setIsInput(false);
      } else {
        setIsInput(false);
      }
    }
  }

  function handleBlurInput() {
    if (inputValue === '' || isNaN(inputValue)) {
      setInputValue(1);
      setIsInput(false);
    } else {
      setIsInput(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (/^\s+$/.test(value) || value === '') {
      setInputValue('');
      return;
    }
    const numValue = parseInt(value);
    if (numValue < 1) {
      setInputValue(1);
    } else if (numValue >= maximum) {
      setInputValue(maximum);
    } else {
      setInputValue(numValue);
    }
  }
  return (
    <div className="p-1 bg-input flex items-center gap-5 w-fit lg:gap-5 h-11 xl:h-12">
      <button
        onClick={handleMinus}
        disabled={inputValue === '' || inputValue <= 1}
        className="text-primary disabled:text-[#777777] disabled:cursor-not-allowed"
      >
        <Minus className="w-5 h-5" />
      </button>
      {isInput ? (
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => handleChange(e)}
          onBlur={handleBlurInput}
          onKeyDown={(e) => handleNumeKeydown(e)}
          min={1}
          className={`${styles.hideIndicator} text-sm font-semibold lg:text-lg w-10 text-center bg-transparent p-1 duration-300 sm:text-base sm:w-14 lg:w-16`}
          autoFocus={true}
          onWheel={(e) => e.currentTarget.blur()}
        />
      ) : (
        <p
          className="text-sm font-semibold lg:text-lg w-10 text-center sm:text-base sm:w-14 lg:w-16"
          onClick={() => setIsInput(true)}
        >
          {inputValue}
        </p>
      )}

      <button
        onClick={handlePlus}
        disabled={
          inputValue === '' ||
          (inputValue >= maximum && handleMaximumValid === undefined)
        }
        className={`disabled:text-[#777777] disabled:cursor-not-allowed  ${
          inputValue === '' || inputValue >= maximum
            ? 'text-[#777777] cursor-not-allowed'
            : 'text-primary'
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

export default QuantityController;
