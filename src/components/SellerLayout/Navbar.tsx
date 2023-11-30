import React from 'react';
import { Menu } from 'lucide-react';
import classNames from 'classnames';
import Link from 'next/link';

interface NavbarProps {
  onMenuButtonClick: () => void;
}

const Navbar = (props: NavbarProps) => {
  return (
    <nav
      className={classNames({
        'bg-white text-zinc-500': true,
        'flex items-center': true,
        'w-full fixed z-10 px-4 shadow-sm h-16': true,
      })}
    >
      <Link
        href={'/'}
        className={'hidden md:block font-bold text-primary md:text-[24px]'}
      >
        LilOren
      </Link>
      <div className="flex-grow"></div>
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <Menu className="h-6 w-6" />
      </button>
    </nav>
  );
};

export default Navbar;
