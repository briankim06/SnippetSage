# Architecture Overview

## Diagram

![Architecture Diagram](../assets/architecture.png)

## Components

- **Browser**: React.js SPA with TypeScript and TailwindCSS.
- **API Server**: Node.js + Express handles RESTful APIs, authentication, and background job enqueuing.
- **Database**: PostgreSQL stores users, snippets, metadata.
- **Job Queue**: Redis + BullMQ handles long-running AI tasks (e.g., enhancing snippets).
- **AI Provider**: OpenAI GPT-4o provides summaries, tags, code improvements.

## Deployment Model

- Two-service split:
  - Frontend deployed to Vercel
  - Backend deployed to Render/Railway
  - Shared Redis/Postgres on hosted cloud services

## Data Flow: "Save Snippet"

1. User submits a snippet from the frontend
2. API saves the snippet to the database
3. A job is queued to generate AI enhancements
4. Once complete, enhancements are written back

## Cross-Cutting Concerns

- **Authentication**: Clerk (JWT + sessions)
- **Rate Limiting**: Express middleware
- **Logging**: Pino on server, Sentry on frontend
- **CI/CD**: GitHub Actions for backend, Vercel for frontend
- **Monitoring**: UptimeRobot / Sentry

## Known Risks

- OpenAI latency may delay snippet enhancement.
- Redis queue must be monitored for stuck jobs.
- Scaling async workers needs coordination.
