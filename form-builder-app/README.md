# Form Builder Application

A dynamic form-builder application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (signup/login)
- Create, edit, and delete forms
- Add questions with different answer types (Text, Number, Formula, Linked Answer)
- Modern, responsive UI
- JWT-based authentication
- Secure API endpoints

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React 18 with Hooks
- React Router for navigation
- Context API for state management
- Modern CSS with responsive design

## Project Structure

```
form-builder-app/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React Context
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd form-builder-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/form-builder
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd form-builder-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Forms
- `GET /api/forms` - Get all forms for user
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Questions
- `GET /api/questions/form/:formId` - Get questions for form
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000` in your browser
3. Create an account or sign in
4. Create your first form
5. Add questions with different answer types
6. Edit and manage your forms

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- User ownership verification for forms and questions

## Development

- Backend runs on port 5000
- Frontend runs on port 3000
- MongoDB connection string configurable via environment variables
- Hot reloading enabled for both frontend and backend

## Production Considerations

- Change JWT_SECRET to a strong, unique key
- Use environment variables for all sensitive configuration
- Enable HTTPS in production
- Set up proper MongoDB authentication
- Configure CORS for production domains
- Use PM2 or similar process manager for Node.js
- Build frontend for production deployment
