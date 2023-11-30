import React, { ReactNode } from 'react';
import { Button } from '../ui/button';

interface AsyncButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  size?: 'default' | 'sm' | 'customBlank' | 'lg' | 'icon' | null | undefined;
  variant?:
    | 'default'
    | 'link'
    | 'tertiary'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
}

function AsyncButton({
  isLoading = false,
  children,
  onClick,
  size,
  variant = 'default',
  ...props
}: AsyncButtonProps) {
  if (isLoading) {
    return (
      <Button {...props} disabled variant={variant} size={size}>
        <div
          className={`mr-2 h-4 w-4 animate-spin border-4 border-b-transparent rounded-full ${
            variant === 'default' ? 'border-primary-foreground' : 'border-black'
          }`}
        />
        Loading
      </Button>
    );
  }

  return (
    <Button {...props} onClick={onClick} variant={variant} size={size}>
      {children}
    </Button>
  );
}

export default AsyncButton;
