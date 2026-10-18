// Authentication service (frontend demo only).
// Accounts live in this browser's localStorage. Use a real backend for real authentication.
import { loadSaved, saveItem, removeItem } from './api';

// Demo accounts available the first time the application is opened.
export const DEMO_ACCOUNTS = [
  { name: 'Admin Demo', email: 'admin@unischedule.lk', password: 'admin123', role: 'Administrator' },
  { name: 'Lecturer Demo', email: 'lecturer@unischedule.lk', password: 'lecture123', role: 'Lecturer' },
  { name: 'Student Demo', email: 'student@unischedule.lk', password: 'student123', role: 'Student' },
];

// Built-in demo accounts + accounts created on this browser.
export function getAccounts() {
  const saved = loadSaved('accounts', []);
  const combined = [...DEMO_ACCOUNTS];
  (Array.isArray(saved) ? saved : []).forEach((account) => {
    if (!combined.some((item) => item.email.toLowerCase() === account.email.toLowerCase())) combined.push(account);
  });
  return combined;
}

// Create a new local account. Throws an Error with a user-friendly message when invalid.
export function registerAccount({ name, email, password, confirmPassword, role }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName) throw new Error('Please enter your full name.');
  if (password.length < 6) throw new Error('Password must contain at least 6 characters.');
  if (password !== confirmPassword) throw new Error('Passwords do not match.');

  const accounts = getAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }
  const created = { name: cleanName, email: cleanEmail, password, role };
  // Only user-created accounts are stored; demo accounts stay built in.
  const stored = [...accounts, created].filter((a) => !DEMO_ACCOUNTS.some((demo) => demo.email === a.email.toLowerCase()));
  saveItem('accounts', stored);
  return created;
}

// Check credentials. Returns the user (without password) or throws an Error.
export function authenticate(email, password, role) {
  const cleanEmail = email.trim().toLowerCase();
  const account = getAccounts().find((item) =>
    item.email.toLowerCase() === cleanEmail && item.password === password && item.role === role);
  if (!account) throw new Error('Email, password, or role is incorrect. Check your details and try again.');
  return { name: account.name, email: account.email, role: account.role };
}

// Session helpers (same storage keys as the original prototype).
export const getSessionUser = () => (loadSaved('authenticated', false) ? loadSaved('user', null) : null);
export function saveSession(user) {
  saveItem('authenticated', true);
  saveItem('user', user);
}
export function clearSession() {
  removeItem('authenticated');
  removeItem('user');
}
