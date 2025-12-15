# Dr. Sanjay Patient Management System - Frontend

A modern, professional patient management dashboard built with React, Vite, and TailwindCSS.

## Features

- 🏥 **Patient Registration** - Add new patients with comprehensive medical information
- 📋 **Visit History Tracking** - Record and track patient revisits with detailed medical records
- 🔍 **Advanced Search** - Search patients by name, phone number, or other criteria
- 📊 **Dashboard Analytics** - View patient statistics and insights
- 🎨 **Modern UI** - Beautiful glassmorphic design with smooth animations
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Radix UI** - Accessible component primitives

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server running (see backend README)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd patient-mangement/frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
VITE_APP_NAME=Dr. Sanjay Patient Management System
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

The application uses the following environment variables:

### Application Configuration

- `VITE_APP_NAME` - Application name displayed in the UI
- `VITE_APP_VERSION` - Application version
- `VITE_APP_DESCRIPTION` - Application description

### API Configuration

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)
- `VITE_API_TIMEOUT` - API request timeout in milliseconds (default: `10000`)

### Environment

- `VITE_NODE_ENV` - Environment mode (`development` or `production`)

### Feature Flags

- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking (default: `false`)
- `VITE_ENABLE_DEBUG` - Enable debug mode (default: `true`)

### Storage Keys

- `VITE_TOKEN_KEY` - LocalStorage key for auth token (default: `token`)
- `VITE_USER_KEY` - LocalStorage key for user data (default: `user`)

### Pagination

- `VITE_DEFAULT_PAGE_SIZE` - Default number of items per page (default: `10`)
- `VITE_MAX_PAGE_SIZE` - Maximum items per page (default: `100`)

### Session Configuration

- `VITE_SESSION_TIMEOUT` - Session timeout in milliseconds (default: `3600000` - 1 hour)

### Date Format

- `VITE_DATE_FORMAT` - Date display format (default: `MM/DD/YYYY`)
- `VITE_TIME_FORMAT` - Time display format (default: `HH:mm:ss`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/         # shadcn/ui components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and configurations
│   │   ├── api.js      # Axios API client
│   │   ├── constants.js # Environment variables and constants
│   │   └── utils.js    # Helper functions
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddPatient.jsx
│   │   ├── ManagePatients.jsx
│   │   ├── PatientDetail.jsx
│   │   └── SearchPatients.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Key Features Explained

### Two-Step Patient Management

When adding a patient, users are presented with two clear options:

1. **Register New Patient** - For first-time patients

   - Collects personal information (name, age, gender, phone, address)
   - Records initial medical consultation (case taking, diagnosis, treatment protocol)
   - Automatically creates the first visit record

2. **Record Revisit** - For existing patients
   - Search and select from existing patients
   - Add follow-up visit information
   - Track symptoms, diagnosis, and treatment changes
   - Automatic gap calculation between visits

### Visit History Timeline

- Visual timeline showing all patient visits
- Gap indicators showing time between visits (days, weeks, months, years)
- First visit labeled as "Case Taking / Initial Symptoms"
- Subsequent visits labeled as "Symptoms"
- Complete medical history at a glance

## Development

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use TailwindCSS utility classes
- Maintain consistent file structure

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Update navigation if needed

### API Integration

All API calls go through the centralized `api.js` client:

```javascript
import api from "../lib/api";

// GET request
const response = await api.get("/patients");

// POST request
const response = await api.post("/patients", data);
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

1. Build the application
2. Deploy the `dist/` folder to your hosting service
3. Ensure environment variables are set correctly
4. Configure your web server to serve the SPA correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for Dr. Sanjay's clinic.

## Support

For support, please contact the development team.
