const STORAGE_KEY = 'unischedule:classes';
export function getLectures() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
export function saveLectures(lectures) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
  return lectures;
}
