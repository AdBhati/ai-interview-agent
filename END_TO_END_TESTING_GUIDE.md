# End-to-End Testing Guide

Complete step-by-step guide to test the AI Interview System from frontend.

## Prerequisites

1. ✅ Backend server running (Django)
2. ✅ Frontend server running (Next.js)
3. ✅ PostgreSQL database running
4. ✅ Redis running (for Channels/Celery)
5. ✅ API keys configured in `.env`

---

## Step 1: Start All Services

### Terminal 1: Start Django Backend
```bash
cd ai-interview-system/backend
source venv/bin/activate
python manage.py runserver
```
**Expected:** Server running on `http://localhost:8000`

### Terminal 2: Start Next.js Frontend
```bash
cd ai-interview-system/frontend
npm run dev
```
**Expected:** Server running on `http://localhost:3000`

### Terminal 3: Start Redis (if not running)
```bash
redis-server
```
**Expected:** Redis running on port 6379

---

## Step 2: Open the Application

1. Open browser: `http://localhost:3000`
2. You should see the **AI Interview System** landing page
3. Click **"Get Started"** button

---

## Step 3: Upload Resume (Feature 1 & 2)

### What to Test:
- PDF file upload
- Text extraction
- Status updates

### Steps:
1. You'll be redirected to `/upload` page
2. Click on the upload area or drag & drop a PDF resume
3. Select a PDF file (any resume PDF)
4. Click **"Upload Resume"** button

### Expected Results:
- ✅ File uploads successfully
- ✅ Status shows "Processing..."
- ✅ Status changes to "Extracted"
- ✅ Extracted text preview appears
- ✅ Character count displayed
- ✅ Success message: "Resume uploaded and text extracted successfully!"
- ✅ Auto-redirect to `/interview` page after 1.5 seconds

### If Issues:
- Check browser console for errors
- Check Django terminal for backend errors
- Verify file is PDF format
- Check file size (max 10MB)

---

## Step 4: Create Job Description (Feature 3)

### What to Test:
- Job description form
- Data validation
- Linking to resume

### Steps:
1. After resume upload, you'll be on `/interview` page
2. Or navigate to `/job-description` manually
3. Fill in the form:
   - **Job Title**: e.g., "Software Engineer"
   - **Company**: e.g., "Tech Corp"
   - **Description**: e.g., "We are looking for a skilled software engineer..."
   - **Required Skills**: e.g., "Python, React, Django"
   - **Experience Level**: Select from dropdown
   - **Location**: e.g., "Remote"
   - **Salary Range**: e.g., "$80k - $120k" (optional)
4. Click **"Save & Continue to Interview"**

### Expected Results:
- ✅ Form validates correctly
- ✅ Job description saved
- ✅ Success message appears
- ✅ Auto-redirect to `/interview` page
- ✅ Job description linked to resume

### If Issues:
- Check if all required fields are filled
- Verify backend is running
- Check browser network tab for API errors

---

## Step 5: Interview Session Creation (Feature 4)

### What to Test:
- Interview session auto-creation
- Resume and JD linking
- Interview status

### Steps:
1. After job description, you'll be on `/interview` page
2. The system automatically:
   - Creates interview session
   - Links resume and job description
   - Starts the interview

### Expected Results:
- ✅ Loading spinner appears briefly
- ✅ Interview page loads
- ✅ Interview title shows: "Interview for [Job Title]"
- ✅ Interview status: "in_progress"
- ✅ Resume and JD info displayed in sidebar
- ✅ Welcome message in chat

### If Issues:
- Check browser console
- Verify localStorage has `resumeId` and `jobDescriptionId`
- Check Django terminal for errors

---

## Step 6: AI Question Generation (Feature 5)

### What to Test:
- AI-generated questions
- Question display
- Progress tracker

### Steps:
1. Wait for questions to generate (2-5 seconds)
2. Check the right sidebar for questions list

### Expected Results:
- ✅ 5 questions generated automatically
- ✅ Questions displayed in Progress Tracker
- ✅ First question marked as "current"
- ✅ First question appears in chat
- ✅ Questions are relevant to resume/JD

### If Issues:
- Check OpenRouter API key in `.env`
- Check Django terminal for API errors
- If API fails, default questions will be used
- Verify `OPENROUTER_API_KEY` is set correctly

---

## Step 7: Answer Questions (Feature 7, 8, 9)

### Option A: Text Answer

#### Steps:
1. Type your answer in the chat input box
2. Click **"Send"** or press Enter
3. Wait for evaluation (2-3 seconds)

#### Expected Results:
- ✅ Your answer appears in chat
- ✅ Evaluation message appears
- ✅ Score displayed (e.g., "Score: 7.5/10")
- ✅ Next question automatically appears
- ✅ Progress tracker updates
- ✅ Current question moves to next

### Option B: Audio Answer

#### Steps:
1. Click the **red microphone button** to start recording
2. Speak your answer (up to 5 minutes)
3. Click the button again to stop recording
4. Wait for transcription and evaluation

#### Expected Results:
- ✅ Recording indicator shows
- ✅ Timer displays recording duration
- ✅ Audio preview appears after recording
- ✅ Transcription appears in chat
- ✅ Evaluation with score appears
- ✅ Next question loads

### If Issues:
- **Audio not recording**: Check browser permissions for microphone
- **Transcription fails**: Check Speechmatics API key
- **Evaluation fails**: Check OpenRouter API key
- **No next question**: Check if all questions are answered

---

## Step 8: Complete Interview (Feature 10)

### Steps:
1. Answer all questions (or at least a few)
2. Click **"Complete Interview"** button (top right)
3. Wait for report generation (2-3 seconds)
4. You'll be redirected to `/results` page

