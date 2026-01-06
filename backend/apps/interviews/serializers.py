from rest_framework import serializers
from .models import Interview, JobDescription, Question, Answer, InterviewReport, ATSMatch
from apps.resumes.serializers import ResumeSerializer


class JobDescriptionSerializer(serializers.ModelSerializer):
    """Serializer for JobDescription model"""
    resume_details = ResumeSerializer(source='resume', read_only=True)
    
    class Meta:
        model = JobDescription
        fields = [
            'id',
            'title',
            'company',
            'description',
            'required_skills',
            'experience_level',
            'location',
            'salary_range',
            'resume',
            'resume_details',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobDescriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating JobDescription"""
    
    class Meta:
        model = JobDescription
        fields = [
            'title',
            'company',
            'description',
            'required_skills',
            'experience_level',
            'location',
            'salary_range',
            'resume',
        ]
    
    def validate_description(self, value):
        """Validate description is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError('Job description cannot be empty')
        return value
    
    def validate_title(self, value):
        """Validate title is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError('Job title cannot be empty')
        return value


class InterviewSerializer(serializers.ModelSerializer):
    """Serializer for Interview model"""
    resume_details = ResumeSerializer(source='resume', read_only=True)
    job_description_details = JobDescriptionSerializer(source='job_description', read_only=True)
    
    class Meta:
        model = Interview
        fields = [
            'id',
            'resume',
            'resume_details',
            'job_description',
            'job_description_details',
            'status',
            'title',
            'current_question_index',
            'total_questions',
            'time_limit_minutes',
            'started_at',
            'completed_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'status',
            'title',
            'current_question_index',
            'total_questions',
            'started_at',
            'completed_at',
            'created_at',
            'updated_at',
        ]


class InterviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Interview"""
    
    class Meta:
        model = Interview
        fields = [
            'resume',
            'job_description',
            'title',
            'time_limit_minutes',
        ]
    
    def validate(self, data):
        """Validate that at least resume or job_description is provided"""
        if not data.get('resume') and not data.get('job_description'):
            raise serializers.ValidationError(
                'Either resume or job_description must be provided'
            )
        return data


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model"""
    
    class Meta:
        model = Question
        fields = [
            'id',
            'interview',
            'question_text',
            'question_type',
            'order_index',
            'difficulty',
            'is_mcq',
            'options',
            'correct_answer',
            'skill_tags',
            'generated_by_ai',
            'ai_model',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'generated_by_ai',
            'ai_model',
            'created_at',
            'updated_at',
        ]


class QuestionGenerateSerializer(serializers.Serializer):
    """Serializer for question generation request"""
    num_questions = serializers.IntegerField(
        default=5,
        min_value=1,
        max_value=20,
        help_text='Number of questions to generate (1-20)'
    )


class AnswerSerializer(serializers.ModelSerializer):
    """Serializer for Answer model"""
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_is_mcq = serializers.BooleanField(source='question.is_mcq', read_only=True)
    question_options = serializers.JSONField(source='question.options', read_only=True)
    question_correct_answer = serializers.CharField(source='question.correct_answer', read_only=True)
    
    class Meta:
        model = Answer
        fields = [
            'id',
            'interview',
            'question',
            'question_text',
            'question_is_mcq',
            'question_options',
            'question_correct_answer',
            'answer_text',
            'selected_option',
            'is_correct',
            'audio_file',
            'score',
            'evaluation',
            'strengths',
            'improvements',
            'duration_seconds',
            'transcribed',
            'evaluated',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'question_is_mcq',
            'question_options',
            'question_correct_answer',
            'is_correct',
            'score',
            'evaluation',
            'strengths',
            'improvements',
            'transcribed',
            'evaluated',
            'created_at',
            'updated_at',
        ]


class AnswerCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Answer"""
    
    class Meta:
        model = Answer
        fields = [
            'interview',
            'question',
            'answer_text',
            'audio_file',
            'duration_seconds',
        ]


class InterviewHistorySerializer(serializers.ModelSerializer):
    """Comprehensive serializer for interview history with results"""
    job_description = JobDescriptionSerializer(read_only=True)
    resume_details = ResumeSerializer(source='resume', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    answers = serializers.SerializerMethodField()
    report = serializers.SerializerMethodField()
    total_score = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Interview
        fields = [
            'id',
            'resume',
            'resume_details',
            'job_description',
            'title',
            'status',
            'time_limit_minutes',
            'current_question_index',
            'total_questions',
            'started_at',
            'completed_at',
            'created_at',
            'updated_at',
            # Related data
            'questions',
            'answers',
            'report',
            'total_score',
            'average_score',
            'completion_percentage',
        ]
    
    def get_answers(self, obj):
        """Get all answers for this interview"""
        from .models import Answer
        answers = Answer.objects.filter(interview=obj).order_by('question__order_index')
        return AnswerSerializer(answers, many=True).data
    
    def get_report(self, obj):
        """Get interview report if available"""
        try:
            report = obj.report
            return InterviewReportSerializer(report).data
        except:
            return None
    
    def get_total_score(self, obj):
        """Calculate total score from all answers"""
        from .models import Answer
        answers = Answer.objects.filter(interview=obj)
        total = sum(float(answer.score) for answer in answers if answer.score is not None)
        return round(total, 2)
    
    def get_average_score(self, obj):
        """Calculate average score from all answers"""
        from .models import Answer
        answers = Answer.objects.filter(interview=obj)
        scored_answers = [a for a in answers if a.score is not None]
        if not scored_answers:
            return 0.0
        avg = sum(float(answer.score) for answer in scored_answers) / len(scored_answers)
        return round(avg, 2)
    
    def get_completion_percentage(self, obj):
        """Calculate completion percentage"""
        if obj.total_questions == 0:
            return 0.0
        from .models import Answer
        answered_count = Answer.objects.filter(interview=obj).count()
        percentage = (answered_count / obj.total_questions) * 100
        return round(percentage, 2)


class InterviewReportSerializer(serializers.ModelSerializer):
    """Serializer for InterviewReport model"""
    interview_details = InterviewSerializer(source='interview', read_only=True)
    
    class Meta:
        model = InterviewReport
        fields = [
            'id',
            'interview',
            'interview_details',
            'overall_score',
            'technical_score',
            'behavioral_score',
            'communication_score',
            'summary',
            'strengths',
            'areas_for_improvement',
            'recommendations',
            'total_questions',
            'questions_answered',
            'average_answer_length',
            'generated_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'generated_at',
            'updated_at',
        ]


class ATSMatchSerializer(serializers.ModelSerializer):
    """Serializer for ATSMatch model"""
    job_description_details = JobDescriptionSerializer(source='job_description', read_only=True)
    resume_details = ResumeSerializer(source='resume', read_only=True)
    match_percentage = serializers.ReadOnlyField()
    is_strong_match = serializers.ReadOnlyField()
    is_moderate_match = serializers.ReadOnlyField()
    is_weak_match = serializers.ReadOnlyField()
    
    class Meta:
        model = ATSMatch
        fields = [
            'id',
            'job_description',
            'job_description_details',
            'resume',
            'resume_details',
            'overall_score',
            'skills_score',
            'experience_score',
            'education_score',
            'match_analysis',
            'strengths',
            'gaps',
            'recommendations',
            'status',
            'match_percentage',
            'is_strong_match',
            'is_moderate_match',
            'is_weak_match',
            'created_at',
            'updated_at',
            'matched_at',
        ]
        read_only_fields = [
            'id',
            'overall_score',
            'skills_score',
            'experience_score',
            'education_score',
            'match_analysis',
            'strengths',
            'gaps',
            'recommendations',
            'match_percentage',
            'is_strong_match',
            'is_moderate_match',
            'is_weak_match',
            'created_at',
            'updated_at',
            'matched_at',
        ]
