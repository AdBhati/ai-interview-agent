"""
WebSocket URL routing for interview chat
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/interview/(?P<interview_id>\w+)/$', consumers.InterviewConsumer.as_asgi()),
]

