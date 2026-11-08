import { apiRequest } from './api';

export async function registerAccount(account) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(account),
  });
  return {
    user: response.data,
    confirmationEmailSent: Boolean(response.meta?.confirmationEmailSent),
    message: response.meta?.message || 'Account created successfully.',
  };
}

export async function signIn(credentials) {
  const { data } = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiRequest('/auth/me');
  return data;
}

export function signOut() {
  return apiRequest('/auth/logout', { method: 'POST' });
}
