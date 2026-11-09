# UniSchedule

The project is split into two separate applications:

- `frontend/` — React + Vite web application.
- `backend/` — Express API, MongoDB models, and optional email reminders.

## Requirements

- Node.js 20.19 or newer
- A MongoDB 6+ database (MongoDB Atlas is supported)

## Deploy automatically on Render

The repository includes a Render Blueprint in `render.yaml`. To deploy, connect the GitHub repository to Render and create a Blueprint from it. Render builds the frontend and backend together, serves them from one Web Service, and automatically deploys later pushes to the connected branch. The frontend and API share an origin, so session cookies work without separate domains.

During Blueprint setup, provide `MONGODB_URI` in Render's private environment settings. `MONGODB_DB` defaults to `unischedule`, and Render supplies the listening port. Configure the MongoDB Atlas network access list to allow connections from the deployed service; prefer a restricted network policy over allowing access from everywhere. Do not put database or SMTP credentials in GitHub or this repository.

The free Render plan may spin down when idle, so the first request after inactivity can take longer. Email reminders are optional; add the SMTP settings described in [backend/README.md](./backend/README.md) to Render's private environment settings if you want them enabled.

After deployment, create the initial Administrator once by running the `create-admin` script against the production database, as described in [backend/README.md](./backend/README.md). Hosting and subsequent code deployments are automatic; provisioning the first admin and supplying private provider credentials still require these one-time setup steps.

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
