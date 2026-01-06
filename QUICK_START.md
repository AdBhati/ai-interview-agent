# Quick Start Guide

Get the AI Interview System up and running in minutes!

## 🚀 Prerequisites

- Node.js 18+ and npm
- Python 3.13+
- Git

## ⚡ Quick Setup (5 minutes)

### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-interview-system
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
SECRET_KEY=your-secret-key-here
DEBUG=True
USE_SQLITE=True
OPENROUTER_API_KEY=your-api-key
LITELLM_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:3000
EOF

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend running at `http://localhost:8000` ✅

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

Frontend running at `http://localhost:3000` ✅

## 🎯 First Steps

1. **Upload a Resume**
   - Go to `http://localhost:3000/upload`
   - Upload a PDF resume
   - Wait for extraction

2. **Create Job Description**
   - Go to `http://localhost:3000/job-description`
   - Click "Create New Job Description"
   - Add required skills (e.g., "Python, React, Django")
   - Save

3. **Match Resume to JD**
   - Go to ATS Matches page
   - View matching scores
   - Click "Conduct Interview"

4. **Take Interview**
   - Configure questions and time
   - Generate questions
   - Take the test
   - View results

## 🔑 API Keys Setup

### Option 1: OpenRouter (Recommended)
1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Get your API key
3. Add to `.env`: `OPENROUTER_API_KEY=your-key`

### Option 2: Google Gemini
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`: `GOOGLE_API_KEY=your-key`
3. Set model: `LITELLM_MODEL=gemini-2.5-flash`

## 📝 Environment Variables

**Backend `.env`**:
```env
SECRET_KEY=your-secret-key
DEBUG=True
USE_SQLITE=True
OPENROUTER_API_KEY=your-key
LITELLM_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Backend
python manage.py runserver 8001

# Frontend
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

**Database errors?**
```bash
cd backend
python manage.py migrate
```

## 📚 Next Steps

- Read [Complete Documentation](./DOCUMENTATION.md)
- Check [API Documentation](./DOCUMENTATION.md#api-documentation)
- Review [Usage Guide](./DOCUMENTATION.md#usage-guide)

## 🎉 You're Ready!

Start using the AI Interview System. For detailed information, see [DOCUMENTATION.md](./DOCUMENTATION.md).

