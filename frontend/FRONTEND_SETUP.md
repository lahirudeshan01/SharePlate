# SharePlate Frontend Setup Guide

## Frontend Technologies
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update with your deployed API URL:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

---

## Project Structure

```
frontend/
├── public/                 # Static assets
│   └── index.html
├── src/
│   ├── components/        # Reusable React components
│   │   ├── DonationCard.jsx
│   │   ├── RequestCard.jsx
│   │   └── Navbar.jsx
│   ├── context/           # React Context (Auth state)
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components (routes)
│   │   ├── BrowseDonations.jsx
│   │   ├── CreateRequest.jsx
│   │   ├── Dashboard.jsx
│   │   └── LoginPage.jsx
│   ├── services/          # API calls
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── index.jsx          # React DOM render
│   └── index.css          # Global styles with Tailwind
├── .env                   # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.cjs
```

---

## Features Implemented

### 1. Browse Donations
- View all available food donations
- Search by food name or location
- Display donor details, expiry date, and quantity
- Filter donations (optional in extended version)

### 2. Create Requests
- Shelter users can request food from specific donations
- Specify quantity needed
- Add notes/special requirements
- Real-time validation
- Automatic rejection prevention (max = available quantity)

### 3. Request Dashboard
**For Shelters:**
- View all submitted requests
- See request status (pending/approved/rejected)
- Delete pending requests
- Track request history

**For Donors:**
- View incoming requests for their donations
- Approve or reject requests
- Automatic multi-request handling (rejects other pending when one approved)

### 4. Authentication
- Login with email/password
- Sign up as Shelter or Donor
- Persistent session (JWT token in localStorage)
- Protected routes for authenticated users
- User profile in navbar

---

## API Integration

The frontend connects to these backend endpoints:

### Donations
- `GET /api/donations/available` - Get all available donations
- `GET /api/donations/{id}` - Get single donation details
- `POST /api/donations` - Create new donation (Donor only)
- `GET /api/donations/my-donations` - Get donor's donations

### Requests
- `POST /api/requests` - Create request (Shelter)
- `GET /api/requests/my-requests` - Get shelter's requests
- `GET /api/requests/donor/my-donations` - Get donor's incoming requests
- `PUT /api/requests/{id}/approve` - Approve request (Donor)
- `PUT /api/requests/{id}/reject` - Reject request (Donor)
- `DELETE /api/requests/{id}` - Delete pending request (Shelter)

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get current user

---

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

**Build Command:** `npm run build`
**Publish Directory:** `dist`

### Option 3: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Deploy
npm run build
firebase deploy
```

### Option 4: Manual Deployment (Any VPS)
```bash
# Build
npm run build

# Upload dist/ folder to web server
# Configure web server to serve index.html for all routes (SPA configuration)
```

---

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (Vercel)
```env
VITE_API_URL=https://shareplate-api.onrender.com/api
```

Set these in your deployment platform's dashboard:
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Build & deploy → Environment
- **Firebase**: No setup needed (built with environment vars)

---

## Testing the Frontend

### Manual Testing Checklist
1. **Browse Page**
   - [ ] Load donations list
   - [ ] Search functionality works
   - [ ] Click "Request This Food" redirects to login if not authenticated
   - [ ] Card displays all donation info

2. **Login/Signup**
   - [ ] Create shelter account
   - [ ] Create donor account
   - [ ] Login with correct credentials
   - [ ] Error handling for wrong credentials

3. **Create Request (Shelter)**
   - [ ] Select a donation
   - [ ] Submit request with valid quantity
   - [ ] Error if quantity > available
   - [ ] Redirect to dashboard after success

4. **Dashboard (Shelter)**
   - [ ] View all requests
   - [ ] See request status colors
   - [ ] Delete pending request
   - [ ] Request details display

5. **Dashboard (Donor)**
   - [ ] View incoming requests
   - [ ] Approve request → triggers email to shelter
   - [ ] Reject request → other pending requests remain
   - [ ] See donation details

---

## Troubleshooting

### API Connection Issues
**Problem**: "Failed to load donations"

**Solution**: Ensure backend is running
```bash
cd ../  # Go back to project root
npm start  # Start backend
```

Check VITE_API_URL in .env matches your backend URL

### Styling Issues
**Problem**: Tailwind CSS classes not applied

**Solution**: Rebuild CSS
```bash
npm run dev
```

### Build Errors
**Problem**: Build fails with module errors

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 After Deployment
**Problem**: Page refreshes show 404

**Solution**: Your hosting platform doesn't have SPA rewrite configured
- **Vercel**: Auto-configured ✓
- **Netlify**: Create `netlify.toml` (included)
- **Firebase**: Create `firebase.json` (included)

---

## Performance Optimization

The frontend includes:
- ✅ Lazy loading (React Router code splitting)
- ✅ Efficient re-renders (Context API, useCallback)
- ✅ Optimized images
- ✅ Tailwind CSS optimization (removed unused styles in production)

---

## Further Development

### Future Enhancements
1. **Pagination** - Load donations in batches
2. **Request Timeline** - Show status changes over time
3. **Notifications** - Real-time updates (Socket.io)
4. **Advanced Search** - Filter by expiry date, location range
5. **Analytics** - Dashboard for donors (requests/approvals rate)
6. **Mobile App** - React Native version

### Adding New Features
1. Create component in `src/components/`
2. Create page in `src/pages/` if it's a route
3. Add API calls to `src/services/api.js`
4. Import and use in `App.jsx` or other components

---

## Support

For issues:
1. Check browser console (F12) for errors
2. Check backend logs for API errors
3. Verify .env file configuration
4. Ensure backend is running and accessible
