import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { AxiosError, isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

interface IErrorQuery {
  message: string;
}

type QueryResponse<T> = T | undefined;

interface ErrorMutationInterface {
  message: string;
  errors: {
    email?: string[];
    password?: string[];
  };
}

interface IParms {
  middleware?: 'guest' | 'auth';
  redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: IParms) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const [errorMessages, setErrorMessages] = useState<string[] | null>([]);
  const [status, setStatus] = useState<string[] | null>([]);

  const user = useQuery<QueryResponse<IUser>, AxiosError<IErrorQuery>>({
    queryKey: ['user'],
    queryFn: async (): Promise<QueryResponse<IUser>> => {
      try {
        const { data } = await axiosClient<IUser>('/user');
        return data;
      } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status !== 409) {
          throw error;
        }
        navigate('/verify-email');
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = !!user?.data;

  const fetchCsrfToken = () => axiosClient.get('/csrf-cookie');

  const register = useMutation({
    mutationFn: async ({
      ...props
    }: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      await fetchCsrfToken();

      setErrorMessages([]);

      await axiosClient.post('/register', props);
      user?.refetch();
    },
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as AxiosError<ErrorMutationInterface>;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const login = useMutation({
    mutationFn: async ({ ...props }: { email: string; password: string; remember: boolean }) => {
      await fetchCsrfToken();

      setErrorMessages([]);
      setStatus(null);

      await axiosClient.post('/login', props);
      await user?.refetch();
    },
    onSuccess: () => queryClient.invalidateQueries(['user']),
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as AxiosError<ErrorMutationInterface>;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      await fetchCsrfToken();

      setErrorMessages([]);
      setStatus(null);

      const response = await axiosClient.post('/forgot-password', { email });
      console.log(response.data.status);
    },
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as AxiosError<ErrorMutationInterface>;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({
      ...props
    }: {
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      await fetchCsrfToken();

      setErrorMessages([]);
      setStatus(null);

      const response = await axiosClient.post('/reset-password', {
        token: params.token,
        ...props,
      });
      navigate(`/login?reset=${btoa(response.data.status)}`);
    },
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as AxiosError<ErrorMutationInterface>;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const resendEmailVerification = useMutation({
    mutationFn: async () => {
      axiosClient
        .post('/email/verification-notification')
        .then((response) => setStatus(response.data.status));
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      if (!user?.error) {
        await fetchCsrfToken();
        await axiosClient.post('/logout');
      }
      navigate('/');
    },
    onSuccess: () => queryClient.removeQueries(['user']),
  });

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user?.data) {
      navigate(redirectIfAuthenticated);
    }
    if (
      window.location.pathname === '/verify-email' &&
      redirectIfAuthenticated &&
      user?.data?.email_verified_at
    ) {
      navigate(redirectIfAuthenticated);
    }
    if (middleware === 'auth' && user?.error) {
      logout.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data, user?.error]);

  return {
    user,
    isAuthenticated,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    errorMessages,
    status,
  };
};
