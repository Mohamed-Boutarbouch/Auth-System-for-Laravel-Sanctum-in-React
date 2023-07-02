import { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

interface ErrorQueryResponse {
  message: string;
}

interface ErrorMutationResponse {
  message: string;
  errors: {
    email?: string[];
    password?: string[];
  };
}

export type ErrorQuery = AxiosError<ErrorQueryResponse>;

export type QueryResponse<T> = T | undefined;

export type ErrorMutation = AxiosError<ErrorMutationResponse>;

export interface Params {
  middleware?: 'guest' | 'auth';
  redirectIfAuthenticated?: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResendEmailVerificationParams {
  setStatus: Dispatch<SetStateAction<string | null>>;
}