### Expected Results:
- ✅ Interview status changes to "completed"
- ✅ Report generation starts
- ✅ Redirect to results page
- ✅ Report displays with:
  - Overall score
  - Technical score
  - Behavioral score
  - Communication score
  - Summary
  - Strengths
  - Areas for improvement
  - Recommendations
  - Statistics

---

## Step 9: View Results Report

### What to Test:
- Report display
- Score breakdown
- Recommendations

### Steps:
1. Review the report on `/results` page
2. Check all sections:
   - Overall score (0-10)
   - Score breakdown by category
   - Summary text
   - Strengths list
   - Improvement areas
   - Recommendations
   - Statistics (questions answered, etc.)

### Expected Results:
- ✅ All scores displayed correctly
- ✅ Color coding (green/yellow/red) based on scores
- ✅ Detailed feedback in each section
- ✅ Statistics accurate
- ✅ Professional formatting

---

## Complete Test Flow Summary

```
1. Open http://localhost:3000
   ↓
2. Click "Get Started"
   ↓
3. Upload Resume PDF
   ✅ Text extracted
   ↓
4. Create Job Description
   ✅ Saved and linked
   ↓
5. Interview Page Loads
   ✅ Session created
   ↓
6. AI Questions Generated
   ✅ 5 questions appear
   ↓
7. Answer Questions (Text or Audio)
   ✅ Evaluated with scores
   ↓
8. Complete Interview
   ✅ Report generated
   ↓
9. View Results
   ✅ Full report displayed
```

---

## Quick Test Checklist

- [ ] Backend server running (port 8000)
- [ ] Frontend server running (port 3000)
- [ ] Resume uploads successfully
- [ ] Text extraction works
- [ ] Job description saves
- [ ] Interview session creates
- [ ] AI questions generate
- [ ] Text answers submit and evaluate
- [ ] Audio recording works
- [ ] Audio transcription works
- [ ] Answer evaluation works
- [ ] Report generates
- [ ] Results page displays correctly

---

## Troubleshooting Common Issues

### Issue: "Failed to initialize interview"
**Solution:**
- Check if resume or JD exists in localStorage
- Go back to upload page and re-upload resume
- Check browser console for errors

### Issue: "Questions not generating"
**Solution:**
- Verify OpenRouter API key in `.env`
- Check Django terminal for API errors
- System will use default questions as fallback

### Issue: "Audio not recording"
**Solution:**
- Allow microphone permissions in browser
- Use Chrome browser (best support)
- Check browser console for errors

### Issue: "Transcription not working"
**Solution:**
- Verify Speechmatics API key in `.env`
- Check API key is correct
- Check Django terminal for API errors

### Issue: "Evaluation not working"
**Solution:**
- Verify OpenRouter API key
- Check if answer text is provided
- Check Django terminal for errors

### Issue: "Report not generating"
**Solution:**
- Make sure interview is completed
- Check if answers are evaluated
- Check Django terminal for errors

---

## Testing Different Scenarios

### Scenario 1: Text-Only Interview
1. Upload resume
2. Create JD
3. Answer all questions via text
4. Complete interview
5. View report

### Scenario 2: Audio-Only Interview
1. Upload resume
2. Create JD
3. Answer all questions via audio
4. Complete interview
5. View report

### Scenario 3: Mixed (Text + Audio)
1. Upload resume
2. Create JD
3. Answer some questions via text, some via audio
4. Complete interview
5. View report

### Scenario 4: Without API Keys
1. Test with API keys removed from `.env`
2. System should use fallback/default questions
3. Basic functionality should still work

---

## Browser Console Checks

Open browser DevTools (F12) and check:

### Network Tab:
- ✅ All API calls return 200/201 status
- ✅ No 404 or 500 errors
- ✅ WebSocket connection established (if using)

### Console Tab:
- ✅ No JavaScript errors
- ✅ API responses logged
- ✅ Success messages appear

### Application Tab (LocalStorage):
- ✅ `resumeId` stored
- ✅ `jobDescriptionId` stored
- ✅ `interviewId` stored

---

## Expected API Calls Flow

1. `POST /api/resumes/upload/` - Upload resume
2. `POST /api/resumes/{id}/extract/` - Extract text
3. `POST /api/interviews/job-descriptions/` - Create JD
4. `POST /api/interviews/` - Create interview
5. `POST /api/interviews/{id}/start/` - Start interview
6. `POST /api/interviews/{id}/generate-questions/` - Generate questions
7. `GET /api/interviews/{id}/questions/` - Get questions
8. `POST /api/interviews/{id}/submit-answer/` - Submit answer
9. `POST /api/interviews/{id}/complete/` - Complete interview
10. `POST /api/interviews/{id}/generate-report/` - Generate report
11. `GET /api/interviews/{id}/report/` - Get report

---

## Performance Expectations

- Resume upload: 1-3 seconds
- Text extraction: 1-2 seconds
- Question generation: 2-5 seconds
- Answer evaluation: 2-4 seconds
- Audio transcription: 5-10 seconds
- Report generation: 2-3 seconds

---

## Success Criteria

✅ All features work end-to-end
✅ No console errors
✅ All API calls succeed
✅ Data persists correctly
✅ UI updates properly
✅ Reports generate accurately
✅ Scores are calculated correctly

---

## Next Steps After Testing

1. Test with different resume types
2. Test with different job descriptions
3. Test edge cases (empty fields, large files, etc.)
4. Test error handling
5. Test with multiple interviews
6. Verify data in Django admin panel

---

## Quick Start Command

```bash
# Terminal 1: Backend
cd ai-interview-system/backend && source venv/bin/activate && python manage.py runserver

# Terminal 2: Frontend  
cd ai-interview-system/frontend && npm run dev

# Then open: http://localhost:3000
```

Happy Testing! 🚀

