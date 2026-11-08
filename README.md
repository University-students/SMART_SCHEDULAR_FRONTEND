# UniSchedule

The project is split into two separate applications:

- `frontend/` — React + Vite web application.
- `backend/` — Express API, MongoDB models, and optional email reminders.

## Requirements

- Node.js 20.19 or newer
- A MongoDB 6+ database (MongoDB Atlas is supported)

## Host frontend and backend separately on Render

Create a Render **Web Service** from this repository for the backend. Set **Root Directory** to `backend`, **Build Command** to `npm ci`, and **Start Command** to `npm start`.

Create a Render **Static Site** from this repository for the frontend. Set **Root Directory** to `frontend`, **Build Command** to `npm ci --include=dev && npm run build`, and **Publish Directory** to `dist`. The `--include=dev` option is required because Vite is used during the build.

On the frontend Static Site, set `VITE_API_BASE_URL` to `https://<your-backend-service>.onrender.com/api`. On the backend Web Service, set `NODE_ENV=production`, `MONGODB_URI`, `MONGODB_DB=unischedule`, and `WEB_ORIGINS=https://<your-frontend-site>.onrender.com`. Use exact URLs without trailing slashes. Render provides `PORT`; do not set it manually. Keep database and optional SMTP credentials in the backend's Render environment settings, not in GitHub.

Authentication uses `SameSite=Strict` session cookies. For reliable sign-in across the two services, use frontend and backend custom domains under the same parent domain (for example, `app.example.com` and `api.example.com`). Separate `*.onrender.com` addresses may be treated as cross-site by browsers, which can block session cookies. If you cannot use a custom domain, the recommended alternative is one Render Web Service serving both frontend and backend.

## Run the project

### 1. Configure and start the backend

Open a terminal in the project root and run:

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Only run `Copy-Item` if `backend/.env` does not already exist. Edit `backend/.env` and set your MongoDB Atlas connection string in `MONGODB_URI`. Keep this private file out of Git.

Start the API:

```powershell
npm run dev
```

Leave this terminal running. The API should listen on port 3001.

### 2. Start the frontend

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`. The frontend proxies API requests to the backend on port 3001.

### 3. Create an administrator

Follow the **Create users and initial schedule data** section in [backend/README.md](./backend/README.md) to create the first administrator and optionally load sample timetable data.

## Optional email notifications and reminders

Configure SMTP settings in the private `backend/.env` file as described in [backend/README.md](./backend/README.md). When configured, timetable additions are emailed to all active student accounts; users do not need to enable lecture reminders for these notices. Lecturers and students can separately enable 15-minute lecture reminders under **Settings**.

## Timetable times and PDF

In **Timetable**, view recurring weekly lectures in a searchable table, with filters for batch and subject details. Administrators and HODs can add vacation or study-leave date ranges; these are informational and do not remove lectures. **Announcements** are visible to all signed-in users, and only Administrators and HODs can post or remove them. Choose **Visit help centre** in the sidebar for a guide to each feature. The video walkthrough will appear there once a video URL is available.

When adding a lecture, choose a start and end time in 15-minute steps (for example, `10:45`). In **Timetable**, choose **Export PDF**, then select **Save as PDF** in the browser's print dialog. The PDF contains the recurring weekly timetable. You can also run the frontend checks with `npm test` from the `frontend/` folder.

## Checks

Run backend tests from the project root:

```powershell
npm test --prefix backend
```

Build the frontend:

```powershell
cd frontend
npm run build
```
