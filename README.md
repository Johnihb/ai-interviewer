# 🤖 AI Interviewer

A comprehensive AI-powered interview assessment platform that generates personalized technical questions and provides detailed feedback using Google's Gemini AI.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Unfinished Features](#unfinished-features)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AI Interviewer is a full-stack web application that conducts technical interviews using artificial intelligence. The platform generates customized questions based on candidate skills and experience, evaluates answers in real-time, and provides comprehensive feedback with scoring and improvement suggestions.

## ✨ Features

### Current Features
- **🔐 User Authentication**: Secure signup/login with JWT tokens
- **📝 Dynamic Question Generation**: AI-powered question creation based on:
  - Skills/Technologies
  - Experience level
  - Question count
  - Difficulty level (easy, medium, hard)
- **🎨 Interactive UI**: Modern, responsive design with animations
- **📊 Real-time Assessment**: Instant answer evaluation with detailed feedback
- **🚫 Anti-cheating Measures**: Tab switching detection with difficulty-based penalties
- **📈 Scoring System**: Comprehensive scoring out of 10 with performance metrics
- **🎯 Feedback Analysis**: Detailed mistakes identification and improvement suggestions

### UI/UX Features
- Gradient backgrounds and glassmorphism effects
- Smooth animations with GSAP
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS 4** - Styling framework
- **React Router DOM** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **GSAP** - Animations
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Google Generative AI** - AI integration
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
ai_interviewer/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── DataDisplayUI.jsx    # Results display
│   │   │   ├── GetQuestionDetails.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ServerError.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Homepage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── Questions.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── stores/          # State management
│   │   │   ├── geminiStore.js
│   │   │   └── userStore.js
│   │   ├── Reactbits/       # Custom UI components
│   │   └── lib/             # Utilities
│   └── public/              # Static assets
├── backend/                 # Express.js backend
│   ├── config/              # Configuration files
│   │   ├── db.js           # Database connection
│   │   ├── cloudinary.js   # Cloudinary setup
│   │   └── multer.js       # File upload config
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.js
│   │   └── gemini.controller.js
│   ├── models/              # Database models
│   │   └── user.model.js
│   ├── routes/              # API routes
│   │   ├── auth.route.js
│   │   └── gemini.route.js
│   ├── middleware/          # Custom middleware
│   ├── validators/          # Input validation
│   ├── lib/                 # AI integration
│   │   └── gemini.ai.js
│   └── utils/               # Utility functions
└── .env.sample              # Environment variables template
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Google Gemini API key

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai_interviewer
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ai_interviewer

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Environment
NODE_ENV=development
```

### Getting API Keys

1. **Google Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **MongoDB**: Use local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🎮 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ..
npm start
```

## 🔌 API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile

### Interview Routes (`/api/v1/gemini`)
- `POST /questions` - Generate interview questions
- `POST /answer` - Evaluate candidate answers

### Request/Response Examples

**Generate Questions:**
```json
POST /api/v1/gemini/questions
{
  "skills": "React, Node.js, MongoDB",
  "experience": "2 years",
  "count": 5,
  "difficulty": "medium"
}
```

**Answer:**
```json
POST /api/v1/gemini/answer
{
  "question": ["What is React?"],
  "answer": {"Answer1": "React is a JavaScript library..."},
  "candidate": {
    "skill": "React, Node.js",
    "experience": "2 years",
    "difficulty": "medium"
  }
}
```

## 🚧 Unfinished Features

The following features are planned but not yet implemented:

### 🎛️ Dashboard
- **Dashboard**: Personal performance tracking
- **Interview History**: Past interview records and progress tracking
- **Statistics Visualization**: Charts and graphs for performance metrics

### 🏆 Leaderboard System
- **Global Rankings**: Top performers across all interviews
- **Skill-based Rankings**: Leaderboards for specific technologies
- **Monthly/Weekly Competitions**: Time-based challenges
- **Achievement Badges**: Milestone recognition system

### 👤 User Profile Enhancements
- **Profile Image Upload**: Complete integration with existing Cloudinary setup
- **Detailed Profile Management**: Skills matrix, certifications, experience timeline
- **Social Features**: Connect with other candidates, mentorship
- **Portfolio Integration**: Link to GitHub, LinkedIn, personal projects

### 🎨 UI/UX Improvements
- **Dark/Light Theme Toggle**: Complete theme system
- **Mobile Responsiveness**: Enhanced mobile experience
- **Accessibility Features**: WCAG compliance, screen reader support
- **Advanced Animations**: More sophisticated micro-interactions
- **Custom Components**: Enhanced form controls, data visualization components

### 📊 Analytics & Reporting
- **Performance Analytics**: Detailed performance breakdowns
- **Skill Gap Analysis**: Identify areas for improvement
- **Interview Insights**: AI-powered recommendations
- **Export Functionality**: PDF reports, data export

### 🔧 Technical Enhancements
- **Real-time Features**: WebSocket integration for live interviews
- **Video Integration**: Video interview capabilities
- **File Upload**: Profile image upload with Cloudinary integration for profile image upload
- **Advanced AI Features**: Voice recognition, sentiment analysis
- **Caching System**: Redis integration for better performance
- **Testing Suite**: Comprehensive unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent question generation and evaluation
- React community for excellent documentation and resources
- React bits for custom UI components
- TailwindCSS for the utility-first CSS framework
- All contributors and testers

---

**Note**: This project is actively under development. Some features may be incomplete or subject to change. For the latest updates and feature requests, please check the issues section.
