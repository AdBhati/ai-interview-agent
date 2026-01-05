from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    """Serializer for Resume model"""
    file_size_mb = serializers.ReadOnlyField()
    
    class Meta:
        model = Resume
        fields = [
            'id',
            'file',
            'original_filename',
            'file_size',
            'file_size_mb',
            'status',
            'extracted_text',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'original_filename',
            'file_size',
            'status',
            'extracted_text',
            'created_at',
            'updated_at',
        ]


class ResumeUploadSerializer(serializers.ModelSerializer):
    """Serializer for resume upload"""
    
    class Meta:
        model = Resume
        fields = ['file']
    
    def validate_file(self, value):
        """Validate uploaded file"""
        # Check file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f'File size cannot exceed 10MB. Current size: {value.size / (1024*1024):.2f}MB'
            )
        
        # Check file extension
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError('Only PDF files are allowed')
        
        return value

