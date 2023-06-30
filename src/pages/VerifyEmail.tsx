import ApplicationLogo from '../components/ApplicationLogo';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import GuestLayout from '../components/Layouts/GuestLayout';
import { useAuth } from '../hooks/auth';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const { logout, resendEmailVerification, status } = useAuth({
    middleware: 'auth',
  });

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link to="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
          </Link>
        }
      >
        <div className="mb-4 text-sm text-gray-600">
          Thanks for signing up! Before getting started, could you verify your email address by
          clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will
          gladly send you another.
        </div>
        {authStatus === 'verification-link-sent' && (
          <div className="mb-4 font-medium text-sm text-green-600">
            A new verification link has been sent to the email address you provided during
            registration.
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Button onClick={() => resendEmailVerification.mutate({ status })}>
            Resend Verification Email
          </Button>
          <button
            type="button"
            className="underline text-sm text-gray-600 hover:text-gray-900"
            onClick={logout.mutate}
          >
            Logout
          </button>
        </div>
      </AuthCard>
    </GuestLayout>
  );
};

export default VerifyEmail;
