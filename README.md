# AI Interview System

A comprehensive AI-powered interview practice platform built with Django (Backend) and Next.js (Frontend). Practice your interview skills with AI-generated questions, get real-time feedback, and receive detailed performance reports.

## 🚀 Features

### Core Features
1. **Resume Upload** - Upload PDF resumes with automatic text extraction
2. **Job Description Input** - Create and manage job descriptions
3. **Interview Session Creation** - Create personalized interview sessions
4. **AI Question Generation** - Generate relevant interview questions using AI (OpenRouter/OpenAI)
5. **WebSocket Chat** - Real-time interview conversation
6. **Audio Recording** - Record answers using browser microphone
7. **Speech-to-Text** - Transcribe audio answers using Speechmatics API
8. **Answer Evaluation** - AI-powered answer scoring and feedback
9. **Final Report Generation** - Comprehensive interview performance reports

## 🛠️ Tech Stack

### Backend
- **Django 5.0+** - Web framework
- **Django REST Framework** - API development
- **Django Channels** - WebSocket support
- **PostgreSQL** - Database (SQLite for development)
- **Redis** - Message broker for Channels/Celery
- **LiteLLM** - LLM integration (OpenRouter/OpenAI)
- **PyPDF2** - PDF text extraction
- **Celery** - Background task processing

### Frontend
- **Next.js 16** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Web Audio API** - Audio recording

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (or use SQLite for development)
- Redis (for Channels/Celery)
- pip and virtualenv
- npm or pnpm

## 🔧 Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ai-interview-system/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ai-interview-system/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 🔑 API Keys Configuration

### Required API Keys

1. **OpenRouter API Key** (for AI features)
   - Get from: https://openrouter.ai/
   - Add to `.env`: `OPENROUTER_API_KEY=your-key-here`
   - Also set: `LITELLM_MODEL=openrouter/anthropic/claude-3-haiku`

2. **Speechmatics API Key** (for speech-to-text)
   - Get from: https://www.speechmatics.com/
   - Add to `.env`: `SPEECHMATICS_API_KEY=your-key-here`

### Environment Variables

Create `.env` file in `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_NAME=ai_interview_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
USE_SQLITE=False

# Celery/Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# API Keys
OPENROUTER_API_KEY=your-openrouter-key
SPEECHMATICS_API_KEY=your-speechmatics-key
LITELLM_MODEL=openrouter/anthropic/claude-3-haiku
```

## 📁 Project Structure

```
ai-interview-system/
├── backend/
│   ├── apps/
│   │   ├── users/          # User management
│   │   ├── resumes/        # Resume upload & extraction
│   │   ├── interviews/      # Interview sessions, questions, answers, reports
│   │   ├── audio/          # Audio processing
│   │   └── reports/        # Report generation
│   ├── config/             # Django settings
│   ├── media/              # Uploaded files
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── upload/         # Resume upload page
    │   ├── job-description/ # Job description page
    │   ├── interview/      # Interview page
    │   └── results/       # Results/report page
    ├── components/         # React components
    ├── services/           # API service
    └── package.json
```

## 🚀 Usage

### Complete Flow

1. **Upload Resume**
   - Go to `/upload`
   - Upload PDF resume
   - Text is automatically extracted

2. **Create Job Description**
   - Go to `/job-description`
   - Fill in job details
   - Save and continue

3. **Start Interview**
   - Interview session is created automatically
   - AI generates 5 personalized questions
   - Answer questions via text or audio

4. **Get Feedback**
   - Each answer is evaluated with AI
   - Receive scores and feedback
   - See progress in real-time

5. **View Report**
   - Complete interview
   - Report is generated automatically
   - View detailed performance analysis

## 📡 API Endpoints

### Resume
- `POST /api/resumes/upload/` - Upload resume
- `GET /api/resumes/` - List resumes
- `GET /api/resumes/{id}/` - Get resume
- `POST /api/resumes/{id}/extract/` - Extract text

### Job Description
- `POST /api/interviews/job-descriptions/` - Create JD
- `GET /api/interviews/job-descriptions/` - List JDs
- `GET /api/interviews/job-descriptions/{id}/` - Get JD

### Interview
- `POST /api/interviews/` - Create interview
- `GET /api/interviews/{id}/` - Get interview
- `POST /api/interviews/{id}/start/` - Start interview
- `POST /api/interviews/{id}/complete/` - Complete interview
- `POST /api/interviews/{id}/generate-questions/` - Generate questions
- `GET /api/interviews/{id}/questions/` - Get questions
- `POST /api/interviews/{id}/submit-answer/` - Submit answer
- `POST /api/interviews/{id}/generate-report/` - Generate report
- `GET /api/interviews/{id}/report/` - Get report

## 🧪 Testing

See `END_TO_END_TESTING_GUIDE.md` for complete testing instructions.

Quick test:
1. Start backend: `python manage.py runserver`
2. Start frontend: `npm run dev`
3. Open: `http://localhost:3000`
4. Follow the flow: Upload → JD → Interview → Results

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check PostgreSQL is running
- Verify `.env` file exists
- Check database migrations: `python manage.py migrate`

**Frontend not connecting:**
- Verify backend is running on port 8000
- Check CORS settings in `settings.py`
- Check browser console for errors

**API keys not working:**
- Verify keys in `.env` file
- Restart Django server after adding keys
- Check API key format (no extra spaces)

**Audio not recording:**
- Allow microphone permissions
- Use Chrome browser (best support)
- Check browser console

## 📝 Documentation

- `API_KEYS_SETUP.md` - API key configuration guide
- `OPENROUTER_SETUP.md` - OpenRouter setup guide
- `END_TO_END_TESTING_GUIDE.md` - Complete testing guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for AI-powered interview practice

## 🙏 Acknowledgments

- Django & Django REST Framework
- Next.js & React
- OpenRouter for LLM access
- Speechmatics for speech-to-text
- All open-source contributors

---

**Happy Interviewing! 🎯**

