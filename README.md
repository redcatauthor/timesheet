# timesheet

A clean, minimal timesheet app that syncs directly with Notion. Log time, track tasks, and export reports from any device, with no backend required.

## Features

- Log time entries with project, task type, hours, notes, and status
- Built-in stopwatch timer to track time as you work
- Import tasks directly from a Notion tasks database
- Filter entries by date range, project, task type, and status
- Syncs all entries to Notion in real time
- Export to PDF, XLSX, or CSV

## What you need

- A free [Notion](https://notion.so) account
- A free [GitHub Pages](https://pages.github.com) account for hosting
- A free [Cloudflare](https://cloudflare.com) account for the API proxy

## Setup

### 1. Set up Notion

Create a Notion integration at [notion.so/profile/integrations](https://notion.so/profile/integrations), give it a name, and copy the **Internal Integration Secret** — this is your API key.

Create two databases in Notion:

**Timesheet database** with these fields:

| Field | Type |
|---|---|
| Entry | Title |
| Date | Date |
| Project | Select |
| Task Type |  
| Hours | Number |
| Notes | Text |
| Status | Select (To do, In progress, Done) |

**Tasks database** with these fields:

| Field | Type |
|---|---|
| Task | Title |
| Project | Relation (to your projects database, or select) |
| Task Type | Select (same options as above) |
| Status | Select (To do, In progress, Done) |
| Start Time | Date (with time enabled) |
| End Time | Date (with time enabled) |
| Duration (hrs) | Formula: `dateBetween(prop("End Time"), prop("Start Time"), "minutes") / 60` |
| Notes | Text |

Connect your integration to both databases via the `...` menu → **Connections** in each database.

### 2. Deploy the Cloudflare Worker

Notion's API doesn't allow direct browser calls, so you need a small proxy. The `notion-proxy-worker.js` file in this repo is all you need.

1. Sign up at [cloudflare.com](https://cloudflare.com) (free)
2. Go to **Workers & Pages** → **Create a Worker**
3. Click **Edit code**, delete the default content, and paste in the contents of `notion-proxy-worker.js`
4. Update the `ALLOWED_ORIGIN` constant at the top to match your GitHub Pages URL:
   ```js
   const ALLOWED_ORIGIN = 'https://yourusername.github.io';
   ```
5. Click **Deploy** and copy the Worker URL (e.g. `https://your-worker.workers.dev`)

### 3. Update the app

Open `index.html` and find the `notionRequest` function. Replace the base URL with your Cloudflare Worker URL. Search for your worker URL pattern — it's already set if you followed the original setup.

Also confirm the database IDs near the top of the script match yours:

```js
const DB_ID = 'your-timesheet-database-id';
const TASKS_DB_ID = 'your-tasks-database-id';
```

Database IDs can be found in the Notion URL when you open a database: `notion.so/{database-id}?v=...`

### 4. Host on GitHub Pages

1. Create a new public GitHub repository
2. Upload `index.html` — rename it to `index.html` if needed
3. Go to **Settings** → **Pages** → set source to `main` branch
4. Your app will be live at `https://yourusername.github.io/your-repo-name`

### 5. Connect

Open your app in the browser. On first load you'll see a setup screen — enter your Notion API key (starting with `secret_`). Your key is stored only in your browser's local storage and is never written to any file or repository.

## Daily workflow

1. Add tasks to your Notion tasks database, linked to a project
2. Open the app and click **From tasks** to see your task list
3. Filter by status or logged/not logged to find what needs time logged
4. Click **Load** on a task to pre-fill the form
5. Hit **Start** on the timer, work, hit **Stop** when done
6. Click **Use this time** to fill in the hours automatically
7. Hit **Save entry** — it syncs to your Notion Timesheet database instantly
8. When you need to invoice or report, click **Export** → choose PDF, XLSX, or CSV

## Security

Your Notion API key never appears in any file or repository — it lives only in your browser's local storage. The Cloudflare Worker is locked to your specific GitHub Pages domain, so only your app can use it. The database IDs are visible in the source but are harmless without the API key.

## Stack

- Single HTML file, no build step required
- Hosted on GitHub Pages (free)
- Cloudflare Worker as CORS proxy (free tier)
- Notion as the database backend
