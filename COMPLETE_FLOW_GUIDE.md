# Complete Flow Guide - AI Interview System

## 🎯 Complete User Flow

### **Screen 1: Job Description Page** (`/job-description`)
- **View:** List of all job descriptions (cards)
- **Actions:**
  - Click "+ Create New JD" to add job description
  - Fill form: Title, Company, Description, Skills, Experience Level, Location, Salary
  - Save JD
  - Click on any JD card → Goes to ATS Matching page

### **Screen 2: ATS Matching Page** (`/ats-matches?jd={id}`)
- **View:** 
  - Job Description header
  - Resume upload section (drag & drop or click to upload)
  - List of all resumes with ATS scores
- **Features:**
  - Upload resume PDF (auto-extracts text)
  - Auto-matches uploaded resume to JD
  - Shows all previously uploaded resumes for this JD
  - Displays ATS match scores (Overall, Skills, Experience, Education)
  - Shows match analysis, strengths, gaps, recommendations
- **Action:**
  - Click "🎯 Conduct Interview" button on any resume → Goes to Interview Config

### **Screen 3: Interview Configuration Page** (`/interview-config?jd={id}&resume={id}&match={id}`)
- **View:**
  - HR/Admin configures test parameters
- **Settings:**
  - **Number of Questions:** Slider (5-10 questions)
  - **Time Limit:** Slider (10-120 minutes)
  - Shows average time per question
- **Action:**
  - Click "🚀 Start Test Engine" → Creates interview, generates MCQ questions, redirects to test

### **Screen 4: MCQ Test Engine** (`/interview?id={id}&questions={n}&time={seconds}`)
- **View:**
  - Timer at top (countdown)
  - Progress bar
  - Current question with 4 MCQ options (A, B, C, D)
  - Question navigation (numbered buttons)
  - Previous/Next buttons
  - Submit button (on last question)
- **Features:**
  - Timer countdown (auto-submits when time runs out)
  - Visual progress indicator
  - Question navigation (jump to any question)
  - Answer tracking (green = answered, blue = current)
  - Auto-evaluation (10 points if correct, 0 if wrong)
- **Action:**
  - Select option → Auto-saved
  - Click Submit → Completes interview, generates report, redirects to results

### **Screen 5: Results Page** (`/results?id={interview_id}`)
- **View:**
  - Overall score
  - Detailed report
  - Strengths and improvements

---

## 📋 Complete Flow Diagram

```
1. Home Page (/)
   ↓
2. Job Description Page (/job-description)
   - Create/View JDs
   - Click JD → ATS Matching
   ↓
3. ATS Matching Page (/ats-matches?jd={id})
   - Upload Resume
   - View All Resumes with ATS Scores
   - Click "Conduct Interview" → Interview Config
   ↓
4. Interview Config Page (/interview-config?jd={id}&resume={id})
   - Set Questions (5-10)
   - Set Time Limit (10-120 min)
   - Click "Start Test Engine" → MCQ Test
   ↓
5. MCQ Test Engine (/interview?id={id}&questions={n}&time={s})
   - Take MCQ Test with Timer
   - Submit → Results
   ↓
6. Results Page (/results?id={id})
   - View Score & Report
```

---

## 🔧 Backend Changes

### Models Updated:
1. **Question Model:**
   - Added `is_mcq` (Boolean)
   - Added `options` (JSONField - array of 4 options)
   - Added `correct_answer` (CharField - A, B, C, D)

2. **Answer Model:**
   - Added `selected_option` (CharField - A, B, C, D)
   - Added `is_correct` (Boolean - auto-calculated)

### API Endpoints:
- All existing endpoints work
- `submit-answer` now accepts `selected_option` for MCQ
- Auto-scores MCQ answers (10 if correct, 0 if wrong)

### Question Generation:
- Updated to generate MCQ questions with 4 options
- Each question has correct answer marked

---

## 🎨 Frontend Changes

### New Pages:
1. **Job Description Page** - List view with create form
2. **ATS Matches Page** - Resume upload + match display
3. **Interview Config Page** - HR sets test parameters
4. **MCQ Test Engine** - Timer-based MCQ test

### Updated:
- Home page - Points to Job Description first
- Interview page - Complete redesign for MCQ format

---

## ✅ Features Implemented

- ✅ Job Description list view
- ✅ Create multiple job descriptions
- ✅ ATS matching with resume upload
- ✅ View all resumes with ATS scores
- ✅ Interview configuration (questions + time)
- ✅ MCQ question generation
- ✅ MCQ test engine with timer
- ✅ Auto-submit on time limit
- ✅ Question navigation
- ✅ Answer tracking
- ✅ Auto-scoring (MCQ)

---

## 🚀 Next Steps

1. **Run migrations:**
   ```bash
   cd backend
   python manage.py migrate
   ```

2. **Deploy to Heroku:**
   ```bash
   git push heroku main
   heroku run python manage.py migrate --app ai-interview-agent
   ```

3. **Test the flow:**
   - Create JD
   - Upload resume
   - View ATS matches
   - Configure interview
   - Take MCQ test

---

## 📝 Flow Summary

**HR/Admin Flow:**
1. Create Job Description
2. View ATS Matches (upload resumes, see scores)
3. Configure Interview (set questions & time)
4. Candidate takes test
5. View results

**Candidate Flow:**
1. Receives test link
2. Takes MCQ test with timer
3. Sees results

🎉 **Complete Flow Implemented!**

