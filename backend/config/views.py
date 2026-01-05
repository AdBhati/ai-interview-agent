"""
Base views for the AI Interview System.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def root(request):
    """
    Root endpoint - API information
    """
    return Response({
        'message': 'AI Interview System API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'resumes': '/api/resumes/',
            'interviews': '/api/interviews/',
            'admin': '/admin/',
        },
        'status': 'running',
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify the API is running.
    """
    return Response({
        'status': 'healthy',
        'message': 'AI Interview System API is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)

