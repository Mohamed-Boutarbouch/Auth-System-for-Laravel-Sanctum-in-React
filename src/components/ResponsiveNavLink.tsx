import { ReactNode, ButtonHTMLAttributes, FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface ResponsiveNavLinkProps extends NavLinkProps {
  children: ReactNode;
}

interface ResponsiveNavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const ResponsiveNavLink: FC<ResponsiveNavLinkProps> = ({ children, ...props }) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      isActive
        ? 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium ' +
          'leading-5 focus:outline-none transition duration-150 ease-in-out ' +
          'border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800' +
          ' focus:bg-indigo-100 focus:border-indigo-700'
        : 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium ' +
          'leading-5 focus:outline-none transition duration-150 ' +
          'ease-in-out border-transparent text-gray-600 hover:text-gray-800' +
          ' hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 ' +
          'focus:bg-gray-50 focus:border-gray-300'
    }
  >
    {children}
  </NavLink>
);

export const ResponsiveNavButton: FC<ResponsiveNavButtonProps> = ({ children, ...props }) => (
  <button
    className="block w-full pl-3 pr-4 py-2 border-l-4
     text-left text-base font-medium leading-5 focus:outline-none
     transition duration-150 ease-in-out border-transparent
     text-gray-600 hover:text-gray-800 hover:bg-gray-50
     hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300"
    {...props}
  >
    {children}
  </button>
);

export default ResponsiveNavLink;
