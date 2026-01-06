# AI Interview System - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup Instructions](#setup-instructions)
6. [API Documentation](#api-documentation)
7. [Frontend Guide](#frontend-guide)
8. [Backend Guide](#backend-guide)
9. [Deployment](#deployment)
10. [Usage Guide](#usage-guide)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

AI Interview System is a comprehensive full-stack application that automates the interview process using AI. It includes:

- **ATS (Applicant Tracking System) Matching**: Automatically matches resumes to job descriptions
- **AI-Powered Question Generation**: Generates interview questions based on job requirements
- **MCQ & Open-Ended Tests**: Supports both multiple-choice and coding questions
- **Real-Time Video Monitoring**: Anti-cheating features with camera/mic monitoring
- **Automated Evaluation**: AI evaluates answers and generates detailed reports
- **Interview History**: Track and review all past interviews

---

## ✨ Features

### 1. Job Description Management
- Create, read, update, and delete job descriptions
- Store required skills, experience level, and other details
- Link job descriptions to resumes

### 2. Resume Management
- Upload PDF resumes
- Automatic text extraction from PDFs
- Resume status tracking (uploaded, extracted, processed)

### 3. ATS Matching
- Automatic matching of resumes to job descriptions
- Scoring system (overall, skills, experience, education)
- Visual match indicators (Strong/Moderate/Weak)
- Filter matched and unmatched resumes

### 4. Interview Configuration
- Set number of questions
- Configure time limits
- Link resume and job description

### 5. AI Question Generation
- Skill-based question generation using AI (Gemini/OpenRouter)
- Mix of MCQ and open-ended coding questions
- Questions tailored to job requirements
- Skill tags for each question

### 6. Test Engine
- MCQ questions with multiple options
- Open-ended coding questions
- Timer with auto-submission
- Progress tracking
- Question navigation

### 7. Video Monitoring (Anti-Cheating)
- Automatic camera/microphone access
- Real-time video feed
- Mobile device detection
- Multiple person detection (basic)
- Violation warnings

### 8. Answer Evaluation
- Automatic scoring for MCQ questions
- AI-powered evaluation for open-ended questions
- Detailed feedback and scores

### 9. Report Generation
- Comprehensive interview reports
- Score breakdowns
- Skill-based analysis
- Performance metrics

### 10. Interview History
- View all past interviews
- Filter by status, resume, or job description
- Access detailed results and reports
- Pagination support

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19.2.3)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios 1.13.2
- **Deployment**: Vercel

### Backend
- **Framework**: Django 6.0
- **REST API**: Django REST Framework
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **AI Integration**: LiteLLM (OpenRouter, Gemini)
- **Task Queue**: Celery (with Redis)
- **WebSockets**: Django Channels
- **Deployment**: Heroku

### AI Services
- **Question Generation**: Gemini 2.5 Flash / OpenRouter
- **Answer Evaluation**: Gemini / OpenRouter
- **Text Extraction**: PyPDF2

### Infrastructure
- **Version Control**: Git / GitHub
- **CI/CD**: Automatic deployment (Vercel + Heroku)
- **Environment**: Python 3.13, Node.js

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js (Vercel)
│   (React/TS)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │  Django REST (Heroku)
│   (Python)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│  DB   │ │  AI   │
│Postgres│ │Gemini │
└───────┘ └───────┘
```

### Frontend Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── upload/            # Resume upload
│   ├── job-description/   # JD management
│   ├── ats-matches/       # ATS matching results
│   ├── interview-config/   # Interview setup
│   ├── interview/         # Test engine
│   ├── results/           # Interview results
│   ├── interview-history/ # History page
│   └── test-video/        # Video monitoring test
├── components/             # React components
│   ├── VideoMonitoring.tsx
│   ├── AudioRecorder.tsx
│   └── ChatUI.tsx
└── services/               # API client
    └── api.ts
```

### Backend Structure

```
backend/
├── apps/
│   ├── interviews/        # Core interview logic
│   │   ├── models.py      # Interview, Question, Answer, etc.
│   │   ├── views.py      # API endpoints
│   │   ├── serializers.py
│   │   ├── utils.py      # AI integration
│   │   └── urls.py
│   ├── resumes/          # Resume management
│   ├── users/            # User management
│   └── reports/          # Report generation
├── config/
│   ├── settings.py       # Django settings
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI config
└── requirements.txt
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.13+
- **PostgreSQL** (for production)
- **Redis** (optional, for Celery)
- **Git**

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-interview-system
```

2. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_interview_db
# Or use SQLite for development
USE_SQLITE=True

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True

# AI Services
OPENROUTER_API_KEY=your-openrouter-api-key
LITELLM_MODEL=gemini-2.5-flash
# Or use Gemini directly
GOOGLE_API_KEY=your-google-api-key

# CORS
FRONTEND_URL=http://localhost:3000
CORS_ALLOW_ALL=False

# Celery (optional)
CELERY_BROKER_URL=redis://localhost:6379/0
REDIS_URL=redis://localhost:6379/0
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:8000/api`
- **Production**: `https://your-heroku-app.herokuapp.com/api`

### Authentication
Currently, the API uses `AllowAny` permissions. For production, implement proper authentication.

### Endpoints

#### Job Descriptions

**Create/List Job Descriptions**
```
POST /api/interviews/job-descriptions/
GET /api/interviews/job-descriptions/
```

**Request Body (POST)**:
```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "description": "Full job description...",
  "required_skills": "Python, React, Django",
  "experience_level": "mid",
  "location": "Remote",
  "salary_range": "$80k - $120k"
}
```

**Get Job Description**
```
GET /api/interviews/job-descriptions/{id}/
```

**Update Job Description**
```
PUT /api/interviews/job-descriptions/{id}/update/
```

**Delete Job Description**
```
DELETE /api/interviews/job-descriptions/{id}/delete/
```

#### Resumes

**Upload Resume**
```
POST /api/resumes/upload/
Content-Type: multipart/form-data

Body: file (PDF)
```

**List Resumes**
```
GET /api/resumes/
```

**Get Resume**
```
GET /api/resumes/{id}/
```

**Extract Text from Resume**
```
POST /api/resumes/{id}/extract/
```

#### Interviews

**Create Interview**
```
POST /api/interviews/
```

**Request Body**:
```json
{
  "resume": 1,
  "job_description": 1,
  "time_limit_minutes": 30
}
```

**Get Interview**
```
GET /api/interviews/{id}/
```

**Start Interview**
```
POST /api/interviews/{id}/start/
```

**Complete Interview**
```
POST /api/interviews/{id}/complete/
```

**Generate Questions**
```
POST /api/interviews/{id}/generate-questions/
```

**Request Body**:
```json
{
  "num_questions": 5
}
```

**Get Questions**
```
GET /api/interviews/{id}/questions/
```

**Submit Answer**
```
POST /api/interviews/{id}/submit-answer/
Content-Type: multipart/form-data

Body:
- question: <question_id>
- selected_option: "A" (for MCQ)
- answer_text: "..." (for open-ended)
```

**Get Answers**
```
GET /api/interviews/{id}/answers/
```

**Generate Report**
```
POST /api/interviews/{id}/generate-report/
```

**Get Report**
```
GET /api/interviews/{id}/report/
```

**Get Interview History**
```
GET /api/interviews/history/
Query Params:
- resume_id: <id>
- job_description_id: <id>
- status: created|in_progress|completed|cancelled
- limit: 10
- offset: 0
```

#### ATS Matching

**Match Resume to JD**
```
POST /api/interviews/job-descriptions/{jd_id}/match-resume/
```

**Request Body**:
```json
{
  "resume": 1
}
```

**Match All Resumes**
```
POST /api/interviews/job-descriptions/{jd_id}/match-all-resumes/
```

**Get ATS Matches**
```
GET /api/interviews/job-descriptions/{jd_id}/matches/
```

**Get Resumes for JD**
```
GET /api/interviews/job-descriptions/{jd_id}/resumes/
Query Params:
- matched_only: true|false
- unmatched_only: true|false
```

---

## 🎨 Frontend Guide

### Pages

1. **Home Page** (`/`)
   - Landing page with navigation links

2. **Upload Resume** (`/upload`)
   - Upload PDF resume
   - View upload status

3. **Job Descriptions** (`/job-description`)
   - List all job descriptions
   - Create new job description
   - Navigate to ATS matches

4. **ATS Matches** (`/ats-matches?jd={id}`)
   - View matched resumes
   - View unmatched resumes
   - Start interview for matched resume

5. **Interview Config** (`/interview-config?jd={id}&resume={id}`)
   - Set number of questions
   - Set time limit
   - Create interview

6. **Interview Test** (`/interview?id={id}`)
   - Take MCQ and coding questions
   - Video monitoring active
   - Timer and progress tracking

7. **Results** (`/results?id={id}`)
   - View interview report
   - See scores and feedback

8. **Interview History** (`/interview-history`)
   - View all interviews
   - Filter by status (default: completed)
   - Access detailed reports

9. **Test Video** (`/test-video`)
   - Test video monitoring features

### Components

**VideoMonitoring**
- Camera/mic access
- Real-time video feed
- Mobile detection
- Violation warnings

**API Client** (`services/api.ts`)
- Centralized API calls
- Error handling
- TypeScript types

### State Management
- React hooks (`useState`, `useEffect`)
- URL parameters for navigation
- Local state for UI

---

## 🔧 Backend Guide

### Models

**JobDescription**
- Stores job requirements
- Links to resumes

**Interview**
- Tracks interview session
- Links resume and JD
- Stores status and progress

**Question**
- Generated by AI
- MCQ or open-ended
- Skill tags

**Answer**
- User responses
- Auto-scored for MCQ
- AI-evaluated for open-ended

**ATSMatch**
- Resume-JD matching scores
- Overall, skills, experience, education

### AI Integration

**Question Generation** (`utils.py`)
- Uses LiteLLM with Gemini/OpenRouter
- Skill-based prompts
- JSON response parsing

**Answer Evaluation** (`utils.py`)
- AI-powered evaluation
- Context-aware scoring
- Detailed feedback

**ATS Matching** (`utils.py`)
- Skills matching
- Experience comparison
- Education matching
- Overall score calculation

### Database Schema

```
JobDescription
├── id
├── title
├── company
├── description
├── required_skills
└── ...

Interview
├── id
├── resume (FK)
├── job_description (FK)
├── status
├── time_limit_minutes
└── ...

Question
├── id
├── interview (FK)
├── question_text
├── is_mcq
├── options (JSON)
├── skill_tags (JSON)
└── ...

Answer
├── id
├── question (FK)
├── selected_option
├── answer_text
├── is_correct
└── ...
```

---

## 🚢 Deployment

### Backend (Heroku)

1. **Install Heroku CLI**
```bash
heroku login
```

2. **Create Heroku app**
```bash
heroku create your-app-name
```

3. **Set environment variables**
```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DATABASE_URL=postgresql://...
heroku config:set OPENROUTER_API_KEY=your-key
heroku config:set LITELLM_MODEL=gemini-2.5-flash
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
```

4. **Deploy**
```bash
git push heroku main
```

5. **Run migrations**
```bash
heroku run python manage.py migrate
```

### Frontend (Vercel)

1. **Connect GitHub repository to Vercel**

2. **Set environment variables**
```
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
```

3. **Deploy**
- Automatic on push to main branch

### CORS Configuration

Update `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
]
```

---

## 📖 Usage Guide

### Complete Flow

1. **Upload Resume**
   - Go to `/upload`
   - Upload PDF resume
   - Wait for extraction

2. **Create Job Description**
   - Go to `/job-description`
   - Click "Create New Job Description"
   - Fill in details and required skills
   - Save

3. **ATS Matching**
   - Go to `/ats-matches?jd={id}`
   - View matched resumes
   - Click "Conduct Interview" for a match

4. **Configure Interview**
   - Set number of questions (e.g., 5)
   - Set time limit (e.g., 30 minutes)
   - Click "Create Interview"

5. **Generate Questions**
   - Questions are auto-generated
   - Wait for generation to complete

6. **Take Test**
   - Test starts automatically
   - Camera/mic permissions required
   - Answer MCQ and coding questions
   - Submit when done

7. **View Results**
   - Report is auto-generated
   - View scores and feedback
   - Access from interview history

### Tips

- **Required Skills**: Be specific in job descriptions for better question generation
- **Time Limits**: Set appropriate time limits based on question count
- **Video Monitoring**: Ensure good lighting and stable internet
- **Mobile Devices**: Desktop/laptop recommended for best experience

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
python manage.py test
```

### Frontend Testing

```bash
cd frontend
npm run lint
npm run build
```

### Manual Testing

1. **Test Video Monitoring**
   - Go to `/test-video`
   - Allow camera/mic permissions
   - Check video feed

2. **Test Interview Flow**
   - Complete end-to-end flow
   - Check all pages load correctly
   - Verify API calls work

3. **Test ATS Matching**
   - Upload resume
   - Create JD with matching skills
   - Verify match scores

---

## 🔍 Troubleshooting

### Common Issues

**1. Camera/Mic Not Working**
- Check browser permissions
- Ensure HTTPS in production
- Check browser console for errors

**2. AI Question Generation Fails**
- Verify API keys are set
- Check LiteLLM model name
- Review backend logs

**3. CORS Errors**
- Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check `CORS_ALLOW_CREDENTIALS` setting

**4. Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Review connection settings

**5. Build Errors**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify all dependencies are installed

### Debug Mode

**Backend**:
```python
DEBUG = True  # In settings.py
```

**Frontend**:
- Check browser console
- Use React DevTools
- Check Network tab for API calls

---

## 📝 Environment Variables Reference

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes |
| `DEBUG` | Debug mode | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes (Production) |
| `USE_SQLITE` | Use SQLite for development | No |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes (if using OpenRouter) |
| `GOOGLE_API_KEY` | Google API key | Yes (if using Gemini) |
| `LITELLM_MODEL` | AI model name | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `CELERY_BROKER_URL` | Redis URL for Celery | No |
| `REDIS_URL` | Redis URL | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 👥 Authors

[Add author information]

---

## 🙏 Acknowledgments

- Django REST Framework
- Next.js
- LiteLLM
- Gemini AI
- OpenRouter

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Last Updated**: January 2026

