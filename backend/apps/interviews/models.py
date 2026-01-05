from django.db import models
from apps.resumes.models import Resume
from decimal import Decimal


class Interview(models.Model):
    """
    Interview Session model to track interview sessions
    """
    # Related entities
    resume = models.ForeignKey(
        Resume,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='interviews',
        help_text='Associated resume'
    )
    job_description = models.ForeignKey(
        'JobDescription',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='interviews',
        help_text='Associated job description'
    )
    
    # Interview status
    status = models.CharField(
        max_length=20,
        choices=[
            ('created', 'Created'),
            ('in_progress', 'In Progress'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
        ],
        default='created'
    )
    
    # Interview metadata
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text='Interview title (auto-generated if not provided)'
    )
    current_question_index = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Interview'
        verbose_name_plural = 'Interviews'
    
    def __str__(self):
        return f"Interview #{self.id} - {self.title or 'Untitled'} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Auto-generate title if not provided
        if not self.title:
            if self.job_description:
                self.title = f"Interview for {self.job_description.title}"
            elif self.resume:
                self.title = f"Interview - {self.resume.original_filename}"
            else:
                self.title = f"Interview #{self.id or 'New'}"
        super().save(*args, **kwargs)


class JobDescription(models.Model):
    """
    Job Description model to store job posting details
    """
    # Job details
    title = models.CharField(max_length=255, help_text='Job title/position')
    company = models.CharField(max_length=255, blank=True, help_text='Company name')
    description = models.TextField(help_text='Full job description')
    
    # Requirements
    required_skills = models.TextField(
        blank=True,
        help_text='Required skills (comma-separated or newline-separated)'
    )
    experience_level = models.CharField(
        max_length=50,
        choices=[
            ('entry', 'Entry Level'),
            ('mid', 'Mid Level'),
            ('senior', 'Senior Level'),
            ('executive', 'Executive'),
        ],
        default='mid',
        blank=True
    )
    
    # Optional fields
    location = models.CharField(max_length=255, blank=True, help_text='Job location')
    salary_range = models.CharField(max_length=100, blank=True, help_text='Salary range')
    
    # Related resume (optional - can create JD without resume)
    resume = models.ForeignKey(
        Resume,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='job_descriptions',
        help_text='Associated resume (optional)'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Description'
        verbose_name_plural = 'Job Descriptions'
    
    def __str__(self):
        return f"{self.title} at {self.company or 'Unknown Company'}"


class Question(models.Model):
    """
    Question model to store AI-generated interview questions
    """
    # Related interview
    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name='questions',
        help_text='Associated interview session'
    )
    
    # Question content
    question_text = models.TextField(help_text='The interview question')
    question_type = models.CharField(
        max_length=50,
        choices=[
            ('technical', 'Technical'),
            ('behavioral', 'Behavioral'),
            ('situational', 'Situational'),
            ('general', 'General'),
        ],
        default='general',
        help_text='Type of question'
    )
    
    # MCQ fields
    is_mcq = models.BooleanField(default=False, help_text='Whether this is an MCQ question')
    options = models.JSONField(
        default=list,
        blank=True,
        help_text='MCQ options (list of strings)'
    )
    correct_answer = models.CharField(
        max_length=10,
        blank=True,
        help_text='Correct answer option (A, B, C, D, etc.)'
    )
    
    # Question metadata
    order_index = models.PositiveIntegerField(
        default=0,
        help_text='Order of question in the interview'
    )
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard'),
        ],
        default='medium',
        help_text='Difficulty level'
    )
    
    # AI generation metadata
    generated_by_ai = models.BooleanField(default=True)
    ai_model = models.CharField(
        max_length=100,
        blank=True,
        help_text='AI model used to generate question'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['interview', 'order_index']
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        unique_together = ['interview', 'order_index']
    
    def __str__(self):
        return f"Q{self.order_index + 1}: {self.question_text[:50]}..."


class Answer(models.Model):
    """
    Answer model to store candidate answers to interview questions
    """
    # Related entities
    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name='answers',
        help_text='Associated interview session'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers',
        help_text='The question being answered'
    )
    
    # Answer content
    answer_text = models.TextField(
        blank=True,
        null=True,
        help_text='Transcribed text answer'
    )
    selected_option = models.CharField(
        max_length=10,
        blank=True,
        help_text='Selected MCQ option (A, B, C, D, etc.)'
    )
    is_correct = models.BooleanField(
        null=True,
        blank=True,
        help_text='Whether the MCQ answer is correct (null if not MCQ)'
    )
    audio_file = models.FileField(
        upload_to='answers/audio/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text='Audio recording of the answer'
    )
    
    # Evaluation
    score = models.FloatField(
        default=0.0,
        help_text='Score out of 10'
    )
    evaluation = models.TextField(
        blank=True,
        help_text='AI evaluation of the answer'
    )
    strengths = models.TextField(
        blank=True,
        help_text='Identified strengths in the answer'
    )
    improvements = models.TextField(
        blank=True,
        help_text='Suggested improvements'
    )
    
    # Metadata
    duration_seconds = models.FloatField(
        null=True,
        blank=True,
        help_text='Duration of answer in seconds'
    )
    transcribed = models.BooleanField(
        default=False,
        help_text='Whether audio has been transcribed'
    )
    evaluated = models.BooleanField(
        default=False,
        help_text='Whether answer has been evaluated'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['interview', 'question__order_index']
        verbose_name = 'Answer'
        verbose_name_plural = 'Answers'
    
    def __str__(self):
        return f"Answer to Q{self.question.order_index + 1} - Score: {self.score}/10"


class InterviewReport(models.Model):
    """
    Final report model for completed interviews
    """
    # Related interview
    interview = models.OneToOneField(
        Interview,
        on_delete=models.CASCADE,
        related_name='report',
        help_text='Associated interview session'
    )
    
    # Overall scores
    overall_score = models.FloatField(
        default=0.0,
        help_text='Overall interview score out of 10'
    )
    technical_score = models.FloatField(
        default=0.0,
        help_text='Technical questions score'
    )
    behavioral_score = models.FloatField(
        default=0.0,
        help_text='Behavioral questions score'
    )
    communication_score = models.FloatField(
        default=0.0,
        help_text='Communication score'
    )
    
    # Report content
    summary = models.TextField(
        help_text='Overall interview summary'
    )
    strengths = models.TextField(
        help_text='Overall strengths identified'
    )
    areas_for_improvement = models.TextField(
        help_text='Areas that need improvement'
    )
    recommendations = models.TextField(
        help_text='Recommendations for the candidate'
    )
    
    # Statistics
    total_questions = models.PositiveIntegerField(default=0)
    questions_answered = models.PositiveIntegerField(default=0)
    average_answer_length = models.FloatField(default=0.0)
    
    # Timestamps
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-generated_at']
        verbose_name = 'Interview Report'
        verbose_name_plural = 'Interview Reports'
    
    def __str__(self):
        return f"Report for Interview #{self.interview.id} - Score: {self.overall_score}/10"


class ATSMatch(models.Model):
    """
    ATS Matching model to store job description and resume matching results
    """
    job_description = models.ForeignKey(
        JobDescription,
        on_delete=models.CASCADE,
        related_name='ats_matches',
        help_text='Job description being matched'
    )
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name='ats_matches',
        help_text='Resume being matched'
    )
    
    # Match scores (0-100)
    overall_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text='Overall ATS match score (0-100)'
    )
    skills_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text='Skills match score (0-100)'
    )
    experience_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text='Experience match score (0-100)'
    )
    education_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text='Education match score (0-100)'
    )
    
    # AI Analysis
    match_analysis = models.TextField(
        blank=True,
        help_text='Detailed AI analysis of the match'
    )
    strengths = models.TextField(
        blank=True,
        help_text='Key strengths identified'
    )
    gaps = models.TextField(
        blank=True,
        help_text='Gaps or missing requirements'
    )
    recommendations = models.TextField(
        blank=True,
        help_text='Recommendations for improvement'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('matched', 'Matched'),
            ('reviewed', 'Reviewed'),
            ('rejected', 'Rejected'),
        ],
        default='matched',
        help_text='Match status'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    matched_at = models.DateTimeField(auto_now_add=True, help_text='When the match was created')
    
    class Meta:
        ordering = ['-overall_score', '-created_at']
        verbose_name = 'ATS Match'
        verbose_name_plural = 'ATS Matches'
        unique_together = ['job_description', 'resume']  # One match per JD-Resume pair
    
    def __str__(self):
        return f"Match: {self.resume.original_filename} → {self.job_description.title} ({self.overall_score}%)"
    
    @property
    def match_percentage(self):
        """Return match score as percentage"""
        return float(self.overall_score)
    
    @property
    def is_strong_match(self):
        """Return True if match score is >= 70%"""
        return self.overall_score >= Decimal('70.0')
    
    @property
    def is_moderate_match(self):
        """Return True if match score is between 50-70%"""
        return Decimal('50.0') <= self.overall_score < Decimal('70.0')
    
    @property
    def is_weak_match(self):
        """Return True if match score is < 50%"""
        return self.overall_score < Decimal('50.0')
