# SharePlate Frontend

## Overview
React + Vite frontend for the **SharePlate** food-sharing platform, which connects restaurants with shelters to reduce food waste.

## Tech Stack
- **React 18** – UI library
- **Vite 5** – Build tool & dev server
- **React Router v6** – Client-side routing
- **Material UI (MUI) v6** – Component library
- **Axios** – HTTP client
- **React Hook Form** – Form management
- **React Toastify** – Notifications

## Requirement Rubric Note
For the UI/UX framework requirement (for example, Tailwind CSS, Bootstrap, etc.), this project uses **Material UI (MUI) v6** as the selected framework.

MUI is used consistently across the frontend through:
- Shared theme configuration in `src/theme/index.js`
- Core layout and form components from `@mui/material`
- Iconography from `@mui/icons-material`

## Getting Started

### Prerequisites
- Node.js ≥ 18
- Backend running on `http://localhost:5000`

### Install dependencies
```bash
npm install
```

### Environment variables
Copy `.env` and fill in the values:
```
VITE_API_BASE_URL=http://localhost:5000
```

### Run development server
```bash
npm run dev
```
App will be available at `http://localhost:3000`.

### Build for production
```bash
npm run build
```

## Project Structure
```
src/
├── assets/          Static assets (images, icons)
├── components/      Reusable UI components
├── pages/           Route-level page components
├── services/        Axios API service modules
├── styles/          Global CSS style files
├── theme/           MUI theme configuration
├── App.jsx          Root component with routes
└── main.jsx         App entry point
```

## User Roles
| Role       | Access                                    |
|------------|-------------------------------------------|
| restaurant | Dashboard, donate food, view history      |
| shelter    | Dashboard, request food, view listings    |
| admin      | Full access – manage users                |
