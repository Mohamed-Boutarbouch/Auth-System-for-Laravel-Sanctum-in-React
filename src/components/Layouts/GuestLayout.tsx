import { FC, ReactNode } from 'react';

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: FC<GuestLayoutProps> = ({ children }) => (
  <div className="font-sans text-gray-900 antialiased">{children}</div>
);

export default GuestLayout;
