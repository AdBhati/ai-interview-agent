# API Keys Setup Guide

This guide explains how to get and configure API keys for the AI Interview System.

## Required API Keys

### 1. OpenAI API Key (Required for AI Features)

The system uses OpenAI's API (via LiteLLM) for:
- Generating interview questions
- Evaluating candidate answers
- Generating interview reports

#### How to Get OpenAI API Key:

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com/
   - Sign up or log in to your account

2. **Navigate to API Keys**
   - Click on your profile (top right)
   - Select "API keys" from the dropdown
   - Or go directly to: https://platform.openai.com/api-keys

3. **Create New API Key**
   - Click "Create new secret key"
   - Give it a name (e.g., "AI Interview System")
   - Copy the key immediately (you won't be able to see it again!)

4. **Add Credits/Billing**
   - Go to: https://platform.openai.com/account/billing
   - Add payment method
   - Add credits (minimum $5 recommended for testing)

5. **Set Usage Limits (Optional but Recommended)**
   - Go to: https://platform.openai.com/account/limits
   - Set monthly spending limits to control costs

#### Pricing Information:
- GPT-3.5-turbo: ~$0.0015 per 1K tokens (very affordable)
- GPT-4: ~$0.03 per 1K tokens (more expensive but better quality)
- For this project, GPT-3.5-turbo is sufficient and cost-effective

---

### 2. Speechmatics API Key (Optional - for Speech-to-Text)

Currently, the system has a placeholder for Speechmatics. For actual transcription:

#### Option A: Use Speechmatics
1. Visit: https://www.speechmatics.com/
2. Sign up for an account
3. Get your API key from the dashboard
4. Update the `transcribe_audio_speechmatics()` function in `apps/interviews/utils.py`

#### Option B: Use OpenAI Whisper (Recommended - Free Alternative)
OpenAI Whisper API is cheaper and easier to integrate:
1. Use the same OpenAI API key
2. Update the transcription function to use OpenAI's Whisper API
3. Cost: ~$0.006 per minute of audio

#### Option C: Use Browser's Built-in Speech Recognition (Free)
- Use Web Speech API (already available in Chrome)
- No API key needed
- Works client-side
- Less accurate but free

---

## Configuration Steps

### Step 1: Create/Update .env File

Navigate to the backend directory and create/update `.env` file:

```bash
cd ai-interview-system/backend
```

Create or edit `.env` file:

```env
# Django Settings
SECRET_KEY=django-insecure-k6v&r_1w#(x90q#ys!6ry-oj3jeuop$wa=o3@=-clv5wk2wegi
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (PostgreSQL)
DB_NAME=ai_interview_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Use SQLite for development (set to True to use SQLite instead of PostgreSQL)
USE_SQLITE=False

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# OpenAI API Key (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# LiteLLM Configuration (Optional - uses OpenAI by default)
LITELLM_MODEL=gpt-3.5-turbo

# Speechmatics API Key (Optional - for speech-to-text)
SPEECHMATICS_API_KEY=your-speechmatics-key-here
```

### Step 2: Add Your API Key

Replace `sk-your-openai-api-key-here` with your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

**Important Security Notes:**
- Never commit `.env` file to Git
- The `.env` file is already in `.gitignore`
- Keep your API key secret
- Don't share it publicly

### Step 3: Verify Configuration

Test if the API key works:

```bash
# In backend directory
cd ai-interview-system/backend
source venv/bin/activate

# Test OpenAI connection
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    print('✅ API Key found:', api_key[:10] + '...')
else:
    print('❌ API Key not found!')
"
```

---

## Testing Without API Key

If you don't have an API key yet, the system will:
- ✅ Still work for basic features (resume upload, job description, interview creation)
- ✅ Use default questions instead of AI-generated ones
- ✅ Use placeholder evaluations instead of AI evaluations
- ❌ Won't generate personalized questions
- ❌ Won't provide detailed answer evaluations

---

## Cost Estimation

For a typical interview session:
- **Question Generation**: ~500 tokens = $0.00075
- **Answer Evaluation (per answer)**: ~300 tokens = $0.00045
- **Report Generation**: ~800 tokens = $0.0012
- **Total per interview**: ~$0.01-0.02 (very affordable!)

**Monthly estimate for 100 interviews**: ~$1-2

---

## Troubleshooting

### Error: "API key not found"
- Check that `.env` file exists in `backend/` directory
- Verify the key name is exactly `OPENAI_API_KEY`
- Restart Django server after adding the key

### Error: "Insufficient quota"
- Add credits to your OpenAI account
- Check billing settings

### Error: "Invalid API key"
- Verify the key is correct (starts with `sk-`)
- Make sure there are no extra spaces
- Try creating a new API key

---

## Alternative: Use Free Tier Services

If you want to test without paying:

1. **Hugging Face Inference API** (Free tier available)
   - Update `LITELLM_MODEL` to use Hugging Face models
   - Slower but free for testing

2. **Local LLM** (Completely free)
   - Run models locally using Ollama
   - No API costs but requires more setup

---

## Next Steps

1. Get your OpenAI API key
2. Add it to `.env` file
3. Restart the Django server
4. Test question generation in the interview page

For questions or issues, check the logs in the Django console.

