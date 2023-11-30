import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { className } from '../../../node_modules/@sinonjs/commons/types/index.d';

interface ButtonWithIconIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  href?: string;
  className?: string;
  variant?:
    | 'default'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
}

const ButtonWithIcon: React.FC<ButtonWithIconIconProps> = ({
  children,
  className,
  href,
  variant,
  onClick,
}) => {
  return (
    <Button asChild onClick={onClick} variant={variant} className={className}>
      <Link href={href!}>{children}</Link>
    </Button>
  );
};

export default ButtonWithIcon;
