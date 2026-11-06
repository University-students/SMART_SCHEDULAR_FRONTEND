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
- `src/components/timetable/PdfLecturerImport.jsx` — browser-side PDF timetable import and lecturer schedule preview.
- `src/services/pdfTimetableService.js` — PDF text extraction and weekday/course/lecturer mapping.
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

## Import a lecturer timetable from PDF
- Open **Timetable** and choose **Choose PDF** in the PDF timetable import panel.
- The importer reads text-based weekday schedules that have a time column, Monday-to-Friday columns, and a separate lecturer list keyed by course code.
- Review the detected sessions, then add them to the current timetable or replace it. The imported schedule can be filtered by lecturer and exported like other timetable entries.
- PDF files are parsed in the browser and are not uploaded. Image-only/scanned PDFs and unsupported table layouts need OCR or a different document format.
- The default Year 2 Semester II demo schedule is based on `Year 2 Sem II.pdf`, including its course codes, lecturers, rooms, and half-hour time slots.

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
