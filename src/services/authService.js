/** Local demo auth helpers; the existing Login page remains the source of truth. */
const ACCOUNTS_KEY = 'unischedule:accounts';
export function getStoredAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); }
  catch { return []; }
}
export function saveStoredAccount(account) {
  const accounts = getStoredAccounts();
  accounts.push(account);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return account;
}
