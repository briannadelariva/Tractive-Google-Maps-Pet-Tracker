# Tractive → Google Maps Pet Tracker

A production-ready web application that integrates with the Tractive API and Google Maps to provide comprehensive pet tracking capabilities.

![Pet Tracker Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Tractive+Pet+Tracker)

## 🌟 Features

### Core Tracking
- **Live Position Tracking** - Real-time pet location with 5-second updates
- **Trail Visualization** - Historical path display with customizable time ranges
- **Interactive Maps** - Full Google Maps integration with custom markers and overlays

### Advanced Mapping
- **Heatmap Analysis** - Visualize favorite spots and activity patterns
- **Geofences** - Safe zone monitoring with violation alerts
- **Places Integration** - Nearby dog parks, vets, and pet stores
- **Elevation Tracking** - Trail statistics with elevation gain/loss

### Smart Features
- **ETA Calculations** - Real-time distance and time to pet
- **Street View Integration** - One-click panoramic views
- **Path Suggestions** - Walking routes around activity hotspots
- **Geofence Alerts** - Instant notifications when pets leave safe zones

### Controls
- **Remote Commands** - LED flash and buzzer triggers
- **Live Tracking Toggle** - Enable/disable real-time updates
- **Battery monitoring** - Track device power levels
- **Responsive Design** - Works on desktop and mobile

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
- **Tractive API Integration** - Secure server-side authentication
- **Google Maps APIs** - Geocoding, Directions, Places, Elevation
- **Rate Limiting** - API call optimization and protection
- **Error Handling** - Robust error recovery and logging

### Frontend (React + TypeScript + Vite)
- **Real-time Updates** - React Query for efficient data fetching
- **Interactive Maps** - Google Maps JavaScript API
- **Responsive UI** - Tailwind CSS with modern design
- **Type Safety** - Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Tractive account with active pet tracker
- Google Maps API key with required services enabled

### 1. Clone and Install
```bash
git clone https://github.com/briannadelariva/Tractive-Google-Maps-Pet-Tracker.git
cd Tractive-Google-Maps-Pet-Tracker
npm run install-all
```

### 2. Configuration
Copy the environment template and configure your credentials:
```bash
cp .env.sample .env
```

Edit `.env` with your credentials:
```env
# Tractive API Credentials
TRACTIVE_EMAIL=your_tractive_email@example.com
TRACTIVE_PASSWORD=your_tractive_password

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Home Base Location (optional)
HOME_BASE_LAT=37.7749
HOME_BASE_LNG=-122.4194
```

### 3. Google Maps API Setup
Enable these APIs in Google Cloud Console:
- Maps JavaScript API
- Geocoding API
- Directions API
- Places API
- Elevation API

### 4. Run Development Environment
```bash
npm run dev
```

The application will start on two ports:
- **Frontend (React)**: http://localhost:3000 - Main user interface
- **Backend API (Express)**: http://localhost:3001 - REST API server

> The frontend automatically proxies API requests to the backend, so you only need to access http://localhost:3000 in your browser.

## 🔧 VS Code Dev Container

This project includes a VS Code Dev Container configuration for a consistent development environment.

### Using the Dev Container

