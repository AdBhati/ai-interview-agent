from rest_framework import serializers
from .models import Interview, JobDescription, Question, Answer, InterviewReport
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
    
    class Meta:
        model = Answer
        fields = [
            'id',
            'interview',
            'question',
            'question_text',
            'answer_text',
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
