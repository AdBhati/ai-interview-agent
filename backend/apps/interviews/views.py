import os
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import Interview, JobDescription, Question, Answer, ATSMatch
from .serializers import (
    JobDescriptionSerializer, 
    JobDescriptionCreateSerializer,
    InterviewSerializer,
    InterviewCreateSerializer,
    QuestionSerializer,
    QuestionGenerateSerializer,
    AnswerSerializer,
    ATSMatchSerializer,
    InterviewReportSerializer
)
from .utils import generate_interview_questions, evaluate_answer, calculate_ats_match


@api_view(['GET', 'POST'])
def create_job_description(request):
    """
    Create a new job description (POST) or list all (GET)
    
    POST /api/interviews/job-descriptions/
    GET /api/interviews/job-descriptions/
    
    Query params (for GET):
    - resume_id: Filter by resume ID (optional)
    
    Body (for POST):
    {
        "title": "Software Engineer",
        "company": "Tech Corp",
        "description": "Full job description...",
        "required_skills": "Python, React, Django",
        "experience_level": "mid",
        "location": "Remote",
        "salary_range": "$80k - $120k",
        "resume": 1  // Optional: resume ID
    }
    
    Response:
    {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "description": "...",
        "created_at": "2024-01-05T20:00:00Z"
    }
    """
    if request.method == 'GET':
        # List all job descriptions
        job_descriptions = JobDescription.objects.all()
        
        # Filter by resume if provided
        resume_id = request.query_params.get('resume_id')
        if resume_id:
            try:
                job_descriptions = job_descriptions.filter(resume_id=resume_id)
            except ValueError:
                return Response(
                    {'error': 'Invalid resume_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = JobDescriptionSerializer(job_descriptions, many=True)
        return Response(serializer.data)
    
    # POST - Create new job description
    serializer = JobDescriptionCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        job_description = serializer.save()
        response_serializer = JobDescriptionSerializer(job_description)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_job_description(request, job_description_id):
    """
    Get a specific job description by ID
    
    GET /api/job-descriptions/{id}/
    
    Response:
    {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "description": "...",
        "required_skills": "...",
        "experience_level": "mid",
        "resume_details": {...},
        "created_at": "2024-01-05T20:00:00Z"
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
        serializer = JobDescriptionSerializer(job_description)
        return Response(serializer.data)
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT', 'PATCH'])
def update_job_description(request, job_description_id):
    """
    Update a job description
    
    PUT/PATCH /api/job-descriptions/{id}/
    
    Response:
    {
        "id": 1,
        "title": "Updated Title",
        ...
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
        serializer = JobDescriptionSerializer(
            job_description,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
def delete_job_description(request, job_description_id):
    """
    Delete a job description
    
    DELETE /api/job-descriptions/{id}/
    
    Response:
    {
        "message": "Job description deleted successfully"
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
        job_description.delete()
        return Response(
            {'message': 'Job description deleted successfully'},
            status=status.HTTP_200_OK
        )
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== Interview Session Views ====================

@api_view(['GET', 'POST'])
def create_interview(request):
    """
    Create a new interview session (POST) or list all (GET)
    
    POST /api/interviews/
    GET /api/interviews/
    
    Body (for POST):
    {
        "resume": 1,  // Optional: resume ID
        "job_description": 1,  // Optional: job description ID
        "title": "Custom Title"  // Optional: custom title
    }
    
    Response:
    {
        "id": 1,
        "resume": 1,
        "job_description": 1,
        "status": "created",
        "title": "Interview for Software Engineer",
        "current_question_index": 0,
        "total_questions": 0,
        "created_at": "2024-01-05T20:00:00Z"
    }
    """
    if request.method == 'GET':
        # List all interviews
        interviews = Interview.objects.all()
        
        # Filter by resume if provided
        resume_id = request.query_params.get('resume_id')
        if resume_id:
            try:
                interviews = interviews.filter(resume_id=resume_id)
            except ValueError:
                return Response(
                    {'error': 'Invalid resume_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Filter by job description if provided
        job_description_id = request.query_params.get('job_description_id')
        if job_description_id:
            try:
                interviews = interviews.filter(job_description_id=job_description_id)
            except ValueError:
                return Response(
                    {'error': 'Invalid job_description_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = InterviewSerializer(interviews, many=True)
        return Response(serializer.data)
    
    # POST - Create new interview
    serializer = InterviewCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        interview = serializer.save()
        response_serializer = InterviewSerializer(interview)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def get_interview(request, interview_id):
    """
    Get a specific interview by ID
    
    GET /api/interviews/{id}/
    
    Response:
    {
        "id": 1,
        "resume": 1,
        "job_description": 1,
        "status": "in_progress",
        "title": "...",
        "current_question_index": 2,
        "total_questions": 5,
        "started_at": "2024-01-05T20:00:00Z"
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
        serializer = InterviewSerializer(interview)
        return Response(serializer.data)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def start_interview(request, interview_id):
    """
    Start an interview session
    
    POST /api/interviews/{id}/start/
    
    Response:
    {
        "id": 1,
        "status": "in_progress",
        "started_at": "2024-01-05T20:00:00Z",
        "message": "Interview started"
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
        
        if interview.status == 'completed':
            return Response(
                {'error': 'Cannot start a completed interview'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        interview.status = 'in_progress'
        interview.started_at = timezone.now()
        interview.save()
        
        serializer = InterviewSerializer(interview)
        return Response({
            **serializer.data,
            'message': 'Interview started successfully'
        })
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def complete_interview(request, interview_id):
    """
    Complete an interview session
    
    POST /api/interviews/{id}/complete/
    
    Response:
    {
        "id": 1,
        "status": "completed",
        "completed_at": "2024-01-05T20:00:00Z",
        "message": "Interview completed"
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
        
        interview.status = 'completed'
        interview.completed_at = timezone.now()
        interview.save()
        
        serializer = InterviewSerializer(interview)
        return Response({
            **serializer.data,
            'message': 'Interview completed successfully'
        })
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PATCH'])
def update_interview_progress(request, interview_id):
    """
    Update interview progress (question index, total questions)
    
    PATCH /api/interviews/{id}/progress/
    
    Body:
    {
        "current_question_index": 2,
        "total_questions": 5
    }
    
    Response:
    {
        "id": 1,
        "current_question_index": 2,
        "total_questions": 5
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
        
        current_index = request.data.get('current_question_index')
        total_questions = request.data.get('total_questions')
        
        if current_index is not None:
            interview.current_question_index = current_index
        if total_questions is not None:
            interview.total_questions = total_questions
        
        interview.save()
        
        serializer = InterviewSerializer(interview)
        return Response(serializer.data)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== Question Generation Views ====================

@api_view(['POST'])
def generate_questions(request, interview_id):
    """
    Generate AI interview questions for an interview session
    
    POST /api/interviews/{id}/generate-questions/
    
    Body:
    {
        "num_questions": 5  // Optional: number of questions (default: 5, max: 20)
    }
    
    Response:
    {
        "interview_id": 1,
        "questions_generated": 5,
        "questions": [
            {
                "id": 1,
                "question_text": "...",
                "question_type": "technical",
                "difficulty": "medium",
                "order_index": 0
            },
            ...
        ]
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Validate request data
    serializer = QuestionGenerateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    num_questions = serializer.validated_data.get('num_questions', 5)
    
    # Get resume and job description data
    resume_text = None
    if interview.resume and interview.resume.extracted_text:
        resume_text = interview.resume.extracted_text
    
    job_description = None
    job_title = None
    required_skills = None
    experience_level = None
    
    if interview.job_description:
        job_description = interview.job_description.description
        job_title = interview.job_description.title
        required_skills = interview.job_description.required_skills
        experience_level = interview.job_description.experience_level
    
    # Generate questions using AI
    try:
        questions_data = generate_interview_questions(
            resume_text=resume_text,
            job_description=job_description,
            job_title=job_title,
            required_skills=required_skills,
            experience_level=experience_level,
            num_questions=num_questions
        )
        
        # Delete existing questions for this interview
        Question.objects.filter(interview=interview).delete()
        
        # Extract skill tags from required_skills for tracking
        skill_tags_list = []
        if required_skills:
            # Parse skills from comma or newline separated string
            skills_raw = required_skills.replace('\n', ',').split(',')
            skill_tags_list = [skill.strip() for skill in skills_raw if skill.strip()]
        
        # Create Question objects
        created_questions = []
        for idx, q_data in enumerate(questions_data):
            is_mcq = q_data.get('is_mcq', True)  # Default to MCQ if not specified
            
            # For MCQ: ensure correct_answer is valid (A, B, C, or D)
            if is_mcq:
                correct_answer = q_data.get('correct_answer', 'A').upper().strip()
                if correct_answer not in ['A', 'B', 'C', 'D']:
                    correct_answer = 'A'  # Default to A if invalid
                options = q_data.get('options', [])
                # Ensure we have exactly 4 options
                if not options or len(options) < 4:
                    options = ['Option A', 'Option B', 'Option C', 'Option D']
            else:
                correct_answer = ''
                options = None
            
            # Extract skill tags from question text or use all skills
            question_skill_tags = q_data.get('skill_tags', skill_tags_list)
            if not question_skill_tags:
                question_skill_tags = skill_tags_list
            
            question = Question.objects.create(
                interview=interview,
                question_text=q_data['question_text'],
                question_type=q_data.get('question_type', 'general'),
                difficulty=q_data.get('difficulty', 'medium'),
                is_mcq=is_mcq,
                options=options,
                correct_answer=correct_answer,
                skill_tags=question_skill_tags,
                order_index=idx,
                generated_by_ai=True,
                ai_model=os.getenv('LITELLM_MODEL', 'gpt-3.5-turbo')
            )
            created_questions.append(question)
        
        # Update interview total_questions
        interview.total_questions = len(created_questions)
        interview.save()
        
        # Serialize and return
        question_serializer = QuestionSerializer(created_questions, many=True)
        
        return Response({
            'interview_id': interview.id,
            'questions_generated': len(created_questions),
            'questions': question_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to generate questions: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_interview_questions(request, interview_id):
    """
    Get all questions for an interview
    
    GET /api/interviews/{id}/questions/
    
    Response:
    {
        "interview_id": 1,
        "questions": [
            {
                "id": 1,
                "question_text": "...",
                "question_type": "technical",
                "difficulty": "medium",
                "order_index": 0
            },
            ...
        ]
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    questions = Question.objects.filter(interview=interview).order_by('order_index')
    serializer = QuestionSerializer(questions, many=True)
    
    return Response({
        'interview_id': interview.id,
        'questions': serializer.data
    })


@api_view(['GET'])
def get_current_question(request, interview_id):
    """
    Get the current question based on interview progress
    
    GET /api/interviews/{id}/current-question/
    
    Response:
    {
        "interview_id": 1,
        "current_question_index": 2,
        "question": {
            "id": 3,
            "question_text": "...",
            "question_type": "technical",
            "difficulty": "medium",
            "order_index": 2
        }
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    current_index = interview.current_question_index
    
    try:
        question = Question.objects.get(
            interview=interview,
            order_index=current_index
        )
        serializer = QuestionSerializer(question)
        
        return Response({
            'interview_id': interview.id,
            'current_question_index': current_index,
            'question': serializer.data
        })
    except Question.DoesNotExist:
        return Response(
            {
                'interview_id': interview.id,
                'current_question_index': current_index,
                'question': None,
                'message': 'No question found at current index'
            }
        )


# ==================== Answer and Evaluation Views ====================

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_answer(request, interview_id):
    """
    Submit an answer (text or audio) for a question
    
    POST /api/interviews/{id}/submit-answer/
    
    Body (multipart/form-data):
    - question_id: ID of the question
    - answer_text: Text answer (optional)
    - audio_file: Audio file (optional)
    - duration_seconds: Duration of audio (optional)
    
    Response:
    {
        "id": 1,
        "answer_text": "...",
        "score": 7.5,
        "evaluation": "..."
    }
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    question_id = request.data.get('question_id') or request.data.get('question')
    if not question_id:
        return Response(
            {'error': 'question_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        question = Question.objects.get(id=question_id, interview=interview)
    except Question.DoesNotExist:
        return Response(
            {'error': 'Question not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Handle MCQ answer
    selected_option = request.data.get('selected_option', '')
    is_correct = None
    auto_score = 0.0
    
    if question.is_mcq and selected_option:
        # Check if answer is correct
        is_correct = (selected_option.upper() == question.correct_answer.upper())
        # Auto-score MCQ: 10 if correct, 0 if wrong
        auto_score = 10.0 if is_correct else 0.0
    
    # Create or update answer
    answer, created = Answer.objects.get_or_create(
        interview=interview,
        question=question,
        defaults={
            'answer_text': request.data.get('answer_text', ''),
            'selected_option': selected_option,
            'is_correct': is_correct,
            'audio_file': request.FILES.get('audio_file'),
            'duration_seconds': request.data.get('duration_seconds'),
            'score': auto_score,
            'evaluated': True if question.is_mcq and selected_option else False,
        }
    )
    
    if not created:
        # Update existing answer
        if 'answer_text' in request.data:
            answer.answer_text = request.data['answer_text']
        if 'selected_option' in request.data:
            answer.selected_option = request.data['selected_option']
            if question.is_mcq:
                answer.is_correct = (request.data['selected_option'].upper() == question.correct_answer.upper())
                answer.score = 10.0 if answer.is_correct else 0.0
                answer.evaluated = True
        if 'audio_file' in request.FILES:
            answer.audio_file = request.FILES['audio_file']
        if 'duration_seconds' in request.data:
            answer.duration_seconds = float(request.data['duration_seconds'])
        answer.save()
    
    # Transcribe audio if provided
    if answer.audio_file and not answer.transcribed:
        try:
            from .utils import transcribe_audio_speechmatics
            transcribed_text = transcribe_audio_speechmatics(answer.audio_file.path)
            answer.answer_text = transcribed_text
            answer.transcribed = True
            answer.save()
        except Exception as e:
            print(f"Error transcribing audio: {e}")
    
    # Evaluate answer if text is available (for open-ended questions)
    if answer.answer_text and not answer.evaluated and not question.is_mcq:
        try:
            resume_text = interview.resume.extracted_text if interview.resume else None
            job_description = interview.job_description.description if interview.job_description else None
            required_skills = interview.job_description.required_skills if interview.job_description else None
            
            evaluation = evaluate_answer(
                question_text=question.question_text,
                answer_text=answer.answer_text,
                question_type=question.question_type,
                resume_text=resume_text,
                job_description=job_description,
                required_skills=required_skills
            )
            
            answer.score = evaluation['score']
            answer.evaluation = evaluation['evaluation']
            answer.strengths = evaluation['strengths']
            answer.improvements = evaluation['improvements']
            answer.evaluated = True
            answer.save()
        except Exception as e:
            print(f"Error evaluating answer: {e}")
    
    serializer = AnswerSerializer(answer)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET'])
def get_answers(request, interview_id):
    """
    Get all answers for an interview
    
    GET /api/interviews/{id}/answers/
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    answers = Answer.objects.filter(interview=interview).order_by('question__order_index')
    serializer = AnswerSerializer(answers, many=True)
    
    return Response({
        'interview_id': interview.id,
        'answers': serializer.data
    })


# ==================== Report Generation Views ====================

@api_view(['POST'])
def generate_report(request, interview_id):
    """
    Generate interview report
    
    POST /api/interviews/{id}/generate-report/
    
    Response:
    {
        "report_id": 1,
        "overall_score": 7.5,
        "summary": "...",
        ...
    }
    """
    from .utils import generate_interview_report
    
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Allow report generation for any status (created, in_progress, completed)
    # This makes it more flexible for different use cases
    if interview.status == 'cancelled':
        return Response(
            {'error': 'Cannot generate report for a cancelled interview'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        report_data = generate_interview_report(interview_id)
        
        if 'error' in report_data:
            # If no answers at all, create a basic report with helpful message
            if 'No answers found' in report_data.get('error', ''):
                from .models import InterviewReport, Answer
                answers_count = Answer.objects.filter(interview=interview).count()
                report, created = InterviewReport.objects.update_or_create(
                    interview=interview,
                    defaults={
                        'overall_score': 0.0,
                        'technical_score': 0.0,
                        'behavioral_score': 0.0,
                        'communication_score': 0.0,
                        'summary': 'Interview session created but no answers were submitted yet. Please answer questions to get detailed feedback.',
                        'strengths': 'Interview session is ready.',
                        'areas_for_improvement': 'Please complete the interview by answering all questions.',
                        'recommendations': 'Go back to the interview page and answer the questions to receive detailed evaluation and feedback.',
                        'total_questions': interview.total_questions or 0,
                        'questions_answered': 0,
                        'average_answer_length': 0.0,
                    }
                )
                serializer = InterviewReportSerializer(report)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            # For other errors, create a basic report anyway
            from .models import InterviewReport, Answer
            answers_count = Answer.objects.filter(interview=interview).count()
            report, created = InterviewReport.objects.update_or_create(
                interview=interview,
                defaults={
                    'overall_score': 0.0,
                    'technical_score': 0.0,
                    'behavioral_score': 0.0,
                    'communication_score': 0.0,
                    'summary': f'Interview completed. {answers_count} question(s) answered. Answers pending evaluation.',
                    'strengths': 'Interview session completed successfully.',
                    'areas_for_improvement': 'Please answer questions to get detailed feedback.',
                    'recommendations': 'Complete the interview by answering all questions to receive detailed evaluation.',
                    'total_questions': interview.total_questions or 0,
                    'questions_answered': answers_count,
                    'average_answer_length': 0.0,
                }
            )
            serializer = InterviewReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # If report generation fails completely, still create a basic report
        print(f"Error in generate_interview_report: {e}")
        from .models import InterviewReport, Answer
        answers_count = Answer.objects.filter(interview=interview).count()
        report, created = InterviewReport.objects.update_or_create(
            interview=interview,
            defaults={
                'overall_score': 0.0,
                'technical_score': 0.0,
                'behavioral_score': 0.0,
                'communication_score': 0.0,
                'summary': f'Interview report generated. {answers_count} question(s) answered.',
                'strengths': 'Interview session completed.',
                'areas_for_improvement': 'Complete all questions for detailed feedback.',
                'recommendations': 'Answer all questions to receive comprehensive evaluation.',
                'total_questions': interview.total_questions or 0,
                'questions_answered': answers_count,
                'average_answer_length': 0.0,
            }
        )
        serializer = InterviewReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # If we reach here, report_data has no error, so report should have been created by generate_interview_report
    # Get the report object
    from .models import InterviewReport
    try:
        report = InterviewReport.objects.get(interview=interview)
        serializer = InterviewReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except InterviewReport.DoesNotExist:
        # This shouldn't happen if generate_interview_report succeeded, but create one if needed
        from .models import Answer
        answers_count = Answer.objects.filter(interview=interview).count()
        report = InterviewReport.objects.create(
            interview=interview,
            overall_score=report_data.get('overall_score', 0.0),
            technical_score=report_data.get('technical_score', 0.0),
            behavioral_score=report_data.get('behavioral_score', 0.0),
            communication_score=report_data.get('communication_score', 0.0),
            summary=report_data.get('summary', 'Interview report'),
            strengths=report_data.get('strengths', ''),
            areas_for_improvement=report_data.get('areas_for_improvement', ''),
            recommendations=report_data.get('recommendations', ''),
            total_questions=interview.total_questions or 0,
            questions_answered=answers_count,
            average_answer_length=report_data.get('average_answer_length', 0.0),
        )
        serializer = InterviewReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_report(request, interview_id):
    """
    Get interview report
    
    GET /api/interviews/{id}/report/
    """
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response(
            {'error': 'Interview not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        from .models import InterviewReport
        report = InterviewReport.objects.get(interview=interview)
        serializer = InterviewReportSerializer(report)
        return Response(serializer.data)
    except InterviewReport.DoesNotExist:
        return Response(
            {'error': 'Report not found. Generate report first.'},
            status=status.HTTP_404_NOT_FOUND
        )


# ==================== ATS Matching Views ====================

@api_view(['POST'])
def match_resume_to_jd(request, job_description_id):
    """
    Match a resume to a job description (ATS matching)
    
    POST /api/interviews/job-descriptions/{id}/match-resume/
    
    Body:
    {
        "resume_id": 1
    }
    
    Response:
    {
        "id": 1,
        "job_description": 1,
        "resume": 1,
        "overall_score": 85.5,
        "skills_score": 90.0,
        "experience_score": 80.0,
        "education_score": 85.0,
        "match_analysis": "...",
        "strengths": "...",
        "gaps": "...",
        "recommendations": "..."
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    resume_id = request.data.get('resume_id')
    if not resume_id:
        return Response(
            {'error': 'resume_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from apps.resumes.models import Resume
        resume = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if match already exists
    match, created = ATSMatch.objects.get_or_create(
        job_description=job_description,
        resume=resume,
        defaults={'overall_score': 0.0}  # Temporary, will be updated
    )
    
    # Calculate ATS match
    if not resume.extracted_text:
        return Response(
            {'error': 'Resume text not extracted. Please extract text first.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    match_data = calculate_ats_match(
        job_description_text=job_description.description,
        resume_text=resume.extracted_text,
        required_skills=job_description.required_skills or '',
        job_title=job_description.title
    )
    
    # Update match with calculated scores
    from decimal import Decimal
    match.overall_score = Decimal(str(match_data.get('overall_score', 0.0)))
    match.skills_score = Decimal(str(match_data.get('skills_score', 0.0)))
    match.experience_score = Decimal(str(match_data.get('experience_score', 0.0)))
    match.education_score = Decimal(str(match_data.get('education_score', 0.0)))
    match.match_analysis = match_data.get('match_analysis', '')
    match.strengths = match_data.get('strengths', '')
    match.gaps = match_data.get('gaps', '')
    match.recommendations = match_data.get('recommendations', '')
    match.status = 'matched'
    match.save()
    
    serializer = ATSMatchSerializer(match)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['POST'])
def match_all_resumes_to_jd(request, job_description_id):
    """
    Match all resumes to a job description (batch matching)
    
    POST /api/interviews/job-descriptions/{id}/match-all-resumes/
    
    Response:
    {
        "job_description_id": 1,
        "matches_created": 5,
        "matches": [...]
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    from apps.resumes.models import Resume
    resumes = Resume.objects.filter(status='extracted', extracted_text__isnull=False).exclude(extracted_text='')
    
    matches_created = 0
    matches_data = []
    
    for resume in resumes:
        # Check if match already exists
        match, created = ATSMatch.objects.get_or_create(
            job_description=job_description,
            resume=resume,
            defaults={'overall_score': 0.0}
        )
        
        # Only calculate if newly created or if match score is 0
        if created or match.overall_score == 0.0:
            match_data = calculate_ats_match(
                job_description_text=job_description.description,
                resume_text=resume.extracted_text,
                required_skills=job_description.required_skills or '',
                job_title=job_description.title
            )
            
            from decimal import Decimal
            match.overall_score = Decimal(str(match_data.get('overall_score', 0.0)))
            match.skills_score = Decimal(str(match_data.get('skills_score', 0.0)))
            match.experience_score = Decimal(str(match_data.get('experience_score', 0.0)))
            match.education_score = Decimal(str(match_data.get('education_score', 0.0)))
            match.match_analysis = match_data.get('match_analysis', '')
            match.strengths = match_data.get('strengths', '')
            match.gaps = match_data.get('gaps', '')
            match.recommendations = match_data.get('recommendations', '')
            match.status = 'matched'
            match.save()
            
            if created:
                matches_created += 1
        
        serializer = ATSMatchSerializer(match)
        matches_data.append(serializer.data)
    
    # Sort by overall_score descending
    matches_data.sort(key=lambda x: x['overall_score'], reverse=True)
    
    return Response({
        'job_description_id': job_description_id,
        'job_description_title': job_description.title,
        'matches_created': matches_created,
        'total_matches': len(matches_data),
        'matches': matches_data
    })


@api_view(['GET'])
def get_ats_matches(request, job_description_id):
    """
    Get all ATS matches for a job description
    
    GET /api/interviews/job-descriptions/{id}/matches/
    
    Query params:
    - status: Filter by status (matched, reviewed, rejected)
    - min_score: Minimum overall score (0-100)
    
    Response:
    {
        "job_description_id": 1,
        "total_matches": 5,
        "matches": [...]
    }
    """
    try:
        job_description = JobDescription.objects.get(id=job_description_id)
    except JobDescription.DoesNotExist:
        return Response(
            {'error': 'Job description not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    matches = ATSMatch.objects.filter(job_description=job_description)
    
    # Filter by status
    status_filter = request.query_params.get('status')
    if status_filter:
        matches = matches.filter(status=status_filter)
    
    # Filter by minimum score
    min_score = request.query_params.get('min_score')
    if min_score:
        try:
            from decimal import Decimal
            matches = matches.filter(overall_score__gte=Decimal(min_score))
        except (ValueError, TypeError):
            pass
    
    serializer = ATSMatchSerializer(matches, many=True)
    
    return Response({
        'job_description_id': job_description_id,
        'job_description_title': job_description.title,
        'total_matches': matches.count(),
        'matches': serializer.data
    })


@api_view(['GET'])
def get_all_ats_matches(request):
    """
    Get all ATS matches across all job descriptions
    
    GET /api/interviews/ats-matches/
    
    Query params:
    - job_description_id: Filter by job description ID
    - status: Filter by status
    - min_score: Minimum overall score
    
    Response:
    {
        "total_matches": 20,
        "matches": [...]
    }
    """
    matches = ATSMatch.objects.all()
    
    # Filter by job description
    jd_id = request.query_params.get('job_description_id')
    if jd_id:
        matches = matches.filter(job_description_id=jd_id)
    
    # Filter by status
    status_filter = request.query_params.get('status')
    if status_filter:
        matches = matches.filter(status=status_filter)
    
    # Filter by minimum score
    min_score = request.query_params.get('min_score')
    if min_score:
        try:
            from decimal import Decimal
            matches = matches.filter(overall_score__gte=Decimal(min_score))
        except (ValueError, TypeError):
            pass
    
    serializer = ATSMatchSerializer(matches, many=True)
    
    return Response({
        'total_matches': matches.count(),
        'matches': serializer.data
    })


@api_view(['PATCH'])
def update_ats_match_status(request, match_id):
    """
    Update ATS match status (reviewed, rejected, etc.)
    
    PATCH /api/interviews/ats-matches/{id}/status/
    
    Body:
    {
        "status": "reviewed"  // or "rejected"
    }
    
    Response:
    {
        "id": 1,
        "status": "reviewed",
        ...
    }
    """
    try:
        match = ATSMatch.objects.get(id=match_id)
    except ATSMatch.DoesNotExist:
        return Response(
            {'error': 'ATS match not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    new_status = request.data.get('status')
    if new_status and new_status in ['matched', 'reviewed', 'rejected', 'pending']:
        match.status = new_status
        match.save()
    
    serializer = ATSMatchSerializer(match)
    return Response(serializer.data)
