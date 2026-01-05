from django.urls import path
from . import views

app_name = 'resumes'

urlpatterns = [
    path('upload/', views.upload_resume, name='upload_resume'),
    path('', views.list_resumes, name='list_resumes'),
    path('<int:resume_id>/', views.get_resume, name='get_resume'),
    path('<int:resume_id>/extract/', views.extract_text, name='extract_text'),
]

