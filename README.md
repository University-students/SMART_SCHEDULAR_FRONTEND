# UniSchedule – Smart Scheduler Frontend

React + Vite + Tailwind CSS frontend prototype for the UniSchedule lecture scheduling system.

## Run locally

```bash
npm install
npm run dev      # development server
npm run build    # production build
```

## Demo login

- Administrator: `admin@unischedule.lk` / `admin123`
- Lecturer: `lecturer@unischedule.lk` / `lecture123`
- Student: `student@unischedule.lk` / `student123`

Frontend demo credentials only – use a real backend for real authentication.

## Structure

- `src/App.jsx` – app shell: Login or workspace (Sidebar + Navbar + page), lecture state.
- `src/pages/` – `Login`, `Dashboard`, `TimetablePage`, `ProgressPage`.
- `src/components/common/` – `Button`, `Navbar`, `NotificationBadge`, `Sidebar`.
- `src/components/dashboard/` – `DailySchedule`, `AlertWidget`, `UpcomingEvents`.
- `src/components/timetable/` – `CalendarView`, `LectureCard`.
- `src/context/` – `AuthContext` (user/login/logout), `NotificationContext` (toasts + bell list).
- `src/services/` – `api.js` (localStorage mock API + seed data), `authService.js`, `lectureService.js` (conflicts, auto-generate, CSV export, stats).
- `src/utils/formatDate.js` – day/time formatting helpers.
- `src/index.css` – Tailwind layers + the UniSchedule styles (Tailwind preflight is disabled so existing styles are unchanged).
