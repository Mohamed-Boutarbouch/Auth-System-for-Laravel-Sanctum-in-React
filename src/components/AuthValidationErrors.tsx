import { FC } from 'react';

interface AuthValidationErrorsProps {
  errors: string[] | null;
  className: string;
}

const AuthValidationErrors: FC<AuthValidationErrorsProps> = ({ errors = [], ...props }) => {
  const errorMessages = Object.values(errors || {}).flat();
  return (
    <>
      {errorMessages.length > 0 && (
        <div {...props}>
          <div className="font-medium text-red-600">Whoops! Something went wrong.</div>
          <ul className="mt-3 list-disc list-inside text-sm text-red-600">
            {errorMessages.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AuthValidationErrors;