1. **Prerequisites:**
   - [VS Code](https://code.visualstudio.com/)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in Dev Container:**
   - Open the project in VS Code
   - When prompted, click "Reopen in Container"
   - Or use Command Palette: `Dev Containers: Reopen in Container`

3. **What's Included:**
   - Node.js 18 environment
   - All dependencies auto-installed
   - VS Code extensions (ESLint, Prettier, Tailwind CSS, etc.)
   - Port forwarding for frontend (3000) and backend (3001)
   - Configured editor settings for consistent formatting
   - SSH configuration with automatic filtering of macOS-specific options

4. **SSH Configuration:**
   - Your host SSH keys are automatically copied to the container
   - macOS-specific options (like `UseKeychain`) are filtered out for Linux compatibility
   - Git operations work seamlessly without configuration errors
   - See `.devcontainer/README.md` for troubleshooting

5. **Run the application:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Tractive-Google-Maps-Pet-Tracker/
├── backend/                 # Node.js API server (port 3001)
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Tractive & Google APIs
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript definitions
│   │   └── config/         # Configuration
│   └── package.json
├── frontend/               # React application (port 3000)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
├── .devcontainer/          # VS Code Dev Container config
│   └── devcontainer.json
├── .env.sample            # Environment template
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login-tractive` - Authenticate with Tractive
- `GET /api/auth/status` - Check authentication status

### Trackers
- `GET /api/trackers` - List all trackers
- `GET /api/trackers/:id/position` - Latest position
- `GET /api/trackers/:id/history` - Position history
- `GET /api/trackers/:id/geofences` - Get geofences
- `GET /api/trackers/:id/places` - Nearby places
- `GET /api/trackers/:id/eta` - Calculate ETA
- `GET /api/trackers/:id/streetview` - Street View URL

### Controls
- `POST /api/trackers/:id/live` - Toggle live tracking
- `POST /api/trackers/:id/led` - Trigger LED
- `POST /api/trackers/:id/buzzer` - Trigger buzzer

## 🎮 Usage Guide

### Map Controls
- **Time Range**: Select from 1 hour, 24 hours, 7 days, or custom range
- **Layer Toggles**: Show/hide heatmap, geofences, and places
- **Street View**: Click for panoramic view near pet location

### Real-time Features
- Position updates every 5 seconds when live tracking is enabled
- Geofence violation alerts appear instantly
- Battery level and connection status in header

### Quick Actions
- **Navigate to Pet**: Opens Google Maps directions
- **Flash LED**: Helps locate pet in dark areas
- **Sound Buzzer**: Audio signal for finding nearby pets

## 🔧 Configuration Options

### Environment Variables
```env
# Server Configuration
NODE_ENV=development|production
PORT=3001
FRONTEND_URL=http://localhost:3000

# Tractive Integration
TRACTIVE_EMAIL=your_email
TRACTIVE_PASSWORD=your_password

# Google Maps Features
GOOGLE_MAPS_API_KEY=your_key
GOOGLE_ENABLE_GEOCODING=true
GOOGLE_ENABLE_DIRECTIONS=true
GOOGLE_ENABLE_PLACES=true
GOOGLE_ENABLE_ELEVATION=true

# Location Settings
HOME_BASE_LAT=37.7749
HOME_BASE_LNG=-122.4194
```

### Map Customization
The application supports various map display options:
- Custom marker styles and colors
- Adjustable heatmap radius and opacity
- Configurable geofence appearance
- Place category filtering

## 🚦 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Mock Mode
For testing without real trackers, the application includes mock data generation.

## 📊 Performance

### Optimization Features
- **Data Caching**: React Query with intelligent cache management
- **API Rate Limiting**: Respects Tractive API limits
- **Polyline Decimation**: Ramer-Douglas-Peucker algorithm for large datasets
- **Lazy Loading**: Code splitting for map components

### Recommended Limits
- **Position History**: Max 1000 points for performance
- **Polling Rates**: 5-10 seconds for position, 60-120 seconds for history
- **API Quotas**: Monitor Google Maps API usage

## 🛡️ Security

### Data Protection
- Tractive credentials stored server-side only
- API keys in environment variables
- Rate limiting on all endpoints
- No sensitive data exposed to client

### Privacy Features
- Optional coordinate fuzzing for sharing
- Configurable data retention
- Delete history functionality
- Secure session management

## 🔄 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Configure production environment variables
- Set up SSL/TLS certificates
- Configure reverse proxy (nginx recommended)
- Set up monitoring and logging

### Scaling Considerations
- Implement Redis for session storage
- Add load balancing for multiple instances
- Monitor API quota usage
- Consider CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tractive](https://tractive.com/) for pet tracking hardware
- [Google Maps Platform](https://developers.google.com/maps) for mapping services
- [React Query](https://tanstack.com/query) for data fetching
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For issues and questions:
- Check existing GitHub issues
- Review API documentation
- Verify environment configuration
- Test with mock data first

## 🗺️ Roadmap

- [ ] Multi-pet support
- [ ] Activity recognition (walking, running, sleeping)
- [ ] Weather integration
- [ ] Social features (pet meetups)
- [ ] Mobile app (React Native)
- [ ] Offline map caching
- [ ] Custom geofence shapes
- [ ] Advanced analytics dashboard