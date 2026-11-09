# UniSchedule

UniSchedule is a weekly university timetable and scheduling app. The repository has two active applications:

- `frontend/` — React and Vite web app.
- `backend/` — Express API, MongoDB data, authentication, and optional email notifications.

The backend serves the built frontend in production. In local development, run the frontend and backend separately.

## Requirements

- Node.js 20.19 or newer (npm is included with Node.js).
- MongoDB 6 or newer. MongoDB Atlas is supported; its cluster must be running and allow connections from your development machine or deployed service.

## Run locally

### 1. Configure the backend

From the repository root, open a PowerShell terminal:

```powershell
cd backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
```

Edit `backend/.env` and set `MONGODB_URI` to your MongoDB connection string. Keep `.env` private; it is ignored by Git. Never put real credentials in source files or commit them.

Start the API:

```powershell
npm run dev
```

Keep this terminal open. The API listens on `http://localhost:3001`; check `http://localhost:3001/health` for a healthy response.

### 2. Start the frontend

Open a second PowerShell terminal at the repository root:

```powershell
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite proxies `/api` and `/health` to the backend on port 3001. Both terminals must remain running while you use the local app.

## First administrator and sample data

Self-registration creates student accounts. Create the first Administrator once, from a terminal in `backend/`, using a unique email and a strong password of at least 12 characters:

```powershell
$env:ADMIN_NAME = "UniSchedule Administrator"
$env:ADMIN_EMAIL = "admin@your-university.example"
$env:ADMIN_PASSWORD = "use-a-unique-secret-of-at-least-12-characters"
npm run create-admin
```

The script uses the MongoDB settings in `backend/.env`. Do not reuse the example values above as real credentials. To load optional sample courses, lecturers, rooms, batches, and timetable data without overwriting matching records:

```powershell
npm run seed:demo
```

Run the account-creation commands only from a trusted terminal. Keep passwords and database connection strings out of GitHub and chat.

## Main app workflow

1. Sign in. Students can register for student accounts; an Administrator provisions staff and management accounts.
2. Use **Timetable** to search and filter the recurring weekly schedule by batch. Administrators and Heads of Department can add or remove lectures and manage shared vacation or study-leave periods. Leave dates are informational and do not cancel lectures.
3. Use **Courses**, **Lecturers**, **Rooms**, and **Batches** to review scheduling resources. Administrators and Heads of Department can manage them.
4. Lecturers can update their own availability. Administrators can manage availability for any lecturer.
5. Use **Announcements** for shared notices. Administrators and Heads of Department can post and remove announcements.
6. Users can update their reminder preferences in **Settings**. Students also select their batch there.
7. Use **Export PDF** from **Timetable**, then select **Save as PDF** in the browser's print dialog.

Lecture times are entered in 15-minute increments. Email notifications are optional. When SMTP is configured, new timetable lectures and provisioned accounts generate email notices. Opted-in lecturers and students can receive reminders 15 minutes before class.

## Email configuration

For local development, set these values in the private `backend/.env` file:

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-sender@gmail.com
SMTP_PASSWORD=your-provider-app-password
SMTP_FROM=UniSchedule <your-sender@gmail.com>
EMAIL_TIMEZONE=Asia/Colombo
```

Use an email provider's app password, not your normal account password. Email remains disabled when SMTP is not configured. Never commit or share SMTP credentials.

## Run checks

Run backend tests and syntax checks from the repository root:

```powershell
npm test --prefix backend
npm run check --prefix backend
```

Run the frontend time helper tests and production build from the repository root:

```powershell
node --test frontend/tests/timetable.test.js
npm run build --prefix frontend
```

The frontend package does not define an `npm test` script; use the `node --test` command above.

## Deploy to Render

The root `render.yaml` is a Render Blueprint for a single Node web service. It installs and builds both apps, serves the frontend and API from one origin, checks `/health`, and enables automatic deploys from the connected GitHub branch.

1. Commit and push the project to GitHub.
2. In Render, choose **New → Blueprint**, connect GitHub, and select this repository and branch.
3. When prompted, provide `MONGODB_URI` through Render's private environment settings. `MONGODB_DB` defaults to `unischedule`; Render provides the service port.
4. Configure MongoDB Atlas network access so the Render service can connect. Keep the database user least-privileged and do not put credentials in the Blueprint or GitHub.
5. Apply the Blueprint and wait for the service health check and deployment to finish. Open the Render service URL to use the app.
6. Create the initial Administrator once using the production database, as described above. For this one-time command, make sure the trusted terminal is configured with the production `MONGODB_URI`; do not use or disclose the credential in chat.
7. If email is needed, add `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and optionally `EMAIL_TIMEZONE` to the Render service's private environment settings. Saving environment changes triggers a deploy.

After the Blueprint and GitHub connection are in place, pushes to the connected branch deploy automatically. The free Render plan may spin down when idle, so the first request after inactivity can take longer. Local `backend/.env` values are not automatically uploaded to Render.

## More backend details

See [backend/README.md](./backend/README.md) for API details, account provisioning, MongoDB configuration, and email behavior.
