# Rehearsal Scheduler

A comprehensive web application for bands and musical groups to efficiently schedule rehearsals, track attendance, and optimize practice time.

## Features

### User Management
- User accounts with instrument profiles
- Band creation and member management
- Role-based permissions (band leader, member)

### Rehearsal Management
- Create, edit and delete rehearsal schedules
- Track rehearsal attendance and participation
- Set goals for each rehearsal session
- Associate songs to practice for each session

### Smart Scheduling
- Intelligent scheduling based on member availability
- Recurring rehearsal patterns (weekly, bi-weekly)
- Calendar views with availability overlays
- Conflict detection and resolution

### Song Management
- Song library with details (key, tempo, duration)
- Upload and share song materials (charts, recordings, notes)
- Track song status (learning, rehearsing, performance-ready)

### Venue Management
- Store and reuse venue information
- Maps and directions integration
- Venue availability tracking

### Analytics & Reporting
- Attendance and participation reports
- Progress tracking per song and member
- Rehearsal efficiency metrics

## Technology Stack

### Front-end
- React.js
- Redux for state management
- Material-UI components
- FullCalendar.js for calendar visualization
- Jest and React Testing Library

### Back-end
- Node.js with Express
- MongoDB & Mongoose
- JWT authentication
- WebSockets for real-time updates
- Nodemailer for notifications

### DevOps
- Docker containerization
- GitHub Actions for CI/CD
- AWS deployment (EC2, S3, CloudFront)
- MongoDB Atlas

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/dxaginfo/music-rehearsal-planner-2025-07-03.git
cd music-rehearsal-planner-2025-07-03/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Run development server
npm start
```

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── redux/          # State management
│       ├── hooks/          # Custom hooks
│       ├── utils/          # Utility functions
│       └── services/       # API service calls
│
├── server/                 # Node.js backend
│   ├── config/             # Configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── utils/              # Utility functions
│
├── docker/                 # Docker configuration
├── docs/                   # Documentation
└── scripts/                # Build/deployment scripts
```

## API Documentation

The API documentation is available at `/api/docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- Mobile app versions (iOS/Android)
- Integration with music streaming platforms
- Virtual rehearsal mode
- Advanced attendance analytics
- Band financial tracking
- Performance mode

## Contact

Project Link: [https://github.com/dxaginfo/music-rehearsal-planner-2025-07-03](https://github.com/dxaginfo/music-rehearsal-planner-2025-07-03)