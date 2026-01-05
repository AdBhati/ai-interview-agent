"""
Utility functions for interview-related operations
"""
import os
import json
from typing import List, Dict, Optional
import litellm
from litellm import completion


def generate_interview_questions(
    resume_text: Optional[str] = None,
    job_description: Optional[str] = None,
    job_title: Optional[str] = None,
    required_skills: Optional[str] = None,
    experience_level: Optional[str] = None,
    num_questions: int = 5
) -> List[Dict[str, str]]:
    """
    Generate interview questions using LiteLLM based on resume and job description
    
    Args:
        resume_text: Extracted text from resume
        job_description: Job description text
        job_title: Job title/position
        required_skills: Required skills for the position
        experience_level: Experience level (entry, mid, senior, executive)
        num_questions: Number of questions to generate (default: 5)
    
    Returns:
        List of dictionaries containing question data:
        [
            {
                "question_text": "...",
                "question_type": "technical",
                "difficulty": "medium"
            },
            ...
        ]
    """
    try:
        # Build the prompt for question generation
        prompt = build_question_generation_prompt(
            resume_text=resume_text,
            job_description=job_description,
            job_title=job_title,
            required_skills=required_skills,
            experience_level=experience_level,
            num_questions=num_questions
        )
        
        # Get API key from environment (OpenRouter or OpenAI)
        api_key = os.getenv('OPENROUTER_API_KEY') or os.getenv('OPENAI_API_KEY') or os.getenv('LITELLM_API_KEY')
        
        if not api_key:
            # Fallback: return default questions if no API key
            return get_default_questions(num_questions)
        
        # Determine model - OpenRouter models use openrouter/ prefix
        model = os.getenv('LITELLM_MODEL', 'gpt-3.5-turbo')
        use_openrouter = os.getenv('OPENROUTER_API_KEY') is not None
        
        # Configure for OpenRouter
        if use_openrouter:
            # Ensure model has openrouter/ prefix
            if not model.startswith('openrouter/'):
                model = f'openrouter/{model}' if not model.startswith('openrouter/') else model
            # Set environment variable for LiteLLM
            os.environ['OPENROUTER_API_KEY'] = api_key
        
        # For OpenRouter, LiteLLM automatically uses OPENROUTER_API_KEY env var
        # For OpenAI, it uses OPENAI_API_KEY env var
        response = completion(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert interview question generator. Generate relevant, professional interview questions based on the provided resume and job description."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Parse the response
        response_text = response.choices[0].message.content
        
        # Try to parse JSON response
        try:
            # Extract JSON from response (might be wrapped in markdown code blocks)
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            elif '```' in response_text:
                json_start = response_text.find('```') + 3
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            
            questions_data = json.loads(response_text)
            
            # Validate and format questions
            if isinstance(questions_data, dict) and 'questions' in questions_data:
                questions = questions_data['questions']
            elif isinstance(questions_data, list):
                questions = questions_data
            else:
                raise ValueError("Invalid response format")
            
            # Ensure we have the right number of questions
            questions = questions[:num_questions]
            
            # Validate question structure
            formatted_questions = []
            for i, q in enumerate(questions):
                if isinstance(q, dict):
                    formatted_questions.append({
                        'question_text': q.get('question_text', q.get('question', str(q))),
                        'question_type': q.get('question_type', 'general'),
                        'difficulty': q.get('difficulty', 'medium')
                    })
                elif isinstance(q, str):
                    formatted_questions.append({
                        'question_text': q,
                        'question_type': 'general',
                        'difficulty': 'medium'
                    })
            
            return formatted_questions[:num_questions]
            
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            # If JSON parsing fails, try to extract questions from text
            print(f"Error parsing JSON response: {e}")
            print(f"Response text: {response_text[:500]}")
            return parse_questions_from_text(response_text, num_questions)
    
    except Exception as e:
        print(f"Error generating questions with LiteLLM: {e}")
        # Fallback to default questions
        return get_default_questions(num_questions)


def build_question_generation_prompt(
    resume_text: Optional[str] = None,
    job_description: Optional[str] = None,
    job_title: Optional[str] = None,
    required_skills: Optional[str] = None,
    experience_level: Optional[str] = None,
    num_questions: int = 5
) -> str:
    """
    Build the prompt for question generation
    """
    prompt_parts = [
        "Generate a set of professional interview questions for a candidate interview.",
        f"Generate exactly {num_questions} questions.",
        "",
        "Requirements:",
        "- Mix of technical, behavioral, and situational questions",
        "- Questions should be relevant to the candidate's background and the job role",
        "- Vary the difficulty levels (easy, medium, hard)",
        "- Return the response as a JSON array with the following structure:",
        "",
        """[
    {
        "question_text": "The question text",
        "question_type": "technical|behavioral|situational|general",
        "difficulty": "easy|medium|hard"
    }
]""",
        ""
    ]
    
    if job_title:
        prompt_parts.append(f"Job Title: {job_title}")
    
    if experience_level:
        level_map = {
            'entry': 'Entry Level',
            'mid': 'Mid Level',
            'senior': 'Senior Level',
            'executive': 'Executive'
        }
        prompt_parts.append(f"Experience Level: {level_map.get(experience_level, experience_level)}")
    
    if required_skills:
        prompt_parts.append(f"Required Skills: {required_skills}")
    
    if job_description:
        prompt_parts.append(f"\nJob Description:\n{job_description[:1000]}")  # Limit length
    
    if resume_text:
        prompt_parts.append(f"\nCandidate Resume Summary:\n{resume_text[:1000]}")  # Limit length
    
    prompt_parts.append("\nGenerate the questions now:")
    
    return "\n".join(prompt_parts)


def parse_questions_from_text(text: str, num_questions: int) -> List[Dict[str, str]]:
    """
    Parse questions from plain text response (fallback method)
    """
    questions = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Remove numbering (1., 2., Q1:, etc.)
        line = line.lstrip('0123456789. )-')
        line = line.lstrip('Q').lstrip('0123456789: )-')
        
        if len(line) > 20 and '?' in line:  # Likely a question
            questions.append({
                'question_text': line,
                'question_type': 'general',
                'difficulty': 'medium'
            })
        
        if len(questions) >= num_questions:
            break
    
    # If we don't have enough questions, pad with defaults
    while len(questions) < num_questions:
        questions.extend(get_default_questions(num_questions - len(questions)))
    
    return questions[:num_questions]


def get_default_questions(num_questions: int) -> List[Dict[str, str]]:
    """
    Return default questions if AI generation fails
    """
    default_questions = [
        {
            'question_text': 'Please introduce yourself and tell us about your background.',
            'question_type': 'general',
            'difficulty': 'easy'
        },
        {
            'question_text': 'What interests you most about this position?',
            'question_type': 'behavioral',
            'difficulty': 'easy'
        },
        {
            'question_text': 'Describe a challenging project you worked on and how you overcame obstacles.',
            'question_type': 'situational',
            'difficulty': 'medium'
        },
        {
            'question_text': 'What are your strengths and how do they align with this role?',
            'question_type': 'behavioral',
            'difficulty': 'medium'
        },
        {
            'question_text': 'How do you handle working under pressure or tight deadlines?',
            'question_type': 'behavioral',
            'difficulty': 'medium'
        },
        {
            'question_text': 'Tell me about a time when you had to learn a new technology quickly.',
            'question_type': 'situational',
            'difficulty': 'medium'
        },
        {
            'question_text': 'What is your approach to problem-solving?',
            'question_type': 'behavioral',
            'difficulty': 'medium'
        },
        {
            'question_text': 'Where do you see yourself in 5 years?',
            'question_type': 'general',
            'difficulty': 'easy'
        }
    ]
    
    return default_questions[:num_questions]


def transcribe_audio_speechmatics(audio_file_path: str) -> str:
    """
    Transcribe audio using Speechmatics API
    
    Args:
        audio_file_path: Path to audio file
    
    Returns:
        Transcribed text
    """
    import os
    import requests
    import time
    
    api_key = os.getenv('SPEECHMATICS_API_KEY')
    
    if not api_key:
        return "Speechmatics API key not configured. Please add SPEECHMATICS_API_KEY to .env file."
    
    try:
        # Speechmatics API endpoint
        base_url = "https://mp.speechmatics.com/v1"
        
        # Step 1: Upload audio file
        upload_url = f"{base_url}/jobs"
        
        with open(audio_file_path, 'rb') as audio_file:
            files = {'data_file': audio_file}
            headers = {
                'Authorization': f'Bearer {api_key}',
            }
            data = {
                'config': '{"type": "transcription", "transcription_config": {"language": "en"}}'
            }
            
            # Upload job
            response = requests.post(upload_url, files=files, headers=headers, data=data, timeout=30)
            
            if response.status_code != 201:
                # If upload fails, try alternative method
                return f"Upload failed: {response.status_code}. Using fallback transcription."
            
            job_id = response.json().get('id')
            
            if not job_id:
                return "Failed to get job ID from Speechmatics API."
            
            # Step 2: Poll for transcription result
            status_url = f"{base_url}/jobs/{job_id}"
            max_attempts = 30
            attempt = 0
            
            while attempt < max_attempts:
                time.sleep(2)  # Wait 2 seconds between polls
                status_response = requests.get(status_url, headers=headers, timeout=10)
                
                if status_response.status_code == 200:
                    job_data = status_response.json()
                    status = job_data.get('status')
                    
                    if status == 'done':
                        # Get transcription
                        transcript_url = f"{base_url}/jobs/{job_id}/transcript"
                        transcript_response = requests.get(transcript_url, headers=headers, timeout=10)
                        
                        if transcript_response.status_code == 200:
                            transcript_data = transcript_response.json()
                            # Extract text from transcript
                            transcript_text = ""
                            for item in transcript_data.get('results', []):
                                if 'alternatives' in item:
                                    transcript_text += item['alternatives'][0].get('content', '') + ' '
                            
                            return transcript_text.strip() if transcript_text else "Transcription completed but no text found."
                    
                    elif status == 'rejected' or status == 'failed':
                        return f"Transcription failed: {job_data.get('error', 'Unknown error')}"
                
                attempt += 1
            
            return "Transcription timed out. Please try again."
    
    except FileNotFoundError:
        return f"Audio file not found: {audio_file_path}"
    except requests.exceptions.RequestException as e:
        return f"Error connecting to Speechmatics API: {str(e)}"
    except Exception as e:
        return f"Error during transcription: {str(e)}"


def evaluate_answer(
    question_text: str,
    answer_text: str,
    question_type: str,
    resume_text: Optional[str] = None,
    job_description: Optional[str] = None
) -> Dict[str, any]:
    """
    Evaluate an answer using AI and return score and feedback
    
    Args:
        question_text: The question that was asked
        answer_text: The candidate's answer
        question_type: Type of question (technical, behavioral, etc.)
        resume_text: Optional resume text for context
        job_description: Optional job description for context
    
    Returns:
        Dictionary with score, evaluation, strengths, and improvements
    """
    try:
        import os
        import json
        import litellm
        from litellm import completion
        
        # Build evaluation prompt
        prompt = f"""Evaluate the following interview answer and provide:
1. A score out of 10
2. Detailed evaluation
3. Strengths identified
4. Areas for improvement

Question Type: {question_type}
Question: {question_text}

Answer: {answer_text}

{f"Resume Context: {resume_text[:500]}" if resume_text else ""}
{f"Job Description: {job_description[:500]}" if job_description else ""}

Provide your evaluation in JSON format:
{{
    "score": <number 0-10>,
    "evaluation": "<detailed evaluation>",
    "strengths": "<list of strengths>",
    "improvements": "<suggested improvements>"
}}"""

        # Get API key from environment (OpenRouter or OpenAI)
        api_key = os.getenv('OPENROUTER_API_KEY') or os.getenv('OPENAI_API_KEY') or os.getenv('LITELLM_API_KEY')
        
        if not api_key:
            # Fallback evaluation
            return {
                'score': 7.0,
                'evaluation': 'Answer provided. Detailed evaluation requires API key.',
                'strengths': 'Answer was provided and relevant to the question.',
                'improvements': 'Consider providing more specific examples and details.'
            }
        
        # Determine model - OpenRouter models use openrouter/ prefix
        model = os.getenv('LITELLM_MODEL', 'gpt-3.5-turbo')
        use_openrouter = os.getenv('OPENROUTER_API_KEY') is not None
        
        # Configure for OpenRouter
        if use_openrouter:
            # Ensure model has openrouter/ prefix
            if not model.startswith('openrouter/'):
                model = f'openrouter/{model}' if not model.startswith('openrouter/') else model
            # Set environment variable for LiteLLM
            os.environ['OPENROUTER_API_KEY'] = api_key
        
        # For OpenRouter, LiteLLM automatically uses OPENROUTER_API_KEY env var
        response = completion(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert interview evaluator. Provide fair, constructive feedback."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.5,
            max_tokens=1000
        )
        
        response_text = response.choices[0].message.content
        
        # Parse JSON response
        try:
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            elif '```' in response_text:
                json_start = response_text.find('```') + 3
                json_end = response_text.find('```', json_start)
                response_text = response_text[json_start:json_end].strip()
            
            evaluation_data = json.loads(response_text)
            
            return {
                'score': float(evaluation_data.get('score', 7.0)),
                'evaluation': evaluation_data.get('evaluation', ''),
                'strengths': evaluation_data.get('strengths', ''),
                'improvements': evaluation_data.get('improvements', '')
            }
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            print(f"Error parsing evaluation JSON: {e}")
            return {
                'score': 7.0,
                'evaluation': 'Evaluation completed. Some details may be missing.',
                'strengths': 'Answer was provided.',
                'improvements': 'Consider providing more detail.'
            }
    
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        return {
            'score': 7.0,
            'evaluation': f'Evaluation error: {str(e)}',
            'strengths': 'Answer was provided.',
            'improvements': 'Please try again or check your answer.'
        }


def generate_interview_report(interview_id: int) -> Dict[str, any]:
    """
    Generate a comprehensive interview report
    
    Args:
        interview_id: ID of the interview
    
    Returns:
        Dictionary with report data
    """
    from .models import Interview, Answer, Question, InterviewReport
    
    try:
        interview = Interview.objects.get(id=interview_id)
        evaluated_answers = Answer.objects.filter(interview=interview, evaluated=True)
        all_answers = Answer.objects.filter(interview=interview)  # Get all answers, even unevaluated
        questions = Question.objects.filter(interview=interview)
        
        # If no evaluated answers, still generate a basic report
        if not evaluated_answers.exists():
            # Check if there are any answers at all
            if not all_answers.exists():
                return {
                    'error': 'No answers found for this interview. Please answer at least one question.'
                }
            # If answers exist but not evaluated, use them with default scores
            answers = all_answers
        else:
            answers = evaluated_answers
        
        # Calculate scores (use 0 if not evaluated)
        total_score = sum(a.score if a.evaluated else 0.0 for a in answers)
        avg_score = total_score / answers.count() if answers.count() > 0 else 0
        
        # Calculate scores by type (use 0 if not evaluated)
        technical_answers = answers.filter(question__question_type='technical')
        behavioral_answers = answers.filter(question__question_type='behavioral')
        
        technical_score = sum(a.score if a.evaluated else 0.0 for a in technical_answers) / technical_answers.count() if technical_answers.exists() else 0
        behavioral_score = sum(a.score if a.evaluated else 0.0 for a in behavioral_answers) / behavioral_answers.count() if behavioral_answers.exists() else 0
        
        # Communication score (based on answer length and clarity)
        avg_length = sum(len(a.answer_text or '') for a in answers) / answers.count() if answers.exists() else 0
        communication_score = min(10, (avg_length / 100) * 2)  # Rough metric
        
        # Generate summary using AI
        summary_parts = []
        for answer in answers[:5]:  # Use first 5 answers
            if answer.evaluation:
                summary_parts.append(f"Q: {answer.question.question_text[:50]}... Score: {answer.score}/10")
        
        # Generate summary
        if evaluated_answers.exists():
            summary = f"Interview completed with {answers.count()} questions answered. Average score: {avg_score:.1f}/10."
        else:
            summary = f"Interview completed with {answers.count()} questions answered. Answers are pending evaluation."
        
        strengths_list = []
        improvements_list = []
        
        for answer in answers:
            if answer.evaluated:
                if answer.strengths:
                    strengths_list.append(answer.strengths[:100])
                if answer.improvements:
                    improvements_list.append(answer.improvements[:100])
        
        strengths = ". ".join(set(strengths_list[:5])) if strengths_list else "Interview session completed successfully."
        improvements = ". ".join(set(improvements_list[:5])) if improvements_list else "Complete the interview by answering all questions to get detailed feedback."
        
        if evaluated_answers.exists():
            recommendations = f"Based on the interview, focus on: {improvements[:200]}"
        else:
            recommendations = "Please answer all questions to receive detailed feedback and recommendations."
        
        # Create or update report
        report, created = InterviewReport.objects.update_or_create(
            interview=interview,
            defaults={
                'overall_score': avg_score,
                'technical_score': technical_score,
                'behavioral_score': behavioral_score,
                'communication_score': communication_score,
                'summary': summary,
                'strengths': strengths,
                'areas_for_improvement': improvements,
                'recommendations': recommendations,
                'total_questions': questions.count(),
                'questions_answered': answers.count(),
                'average_answer_length': avg_length,
            }
        )
        
        return {
            'report_id': report.id,
            'overall_score': report.overall_score,
            'technical_score': report.technical_score,
            'behavioral_score': report.behavioral_score,
            'communication_score': report.communication_score,
            'summary': report.summary,
            'strengths': report.strengths,
            'areas_for_improvement': report.areas_for_improvement,
            'recommendations': report.recommendations,
        }
    
    except Interview.DoesNotExist:
        return {'error': 'Interview not found'}
    except Exception as e:
        return {'error': f'Error generating report: {str(e)}'}


def calculate_ats_match(job_description_text: str, resume_text: str, required_skills: str = "", job_title: str = "") -> Dict[str, any]:
    """
    Calculate ATS match score between job description and resume using AI
    
    Args:
        job_description_text: Full job description text
        resume_text: Extracted resume text
        required_skills: Required skills (comma-separated)
        job_title: Job title/position
    
    Returns:
        Dictionary with match scores and analysis:
        {
            'overall_score': 85.5,
            'skills_score': 90.0,
            'experience_score': 80.0,
            'education_score': 85.0,
            'match_analysis': '...',
            'strengths': '...',
            'gaps': '...',
            'recommendations': '...'
        }
    """
    try:
        # Build prompt for ATS matching
        prompt = f"""You are an ATS (Applicant Tracking System) matching expert. Analyze the match between a job description and a candidate's resume.

Job Title: {job_title}
Job Description:
{job_description_text}

Required Skills: {required_skills}

Candidate Resume:
{resume_text}

Please provide a detailed ATS match analysis in the following JSON format:
{{
    "overall_score": <number 0-100>,
    "skills_score": <number 0-100>,
    "experience_score": <number 0-100>,
    "education_score": <number 0-100>,
    "match_analysis": "<detailed analysis of how well the resume matches the job description>",
    "strengths": "<key strengths and matching points>",
    "gaps": "<missing requirements or gaps>",
    "recommendations": "<recommendations for the candidate or recruiter>"
}}

Calculate scores based on:
- Skills Score: How many required skills are present in the resume
- Experience Score: How well the candidate's experience matches the job requirements
- Education Score: How well the candidate's education matches the requirements
- Overall Score: Weighted average (Skills: 40%, Experience: 40%, Education: 20%)

Return ONLY valid JSON, no additional text."""

        # Get API key
        api_key = os.getenv('OPENROUTER_API_KEY') or os.getenv('OPENAI_API_KEY') or os.getenv('LITELLM_API_KEY')
        if not api_key:
            # Fallback to basic matching without AI
            return calculate_basic_ats_match(job_description_text, resume_text, required_skills)
        
        model = os.getenv('LITELLM_MODEL', 'gpt-3.5-turbo')
        use_openrouter = os.getenv('OPENROUTER_API_KEY') is not None
        
        # Set API key
        if use_openrouter:
            os.environ['OPENROUTER_API_KEY'] = api_key
        
        # Call LiteLLM
        response = completion(
            model=model,
            messages=[
                {"role": "system", "content": "You are an expert ATS matching system. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        # Extract response
        response_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            # Remove markdown code blocks if present
            if response_text.startswith('```'):
                response_text = response_text.split('```')[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            match_data = json.loads(response_text)
            
            # Validate scores are in range
            for key in ['overall_score', 'skills_score', 'experience_score', 'education_score']:
                if key in match_data:
                    score = float(match_data[key])
                    match_data[key] = max(0.0, min(100.0, score))  # Clamp between 0-100
            
            return match_data
            
        except json.JSONDecodeError as e:
            print(f"Error parsing ATS match JSON: {e}")
            print(f"Response text: {response_text[:200]}")
            # Fallback to basic matching
            return calculate_basic_ats_match(job_description_text, resume_text, required_skills)
    
    except Exception as e:
        print(f"Error in calculate_ats_match: {e}")
        # Fallback to basic matching
        return calculate_basic_ats_match(job_description_text, resume_text, required_skills)


def calculate_basic_ats_match(job_description_text: str, resume_text: str, required_skills: str = "") -> Dict[str, any]:
    """
    Basic ATS matching without AI (fallback method)
    Uses keyword matching and simple scoring
    """
    # Convert to lowercase for comparison
    jd_lower = job_description_text.lower()
    resume_lower = resume_text.lower()
    
    # Skills matching
    skills_score = 0.0
    if required_skills:
        skills_list = [s.strip().lower() for s in required_skills.split(',') if s.strip()]
        matched_skills = sum(1 for skill in skills_list if skill in resume_lower)
        if skills_list:
            skills_score = (matched_skills / len(skills_list)) * 100
    
    # Experience matching (basic keyword matching)
    experience_keywords = ['experience', 'years', 'worked', 'role', 'position', 'job']
    experience_matches = sum(1 for keyword in experience_keywords if keyword in resume_lower)
    experience_score = min(100.0, (experience_matches / len(experience_keywords)) * 100)
    
    # Education matching
    education_keywords = ['education', 'degree', 'bachelor', 'master', 'phd', 'university', 'college']
    education_matches = sum(1 for keyword in education_keywords if keyword in resume_lower)
    education_score = min(100.0, (education_matches / len(education_keywords)) * 100)
    
    # Overall score (weighted average)
    overall_score = (skills_score * 0.4) + (experience_score * 0.4) + (education_score * 0.2)
    
    return {
        'overall_score': round(overall_score, 2),
        'skills_score': round(skills_score, 2),
        'experience_score': round(experience_score, 2),
        'education_score': round(education_score, 2),
        'match_analysis': f'Basic matching: {matched_skills if required_skills else 0} skills matched, experience and education keywords found.',
        'strengths': 'Resume contains relevant keywords and skills.',
        'gaps': 'Detailed analysis requires AI processing.',
        'recommendations': 'For detailed analysis, ensure API keys are configured.'
    }

