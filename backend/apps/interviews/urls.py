from django.urls import path
from . import views

app_name = 'interviews'

urlpatterns = [
    # Job Description endpoints
    path('job-descriptions/', views.create_job_description, name='create_job_description'),
    path('job-descriptions/<int:job_description_id>/', views.get_job_description, name='get_job_description'),
    path('job-descriptions/<int:job_description_id>/update/', views.update_job_description, name='update_job_description'),
    path('job-descriptions/<int:job_description_id>/delete/', views.delete_job_description, name='delete_job_description'),
    
    # Interview Session endpoints
    path('', views.create_interview, name='create_interview'),
    path('<int:interview_id>/', views.get_interview, name='get_interview'),
    path('<int:interview_id>/start/', views.start_interview, name='start_interview'),
    path('<int:interview_id>/complete/', views.complete_interview, name='complete_interview'),
    path('<int:interview_id>/progress/', views.update_interview_progress, name='update_interview_progress'),
    
    # Question Generation endpoints
    path('<int:interview_id>/generate-questions/', views.generate_questions, name='generate_questions'),
    path('<int:interview_id>/questions/', views.get_interview_questions, name='get_interview_questions'),
    path('<int:interview_id>/current-question/', views.get_current_question, name='get_current_question'),
    
    # Answer endpoints
    path('<int:interview_id>/submit-answer/', views.submit_answer, name='submit_answer'),
    path('<int:interview_id>/answers/', views.get_answers, name='get_answers'),
    
    # Report endpoints
    path('<int:interview_id>/generate-report/', views.generate_report, name='generate_report'),
    path('<int:interview_id>/report/', views.get_report, name='get_report'),
    
    # ATS Matching endpoints
    path('job-descriptions/<int:job_description_id>/match-resume/', views.match_resume_to_jd, name='match_resume_to_jd'),
    path('job-descriptions/<int:job_description_id>/match-all-resumes/', views.match_all_resumes_to_jd, name='match_all_resumes_to_jd'),
    path('job-descriptions/<int:job_description_id>/matches/', views.get_ats_matches, name='get_ats_matches'),
    path('ats-matches/', views.get_all_ats_matches, name='get_all_ats_matches'),
    path('ats-matches/<int:match_id>/status/', views.update_ats_match_status, name='update_ats_match_status'),
]

