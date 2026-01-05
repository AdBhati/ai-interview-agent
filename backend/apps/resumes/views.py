from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer, ResumeUploadSerializer
from .utils import extract_text_from_pdf


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    """
    Upload a PDF resume file
    
    POST /api/resumes/upload/
    Content-Type: multipart/form-data
    
    Body:
    - file: PDF file (max 10MB)
    
    Response:
    {
        "id": 1,
        "file": "http://localhost:8000/media/resumes/...",
        "original_filename": "resume.pdf",
        "file_size": 123456,
        "file_size_mb": 0.12,
        "status": "uploaded",
        "created_at": "2024-01-05T20:00:00Z"
    }
    """
    serializer = ResumeUploadSerializer(data=request.data)
    
    if serializer.is_valid():
        resume_file = serializer.validated_data['file']
        
        # Create resume instance
        resume = Resume.objects.create(
            file=resume_file,
            original_filename=resume_file.name,
            file_size=resume_file.size,
            status='uploaded'
        )
        
        # Automatically extract text from PDF
        try:
            resume.status = 'processing'
            resume.save()
            
            # Extract text from PDF
            extracted_text = extract_text_from_pdf(resume.file)
            
            # Update resume with extracted text
            resume.extracted_text = extracted_text
            resume.status = 'extracted'
            resume.save()
        except Exception as e:
            # If extraction fails, mark as failed but keep the resume
            resume.status = 'failed'
            resume.save()
            print(f"Error extracting text from resume {resume.id}: {str(e)}")
        
        # Return serialized response
        response_serializer = ResumeSerializer(resume)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def list_resumes(request):
    """
    List all uploaded resumes
    
    GET /api/resumes/
    
    Response:
    [
        {
            "id": 1,
            "file": "http://localhost:8000/media/resumes/...",
            "original_filename": "resume.pdf",
            "file_size_mb": 0.12,
            "status": "uploaded",
            "created_at": "2024-01-05T20:00:00Z"
        }
    ]
    """
    resumes = Resume.objects.all()
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_resume(request, resume_id):
    """
    Get a specific resume by ID
    
    GET /api/resumes/{id}/
    
    Response:
    {
        "id": 1,
        "file": "http://localhost:8000/media/resumes/...",
        "original_filename": "resume.pdf",
        "file_size_mb": 0.12,
        "status": "uploaded",
        "extracted_text": null,
        "created_at": "2024-01-05T20:00:00Z"
    }
    """
    try:
        resume = Resume.objects.get(id=resume_id)
        serializer = ResumeSerializer(resume)
        return Response(serializer.data)
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
def extract_text(request, resume_id):
    """
    Extract text from a resume PDF
    
    POST /api/resumes/{id}/extract/
    
    Response:
    {
        "id": 1,
        "status": "extracted",
        "extracted_text": "Full text content from PDF...",
        "message": "Text extracted successfully"
    }
    """
    try:
        resume = Resume.objects.get(id=resume_id)
        
        # Check if already extracted
        if resume.status == 'extracted' and resume.extracted_text:
            return Response({
                'id': resume.id,
                'status': resume.status,
                'extracted_text': resume.extracted_text,
                'message': 'Text already extracted'
            })
        
        # Update status to processing
        resume.status = 'processing'
        resume.save()
        
        try:
            # Extract text from PDF
            extracted_text = extract_text_from_pdf(resume.file)
            
            # Update resume with extracted text
            resume.extracted_text = extracted_text
            resume.status = 'extracted'
            resume.save()
            
            return Response({
                'id': resume.id,
                'status': resume.status,
                'extracted_text': extracted_text,
                'message': 'Text extracted successfully'
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Extraction failed
            resume.status = 'failed'
            resume.save()
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            resume.status = 'failed'
            resume.save()
            return Response(
                {'error': f'Failed to extract text: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )
