# Smart Attendance System - Technical Specification

## 1. Project Overview

**Project Name:** SmartTrack - Smart Attendance Management System  
**Project Type:** Full-Stack Web Application  
**Core Functionality:** Automated attendance tracking system for educational institutions with real-time tracking, analytics, and fraud prevention using QR codes, GPS validation, and optional face recognition.  
**Target Users:** Administrators, Staff/Teachers, Students

---

## 2. Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Database:** SQLite (development) / PostgreSQL (production ready)
- **Authentication:** JWT with bcrypt
- **Real-time:** Socket.io
- **Validation:** Zod

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **QR Scanning:** html5-qrcode
- **HTTP Client:** Axios
- **State Management:** React Context + useReducer

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** #6366F1 (Indigo-500)
- **Primary Dark:** #4F46E5 (Indigo-600)
- **Secondary:** #10B981 (Emerald-500)
- **Accent:** #F59E0B (Amber-500)
- **Background:** #F8FAFC (Slate-50)
- **Surface:** #FFFFFF
- **Text Primary:** #1E293B (Slate-800)
- **Text Secondary:** #64748B (Slate-500)
- **Error:** #EF4444 (Red-500)
- **Warning:** #F59E0B (Amber-500)
- **Success:** #10B981 (Emerald-500)
- **Dark Mode Background:** #0F172A (Slate-900)
- **Dark Mode Surface:** #1E293B (Slate-800)

### Typography
- **Font Family:** 'Inter', system-ui, sans-serif
- **Headings:** 
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 2rem (32px), font-weight: 600
  - H3: 1.5rem (24px), font-weight: 600
  - H4: 1.25rem (20px), font-weight: 500
- **Body:** 1rem (16px), font-weight: 400
- **Small:** 0.875rem (14px), font-weight: 400

### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Effects
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Shadows: 
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 15px rgba(0,0,0,0.1)
- Transitions: 200ms ease-in-out

---

## 4. Database Schema

### Tables

#### User
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password    String
  name         String
  role         Role     @default(STUDENT)
  studentId    String?  @unique
  phone        String?
  avatar       String?
  faceData     String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Class
```prisma
model Class {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  subject     String
  description String?
  room        String?
  schedule    String?
  staffId     String
  staff       User     @relation(fields: [staffId], references: [id])
  students    User[]   @relation("ClassStudents")
  sessions    Session[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Session
```prisma
model Session {
  id          String       @id @default(cuid())
  classId     String
  class       Class        @relation(fields: [classId], references: [id])
  qrCode      String?      @unique
  qrExpiry    DateTime?
  startTime   DateTime
  endTime     DateTime
  status      SessionStatus @default(ACTIVE)
  attendances Attendance[]
  createdAt   DateTime     @default(now())
}
```

#### Attendance
```prisma
model Attendance {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  sessionId   String
  session     Session       @relation(fields: [sessionId], references: [id])
  status      AttendanceStatus @default(PRESENT)
  method      AttendanceMethod @default(QR_CODE)
  latitude    Float?
  longitude   Float?
  deviceInfo  String?
  ipAddress   String?
  markedAt   DateTime      @default(now())
}
```

#### LeaveRequest
```prisma
model LeaveRequest {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  reason      String
  startDate   DateTime
  endDate     DateTime
  status      LeaveStatus       @default(PENDING)
  reviewedBy  String?
  reviewedAt  DateTime?
  createdAt   DateTime         @default(now())
}
```

#### ActivityLog
```prisma
model ActivityLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String
  details     String?
  ipAddress   String?
  deviceInfo  String?
  createdAt   DateTime @default(now())
}
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Users (Admin)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Classes
- `GET /api/classes` - List classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class details
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Sessions
- `POST /api/sessions` - Create session with QR
- `GET /api/sessions/active` - Get active session for class
- `POST /api/sessions/:id/qr` - Generate new QR code

### Attendance
- `POST /api/attendance/scan` - Mark attendance via QR
- `POST /api/attendance/manual` - Manual attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/class/:id` - Get class attendance

### Leave Requests
- `POST /api/leave` - Submit leave request
- `GET /api/leave` - List leave requests
- `PUT /api/leave/:id` - Update leave request (approve/reject)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/attendance-trends` - Attendance trends

---

## 6. Frontend Pages

### Public Pages
- Login (`/login`)
- Register (`/register`)
- Forgot Password (`/forgot-password`)
- Reset Password (`/reset-password/:token`)

### Student Dashboard
- Home (`/student`)
- My Classes (`/student/classes`)
- Attendance History (`/student/attendance`)
- Scan QR (`/student/scan`)
- Leave Request (`/student/leave`)
- Profile (`/student/profile`)

### Staff Dashboard
- Home (`/staff`)
- My Classes (`/staff/classes`)
- Class Session (`/staff/session/:id`)
- QR Generator (`/staff/qr/:id`)
- Attendance Records (`/staff/attendance`)
- Leave Requests (`/staff/leave`)
- Students (`/staff/students`)
- Reports (`/staff/reports`)

### Admin Dashboard
- Home (`/admin`)
- Users (`/admin/users`)
- Classes (`/admin/classes`)
- Analytics (`/admin/analytics`)
- Settings (`/admin/settings`)
- Activity Logs (`/admin/logs`)

---

## 7. Acceptance Criteria

### Authentication
- [ ] Users can register with email, password, name, and role
- [ ] JWT tokens are issued on login and stored securely
- [ ] Password is hashed using bcrypt (12 rounds)
- [ ] Protected routes require valid JWT token

### Attendance
- [ ] Staff can generate QR codes that expire in 60 seconds
- [ ] Students can scan QR codes to mark attendance
- [ ] GPS coordinates are captured with attendance
- [ ] Manual attendance can be marked by staff
- [ ] Attendance records show date, status, method

### Dashboards
- [ ] Admin dashboard shows total users, classes, attendance stats
- [ ] Staff dashboard shows assigned classes and quick actions
- [ ] Student dashboard shows attendance percentage and classes
- [ ] Charts display attendance trends

### Analytics
- [ ] Attendance percentage calculated correctly
- [ ] Low attendance alerts shown for students below threshold
- [ ] Export functionality works for CSV format

### Security
- [ ] API rate limiting enabled
- [ ] Activity logs capture user actions
- [ ] Input validation on all forms
- [ ] CORS configured properly

---

## 8. Project Structure

```
smart-attendance/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```