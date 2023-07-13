import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { AxiosError, isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

import {
  ErrorMutation,
  ErrorQuery,
  ForgotPasswordParams,
  LoginParams,
  Params,
  QueryResponse,
  RegisterParams,
  ResendEmailVerificationParams,
  ResetPasswordParams,
  User,
} from './auth-types';

export const useAuth = ({ middleware, redirectIfAuthenticated }: Params) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const [status, setStatus] = useState<string | null>('');
  const [errorMessages, setErrorMessages] = useState<string[] | null>([]);

  const user = useQuery<QueryResponse<User>, ErrorQuery>({
    queryKey: ['user'],
    queryFn: async (): Promise<QueryResponse<User>> => {
      try {
        const { data } = await axiosClient<User>('/user');
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

  const register = useMutation<void, ErrorMutation, RegisterParams>({
    mutationFn: async (props) => {
      await fetchCsrfToken();

      setErrorMessages([]);

      await axiosClient.post('/register', props);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as ErrorMutation;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const login = useMutation<void, ErrorMutation, LoginParams>({
    mutationFn: async (props) => {
      await fetchCsrfToken();

      setErrorMessages([]);
      setStatus(null);

      await axiosClient.post('/login', props);
      await user?.refetch();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as ErrorMutation;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const forgotPassword = useMutation<void, ErrorMutation, ForgotPasswordParams>({
    mutationFn: async (prop) => {
      await fetchCsrfToken();

      setErrorMessages([]);
      setStatus(null);

      const { data } = await axiosClient.post('/forgot-password', prop);
      setStatus(data.status);
    },
    onError: (error: AxiosError) => {
      if (isAxiosError(error)) {
        const err = error as ErrorMutation;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const resetPassword = useMutation<void, ErrorMutation, ResetPasswordParams>({
    mutationFn: async (props) => {
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
        const err = error as ErrorMutation;
        const errorMessages = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat()
          : [];
        setErrorMessages(errorMessages);
      }
    },
  });

  const resendEmailVerification = useMutation<void, unknown, ResendEmailVerificationParams>({
    mutationFn: async () => {
      const { data } = await axiosClient.post('/email/verification-notification');
      setStatus(data.status);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      if (!user?.error) {
        await fetchCsrfToken();
        await axiosClient.post('/logout');
      }
      window.location.pathname = '/login';
    },
    onSuccess: () => queryClient.removeQueries({ queryKey: ['user'] }),
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
  }, [user?.data, user?.error, logout, navigate, middleware, redirectIfAuthenticated]);

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
    setStatus,
  };
};
