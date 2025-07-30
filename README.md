# Trip Planner - AI-Powered Adventure Planning Platform

<p align="center">
  <img src="client/public/images/trip_planner_logo.png" alt="Trip Planner Logo" width="200">
</p>

_A sophisticated full-stack web application that leverages AI to generate personalized bike and trekking routes with real-time weather data and interactive mapping._

## 📋 Project Overview

Trip Planner is an innovative travel planning platform that transforms location preferences into detailed, actionable itineraries. By combining OpenAI's GPT-4 capabilities with real-time data from multiple APIs, the system creates customized multi-day adventures complete with route visualization, weather forecasts, and location imagery.

## 🎬 Live Demo

📹 **[Watch Demo Video](https://your-video-url.com)**

_Experience the complete flow:_

- User authentication and personalization
- AI-powered route generation
- Interactive trip visualization
- Trip history management

## 🚀 Key Features

### Intelligent Trip Generation

- **AI-Powered Itineraries**: Leverages OpenAI GPT-4 to create detailed day-by-day trip plans
- **Two Trip Types**:
  - **Bike Routes**: 2-day adventures with max 60km per day
  - **Trekking Loops**: Routes of 5-15km per day that start and end at the same point
- **Smart Constraints**: Automatically enforces distance limits and route logic

### Interactive Visualization

- **Dynamic Route Mapping**: Real-time route calculation using OSRM/Mapbox APIs
- **Leaflet Integration**: Interactive maps with markers, tooltips, and polyline routes
- **Day-by-Day Breakdown**: Tabbed interface showing detailed daily segments

### Real-Time Data Integration

- **Weather Forecasts**: 3-day weather predictions using Open-Meteo API
- **Location Imagery**: Stunning visuals from Unsplash API
- **Auto-complete Search**: Smart location suggestions with Nominatim API

### User Experience

- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Personal Dashboard**: Quick access to recent trips and trip history
- **Background Videos**: Immersive visual experience with autoplay videos

## 🏗️ System Architecture

### Technology Stack

#### Frontend (React + Vite)

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Map.jsx      # Leaflet map integration
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ItineraryTabs.jsx
│   │   └── guard/
│   │       └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx  # Global auth state management
│   ├── hooks/
│   │   └── useApi.js       # Axios interceptor with auth
│   ├── pages/
│   │   ├── Landing.jsx     # Hero page with auth modals
│   │   ├── Dashboard.jsx   # User home with recent trips
│   │   ├── TripPlanner.jsx # Location input & generation
│   │   ├── TripDetails.jsx # Generated trip display/save
│   │   ├── MyTrips.jsx     # Trip history management
│   │   └── HistoryTripDetails.jsx
│   └── styles/
│       ├── globals.css     # CSS reset & variables
│       └── pages/*.module.css
```

#### Backend (Node.js + Express)

```
server/
├── controllers/
│   ├── authController.js   # Login/register logic
│   └── tripController.js   # Trip CRUD + AI generation
├── services/
│   ├── userService.js      # User business logic
│   └── tripService.js      # Trip data operations
├── repositories/
│   ├── userRepository.js   # MongoDB user queries
│   └── tripRepository.js   # MongoDB trip queries
├── models/
│   ├── User.js            # Mongoose user schema
│   └── Trip.js            # Mongoose trip schema
├── routes/
│   ├── auth.js            # Auth endpoints
│   └── trips.js           # Trip endpoints
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── utils/
│   └── externalData.js    # Weather & image APIs
└── swagger.js             # API documentation
```

## 💾 Database Configuration & Management

### MongoDB Setup & Connection

The application uses MongoDB as its primary database, managed through Mongoose ODM for elegant schema definition and data validation.

#### Connection Configuration

```javascript
// server/index.js
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
```

#### Environment Variables

```bash
# Local Development
MONGO_URI=mongodb://localhost:27017/tripplanner

# Production (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tripplanner
```

### Data Models & Relationships

#### User Schema

```javascript
// server/models/User.js
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Normalizes email format
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true, // Stores bcrypt-hashed passwords
    },
  },
  {
    timestamps: true, // Auto-generates createdAt/updatedAt
  }
);
```

#### Trip Schema

```javascript
// server/models/Trip.js
const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // References User collection
      required: true,
    },
    title: { type: String, trim: true, required: true },
    type: {
      type: String,
      enum: ["bike", "trek"], // Enforces valid trip types
      required: true,
    },
    location: { type: String, trim: true, required: true },

    // Geospatial route data
    route: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        day: { type: Number, required: true },
      },
    ],

    // Daily breakdown structure
    days: [
      {
        day: { type: Number, required: true },
        lengthKm: { type: Number, required: true },
        startingPoint: { type: String, required: true },
        endingPoint: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    totalLengthKm: { type: Number, required: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);
```

### MongoDB Atlas Production Setup

For production deployment:

1. **Create MongoDB Atlas Cluster**

   ```bash
   # Sign up at https://cloud.mongodb.com
   # Create new project and cluster
   # Configure network access (IP whitelist)
   ```

2. **Connection String Configuration**

   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tripplanner?retryWrites=true&w=majority
   ```

## 🔧 Technical Implementation

### AI Trip Generation

The system uses OpenAI's GPT-4 model with carefully crafted prompts:

```javascript
const prompt = `
Generate a ${type} trip for "${location}", broken down by day...
Rules:
- If type is "bike": exactly 2 consecutive days; each day ≤ 60 km...
- If type is "trek": 3 or more days; each day 5–15 km; must form a loop...
`;
```

### Route Visualization

Dynamic route calculation with fallback mechanism:

```javascript
// Primary: OSRM (Open Source Routing Machine)
const osrmUrl = `https://router.project-osrm.org/route/v1/walking/${points}`;

// Fallback: Mapbox Directions API
directionsClient.getDirections({
  profile: "walking",
  waypoints: points.map((p) => ({ coordinates: [p.lng, p.lat] })),
});
```

### Authentication Flow

JWT-based authentication with secure token handling:

```javascript
// Token generation
const token = jwt.sign(
  { userId: user._id, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Axios interceptor for automatic token attachment
api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Create new user account | No            |
| POST   | `/api/auth/login`    | Authenticate user       | No            |
| POST   | `/api/auth/logout`   | End user session        | Yes           |

### Trip Endpoints

| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| GET    | `/api/trips`          | Get all user trips    | Yes           |
| POST   | `/api/trips`          | Save new trip         | Yes           |
| GET    | `/api/trips/:id`      | Get trip with weather | Yes           |
| DELETE | `/api/trips/:id`      | Delete trip           | Yes           |
| POST   | `/api/trips/generate` | Generate AI trip      | Yes           |

### Swagger Documentation

Access interactive API documentation at: `http://localhost:5000/api-docs`

## 🚀 Installation & Setup

### Prerequisites

#### System Requirements

- **Node.js 18+**

  ```bash
  # Check version
  node --version

  # Install via nvm (recommended)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 18
  nvm use 18
  ```

- **MongoDB**

  ```bash
  # macOS (using Homebrew)
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community

  # Windows (using Chocolatey)
  choco install mongodb

  # Linux (Ubuntu/Debian)
  sudo apt-get install -y mongodb
  sudo systemctl start mongodb
  ```

- **Git**

  ```bash
  # macOS
  brew install git

  # Windows
  choco install git

  # Linux
  sudo apt-get install git
  ```

#### Required API Keys

- OpenAI API key
- Mapbox access token
- Unsplash access key

### Environment Configuration

Create `.env` files in both client and server directories:

**Server `.env`:**

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/tripplanner
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
UNSPLASH_KEY=your_unsplash_access_key
```

**Client `.env`:**

```bash
VITE_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/trip-planner.git
   cd trip-planner
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install

   # Or install specific packages:
   npm install express mongoose cors dotenv bcrypt jsonwebtoken
   npm install axios openai @turf/turf
   npm install swagger-jsdoc swagger-ui-express
   npm install --save-dev nodemon
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install

   # Or install specific packages:
   npm install react react-dom react-router-dom
   npm install axios leaflet react-leaflet
   npm install @mapbox/mapbox-sdk leaflet-routing-machine lrm-mapbox
   npm install framer-motion lucide-react react-icons
   npm install --save-dev vite @vitejs/plugin-react
   npm install --save-dev eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh
   npm install --save-dev @types/react @types/react-dom globals
   ```

4. **Start MongoDB**

   ```bash
   # If installed locally
   mongod

   # Or use MongoDB Atlas cloud service
   ```

5. **Run the development servers**

   Terminal 1 (Backend):

   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## 📱 Features Showcase

### Landing Page

- Hero section with video background
- Modal-based authentication
- Smooth transitions to dashboard

### Trip Planner

- Smart location autocomplete
- Trip type selection (bike/trek)
- Loading states during AI generation

### Trip Details

- Full itinerary visualization
- Interactive map with day markers
- Weather forecast integration
- Save functionality with notifications

### Dashboard

- Welcome message with user name
- Recent trips carousel
- Quick access to trip creation

### My Trips

- Grid layout of saved trips
- Hover effects and animations
- Delete functionality with confirmation modal

## 🔒 Security Considerations

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Tokens**: Short expiration times (1 hour)
- **API Protection**: All trip endpoints require authentication
- **CORS Configuration**: Properly configured for production
- **Environment Variables**: Sensitive data kept in .env files
- **Input Validation**: Both client and server-side validation

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Render/Railway)

- Set environment variables
- Configure start script: `node index.js`
- Enable CORS for frontend domain

### Database (MongoDB Atlas)

- Create cluster
- Configure network access
- Update MONGO_URI in production

## 👥 Authors

This project was developed as part of our third-year Software Engineering studies by:

- **Lior Kapshitar** - _Software Engineering Student_
- **Almog Hevroni** - _Software Engineering Student_

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Mapbox for routing services
- Open-Meteo for weather data
- Unsplash for location imagery
- The open-source community for amazing tools and libraries

---

_Built with ❤️ using React, Node.js, and AI_
