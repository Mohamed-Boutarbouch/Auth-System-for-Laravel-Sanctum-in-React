import { ReactNode, HTMLAttributes, FC } from 'react';

interface AuthSessionStatusProps extends HTMLAttributes<HTMLDivElement> {
  status: ReactNode;
}

const AuthSessionStatus: FC<AuthSessionStatusProps> = ({ status, className, ...props }) => (
  <>
    {status && (
      <div className={`${className} font-medium text-sm text-green-600`} {...props}>
        {status}
      </div>
    )}
  </>
);

export default AuthSessionStatus;
