# University Internship Portal

A MERN stack internship portal for university students and employers.

## Tech Stack
- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT, Bcrypt
- **Email:** Nodemailer (Gmail)

## Getting Started

### 1. Clone the repository
Clone this repo using GitHub Desktop or:
```
git clone https://github.com/DYSandakelum/university-internship-portal.git
```

### 2. Install dependencies

**Backend:**
```
cd backend
npm install
```

**Frontend:**
```
cd frontend
npm install
```

### 3. Set up environment variables
Create a `.env` file in the ROOT of the project with the following structure.
Contact the project owner for the actual values:
```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:3000
```

### 4. Run the project

**Backend** (in one terminal):
```
cd backend
npm run dev
```

**Frontend** (in another terminal):
```
cd frontend
npm start
```

### 5. Create your own branch
Never work directly on main. Create your own branch:
- Student 2: `feature/employer-portal`
- Student 3: `feature/notifications`
- Student 4: `feature/admin-reviews`
- Student 1: `feature/student-portal`

## Project Structure
```
university-internship-portal/
├── backend/
│   ├── config/        → Database and email configuration
│   ├── controllers/   → Feature logic
│   ├── middleware/    → JWT authentication middleware
│   ├── models/        → MongoDB schemas
│   ├── routes/        → API endpoints
│   ├── utils/         → Helper functions
│   ├── uploads/       → Uploaded files
│   └── server.js      → Main server file
├── frontend/
│   └── src/
│       ├── components/ → Reusable UI components
│       ├── context/    → Global state (AuthContext)
│       ├── pages/      → All pages by role
│       ├── services/   → API configuration
│       └── socket/     → Real-time notifications
├── .env               → Secret keys (never commit this)
└── README.md
```

## Team
- Student 1: Student Portal & Authentication
- Student 2: Employer Portal & Job Management
- Student 3: Matching, Notifications & Search
- Student 4: Review System & Admin Portal