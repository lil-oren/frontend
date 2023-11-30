import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextAreaWithLabelProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  placeHolder?: string;
  inputStyling?: string;
  labelStyling?: string;
  validation?: string;
  isValid?: boolean;
}

const TextAreaWithLabel = ({
  id,
  label,
  required = false,
  placeholder,
  inputStyling,
  labelStyling,
  validation,
  isValid,
  ...props
}: TextAreaWithLabelProps) => {
  return (
    <div className="w-full items-center flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-light w-full md:text-base">
        {label}
        {required ? <span className="text-primary">{' *'}</span> : null}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        className={inputStyling + 'peer w-full md:text-base md:h-12'}
        required={required}
        isValid={isValid}
        {...props}
      />
      {isValid === false && validation !== '' && (
        <p className="mt-1 w-full text-justify text-xs text-destructive md:text-sm">
          {validation}
        </p>
      )}
    </div>
  );
};

export default TextAreaWithLabel;
