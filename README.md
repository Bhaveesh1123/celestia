# CELESTIA — Observatory Operations System

A frontend prototype for centralized space observatory operations, including equipment monitoring, weather integration, maintenance scheduling, and observation planning.

## Technologies

- **React** + **TypeScript** + **Vite**
- **React Router** for navigation
- **Tailwind CSS** for styling
- **lucide-react** for icons

> This is a **frontend prototype only**. All data is simulated via a mock service layer. The backend (Node.js + Express + PostgreSQL + Redis + Docker) will be built separately.

## Features

- Mock authentication (login/logout)
- Observatory operations dashboard with summary cards
- Equipment monitoring with full CRUD, search, status filter, and detail view
- Weather integration with simulated refresh
- Maintenance scheduling with full CRUD, search, and status filter
- Observation planning with full CRUD, search, status and priority filters
- Dark/light theme with localStorage persistence
- Loading states, empty states, and error handling
- Recent activity log
- Simulated data refresh

## Demo Credentials

- **Username:** `admin`
- **Password:** `admin123`

## How to Run

```bash
npm install
npm run dev
```

The dev server starts automatically. Navigate to the local URL shown in the terminal.

## Architecture

```
src/
  components/   Shared UI (Navbar, Modal, StatusBadge, Loading)
  context/      Auth and Theme contexts
  data/         Mock data
  pages/        Route pages (Login, Dashboard, Equipment, Weather, Maintenance, Observations, Settings)
  services/     Mock service layer (simulates async API calls)
  types/        TypeScript interfaces
```

The service layer (`src/services/`) is structured so each service can later be replaced with real REST API calls without changing the components.
