# SmartTrack - Smart Attendance Management System

A comprehensive, full-stack attendance tracking system for educational institutions with real-time tracking, analytics, and fraud prevention features.

## Features

### Core Features
- **Multi-role Authentication**: Admin, Staff, and Student roles with JWT-based security
- **QR Code Attendance**: Time-based, expiring QR codes for session attendance
- **GPS Location Validation**: Geolocation-based check-in with configurable radius
- **Dashboard Analytics**: Interactive charts showing attendance trends and patterns
- **Leave Management**: Students can submit leave requests, staff can approve/reject
- **Activity Logs**: Comprehensive logging for security and audit purposes

### User Roles

#### Admin
- Manage all users (add/edit/delete)
- View system-wide analytics
- Configure system settings
- Monitor activity logs
- Detect suspicious attendance patterns

#### Staff/Teacher
- Create and manage classes
- Generate dynamic QR codes for sessions
- Mark manual attendance
- View class attendance reports
- Approve/reject leave requests

#### Student
- View enrolled classes
- Scan QR codes to mark attendance
- View attendance history and percentage
- Submit leave requests
- Receive notifications

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Validation**: Zod

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **QR Scanning**: html5-qrcode
- **HTTP Client**: Axios

## Project Structure

```
smart-attendance/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   ├── app.js          # Express app
│   │   └── server.js       # Server entry
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

#### Option 1: Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-attendance
```

2. **Setup Backend**
```bash
cd backend
npm install

# Copy environment file
copy .env.example .env

# Generate Prisma client
npx prisma generate

# Initialize database
npx prisma db push

# Seed database with demo users
npm run db:seed

# Start backend
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Option 2: Docker Setup

```bash
docker-compose up --build
```

### Demo Credentials

| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@smarttrack.com     | admin123   |
| Staff  | staff@smarttrack.com     | admin123   |
| Student| student@smarttrack.com   | admin123   |

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "studentId": "STU001"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@smarttrack.com",
  "password": "admin123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Classes

#### Create Class
```http
POST /api/classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Computer Science 101",
  "code": "CS101",
  "subject": "Programming",
  "room": "Room 301",
  "schedule": "Mon, Wed, Fri 9:00 AM"
}
```

#### Get Classes
```http
GET /api/classes
Authorization: Bearer <token>
```

### Sessions

#### Create Session
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "classId": "<class-id>",
  "duration": 60
}
```

#### Refresh QR Code
```http
POST /api/sessions/:id/refresh
Authorization: Bearer <token>
```

### Attendance

#### Mark Attendance (QR Scan)
```http
POST /api/attendance/scan
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrCode": "<qr-code-data>",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### Get Student Attendance
```http
GET /api/attendance/student/:id
Authorization: Bearer <token>
```

### Leave Requests

#### Submit Leave Request
```http
POST /api/leave
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Medical appointment",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-16T00:00:00Z"
}
```

#### Update Leave Request (Approve/Reject)
```http
PUT /api/leave/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}
```

### Analytics

#### Get Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

#### Get Attendance Trends
```http
GET /api/analytics/trends?days=30
Authorization: Bearer <token>
```

## Database Schema

### User
| Field      | Type     | Description                    |
|------------|----------|--------------------------------|
| id         | String   | Unique identifier (CUID)      |
| email      | String   | Unique email address           |
| password   | String   | Hashed password                 |
| name       | String   | Full name                       |
| role       | Enum     | ADMIN, STAFF, STUDENT          |
| studentId  | String?  | Student ID (optional)          |
| phone      | String?  | Phone number                   |
| isActive   | Boolean  | Account status                 |
| latitude   | Float?   | Campus latitude                |
| longitude  | Float?   | Campus longitude               |
| radius     | Float    | Allowed radius (meters)        |

### Class
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier          |
| name        | String   | Class name                 |
| code        | String   | Unique class code          |
| subject     | String   | Subject name               |
| room        | String?  | Room number                |
| schedule    | String?  | Schedule information       |
| staffId     | String   | Teaching staff ID          |

### Session
| Field      | Type     | Description                |
|------------|----------|----------------------------|
| id         | String   | Unique identifier          |
| classId    | String   | Class ID                   |
| qrCode     | String?  | QR code data (encrypted)    |
| qrExpiry   | DateTime?| QR code expiration time     |
| startTime  | DateTime | Session start time         |
| endTime    | DateTime | Session end time           |
| status     | Enum     | ACTIVE, COMPLETED, CANCELLED|

### Attendance
| Field       | Type     | Description                |
|-------------|----------|----------------------------|
| id          | String   | Unique identifier          |
| userId      | String   | User ID                    |
| sessionId   | String   | Session ID                 |
| status      | Enum     | PRESENT, ABSENT, LATE, EXCUSED |
| method      | Enum     | QR_CODE, GPS, MANUAL, FACE_RECOGNITION |
| latitude    | Float?   | Location latitude          |
| longitude   | Float?   | Location longitude         |
| deviceInfo  | String?  | Device information          |
| ipAddress   | String?  | IP address                  |
| markedAt    | DateTime | Attendance mark time        |

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: 24-hour token expiry
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **Activity Logging**: All actions logged

## Fraud Prevention

1. **Time-based QR Codes**: Expires in 60 seconds
2. **GPS Validation**: Validates location within radius
3. **Device Fingerprinting**: Captures device info
4. **IP Logging**: Records user IP addresses
5. **Suspicious Pattern Detection**: Flags unusual activity

## Future Enhancements

- Face Recognition using TensorFlow.js
- Email notifications
- Push notifications (PWA)
- Offline attendance sync
- PDF report generation
- Multi-institution support
- Mobile application

## License

MIT License - See LICENSE file for details

## Support

For support, email support@smarttrack.com or create an issue on GitHub.

---

Built with ❤️ for educational institutions