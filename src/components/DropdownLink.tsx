import { Menu } from '@headlessui/react';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface DropdownLinkProps extends NavLinkProps {
  isActive?: boolean;
  children: ReactNode;
}

const DropdownLink: FC<DropdownLinkProps> = ({ children, isActive, ...props }) => (
  <Menu.Item>
    {() => (
      <NavLink
        {...props}
        className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
          isActive ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}
      >
        {children}
      </NavLink>
    )}
  </Menu.Item>
);

interface DropdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const DropdownButton: FC<DropdownButtonProps> = ({ children, ...props }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

export default DropdownLink;
