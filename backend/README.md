# UniSchedule API

Standalone Express + MongoDB API for the UniSchedule frontend. The browser never receives MongoDB credentials or authentication tokens.

## Requirements

- Node.js 20+
- MongoDB 6+ (MongoDB Atlas works)
- A MongoDB replica set for atomic schedule regeneration and TTL session cleanup. Atlas clusters already use replica sets.

## Configure and run

Open a terminal in `backend/`:

```powershell
Copy-Item .env.example .env
npm install
```

Set `MONGODB_URI` in `backend/.env` to the connection string from **Atlas > Connect > Drivers**. Set `MONGODB_DB` to the database name (`unischedule` by default). For example:

```text
MONGODB_URI=mongodb+srv://<database-user>:<url-encoded-password>@<cluster-host>/?retryWrites=true&w=majority
MONGODB_DB=unischedule
```

Create a MongoDB database user and add your current IP address under **Atlas > Network Access**. Ensure the Atlas cluster is running. URL-encode special characters in the database password. Never commit `.env`, paste credentials into source code, or share database credentials. Keep real credentials only in `backend/.env`.

Start the API:

```powershell
npm run dev
```

The API must print `UniSchedule API listening on port 3001`. Check it at `http://localhost:3001/health`; a working response contains `{"data":{"status":"ok"}}`. If startup fails, the API reports whether Atlas authentication or network/cluster access needs attention without printing the connection string. Atlas provides the replica set required for schedule transactions.

## Shared calendar and announcements

The **Timetable** page shows recurring weekly lectures across a selectable date range. Administrators and Heads of Department can add or remove shared vacation and study-leave periods; these periods are informational and do not cancel scheduled lectures. The **Announcements** page and notification menu show messages to all signed-in users. Only Administrators and Heads of Department can post or remove announcements.

## Email lecture reminders

When SMTP is configured, adding new lectures to the timetable sends an email summary to every active student account. This is separate from lecture reminders and does not require students to opt in. When replacing a timetable, only lecture entries that were not already present are included in the notification. If SMTP is not configured, timetable changes still save and no email is sent.

The API can also email each opted-in lecturer and student 15 minutes before their scheduled lecture. Reminders go to the recipient's sign-in email address. Lecturer account names must match the lecturer name on the timetable; students select their batch in **Settings**. Reminders are disabled until SMTP is configured.

When SMTP is configured, new student registrations and accounts created with the administrator/operator scripts also receive an account-created confirmation email. If email delivery fails, the account is still created and the app or script clearly reports that the confirmation was not sent. SMTP credentials are never included in the email.

Add your email provider's SMTP settings to the private `backend/.env` file:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-sender@gmail.com
SMTP_PASSWORD=your-provider-app-password
SMTP_FROM=UniSchedule <your-sender@gmail.com>
EMAIL_TIMEZONE=Asia/Colombo
```

For Gmail, use an app password rather than your normal account password. For other providers, use their SMTP host, port, TLS requirements, and credentials. Use port `465` and `SMTP_SECURE=true` when your provider requires implicit TLS. Never commit or share the `.env` file or SMTP password. Email notifications and reminders stay disabled when `SMTP_HOST` or `SMTP_FROM` is missing.

Lecturers and students must sign in, open **Settings**, and explicitly enable email reminders; students must also select their batch. A user who has not opted in never receives reminders. Emails are retried up to three times if delivery fails.

The API listens on `http://localhost:3001`. In a second terminal, start the frontend from the `frontend/` directory:

```powershell
cd ..\frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite proxies `/api` and `/health` to the backend. Set `WEB_ORIGINS` to a comma-separated list of exact frontend origins if the deployed frontend calls the API directly. For a production deployment use HTTPS, a private MongoDB network, and a production `NODE_ENV`.

## Create users and initial schedule data

Self-registration creates **Student** users only. Create the first Administrator from a PowerShell terminal opened in `backend/`. Run all four lines in that same terminal. Use an email not already registered and a password of at least 12 characters:

```powershell
$env:ADMIN_NAME = "UniSchedule Administrator"
$env:ADMIN_EMAIL = "admin@your-university.example"
$env:ADMIN_PASSWORD = "use-a-unique-secret-of-at-least-12-characters"
npm run create-admin
```

The script loads `backend/.env`, connects to the configured `MONGODB_DB` database, and creates the account there. If the email already exists, it will not create a duplicate; sign in with that account or use a different email. If validation fails, check that the name is at least 2 characters and the password is at least 12 characters (maximum 72 UTF-8 bytes).

To provision another allowed role, use the operator-only user command:

```powershell
$env:USER_NAME = "Lecturer Name"
$env:USER_EMAIL = "lecturer@your-university.example"
$env:USER_PASSWORD = "use-a-unique-secret-of-at-least-12-characters"
$env:USER_ROLE = "Lecturer"
npm run create-user
```

Allowed roles are `Administrator`, `Head of Department`, `Lecturer`, and `Student`. For availability access, provision a lecturer account with the same full name as its lecturer-directory record. The user-creation scripts print neither password nor MongoDB URI.

To add the sample courses, lecturers, rooms, batches, and timetable (without overwriting existing matching records):

```powershell
npm run seed:demo
```

Run backend syntax checks with `npm run check` and backend tests with `npm test`. The frontend build is checked from `frontend/` with `npm run build`.

## API outline

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Authenticated reads: `GET /api/classes`, `/courses`, `/lecturers`, `/rooms`, `/batches`, `/availability`
- Administrator/Head of Department writes: `POST`, `PUT /:id`, and `DELETE /:id` on resource collections
- `DELETE /api/schedule` clears all recurring lecture records for Administrators and Heads of Department; other data is unchanged
- `PUT /api/schedule/replace` validates conflicts and atomically replaces the timetable
- A Lecturer can update only availability matching their provisioned account name; administrators can update any lecturer

Authentication uses random, revocable, database-backed sessions in `HttpOnly`, `SameSite=Strict` cookies; production cookies require HTTPS. Passwords are bcrypt-hashed. Registration and login are rate limited. Writes require an allowed `Origin`; CORS is restricted to configured frontend origins. Helmet, bounded JSON request bodies, strict schemas, role checks, schedule conflict checks, and generic error responses are enabled.

Use a private MongoDB deployment, TLS, backups, least-privilege database credentials, and monitor operational logs in production. The built-in rate limiter uses in-memory storage; configure a shared production rate-limit store before running multiple API instances. Email verification and password recovery are not yet implemented. Student batch selection is self-managed from the available batch list. Set `WEB_ORIGINS` to the exact frontend origin(s), and configure TLS and a reverse proxy before setting `NODE_ENV=production`.
