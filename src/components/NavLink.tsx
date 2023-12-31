import { FC, ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface CustomNavLinkProps extends NavLinkProps {
  children: ReactNode;
}

const CustomNavLink: FC<CustomNavLinkProps> = ({ children, ...props }) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      isActive
        ? 'inline-flex items-center px-1 pt-1 border-b-2 ' +
          'text-sm font-medium leading-5 focus:outline-none transition ' +
          'duration-150 ease-in-out border-indigo-400 text-gray-900 focus:border-indigo-700'
        : 'inline-flex items-center px-1 pt-1 border-b-2 text-sm ' +
          'font-medium leading-5 focus:outline-none transition duration-150 ' +
          'ease-in-out border-transparent text-gray-500 hover:text-gray-700 ' +
          'hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
    }
  >
    {children}
  </NavLink>
);

export default CustomNavLink;
