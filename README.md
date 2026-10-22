# UniSchedule React Project (Commented & Split JSX)

A React + Vite frontend prototype for the UniSchedule lecture scheduling proposal.

## Run locally

```bash
npm install
npm run dev
```

To test a production build:

```bash
npm run build
```

## Demo login

- Administrator: `admin@unischedule.lk` / `admin123`
- Lecturer: `lecturer@unischedule.lk` / `lecture123`
- Student: `student@unischedule.lk` / `student123`

These are frontend demo credentials only. Do not use them for real accounts.

## Source structure

- `src/main.jsx` — React entry point.
- `src/App.jsx` — application shell, navigation, demo login state, local storage, and modal actions.
- `src/pages.jsx` — simple export file for all pages.
- `src/pages/Dashboard.jsx` — dashboard overview and quick actions.
- `src/pages/Timetable.jsx` — weekly timetable and conflict checks.
- `src/pages/Courses.jsx` — course list.
- `src/pages/Lecturers.jsx` — lecturer list.
- `src/pages/Rooms.jsx` — room management view.
- `src/pages/Batches.jsx` — batch management and batch timetable navigation.
- `src/pages/Availability.jsx` — lecturer availability demo.
- `src/pages/Analytics.jsx` — analytics view.
- `src/pages/SettingsPage.jsx` — settings view.
- `src/components/Login.jsx` — demo login form.
- `src/components/Modal.jsx` — add-item forms.
- `src/components/shared.jsx` — shared statistic/search/toggle components.
- `src/data.js` — demo data and helper functions.
- `src/styles.css` — styling and responsive layout.

## Notes

This is a frontend prototype. Browser local storage is used for demo persistence. A production system still needs an Express/Node API, MongoDB, server-side authentication/authorization, and real-time notifications. Review all features before using it for real scheduling.

## Login and account registration
- Use **Create account** on the login screen to register a new local demo account.
- Enter your full name, a unique email address, password (at least 6 characters), confirm the password, and choose a role.
- After registration, sign in using that same email, password, and role.
- Accounts are stored in this browser's `localStorage`; they do not sync across devices or browsers.
- This is a learning prototype only. Do not use real or sensitive passwords. Production authentication should use a backend API, password hashing, and server-side role authorization.
- Built-in demo accounts: `admin@unischedule.lk` / `admin123`, `lecturer@unischedule.lk` / `lecture123`, `student@unischedule.lk` / `student123`.


## Requested Frontend Structure

The project has been organized to include the requested `components/common`,
`components/dashboard`, `components/timetable`, `context`, `pages`, `services`,
and `utils` folders. The original application screens and their existing
buttons/interactions have been preserved. The original pages (Courses, Lecturers,
Rooms, Batches, Availability, Analytics, and Settings) remain available as well.

Run locally:
1. Install Node.js (LTS).
2. Run `npm install`.
3. Run `npm run dev`.
