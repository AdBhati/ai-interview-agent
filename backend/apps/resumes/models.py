from django.db import models
from django.core.validators import FileExtensionValidator


class Resume(models.Model):
    """
    Resume model to store uploaded PDF resumes
    """
    # File fields
    file = models.FileField(
        upload_to='resumes/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])],
        help_text='Upload PDF resume file'
    )
    
    # Metadata
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(help_text='File size in bytes')
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=[
            ('uploaded', 'Uploaded'),
            ('processing', 'Processing'),
            ('extracted', 'Text Extracted'),
            ('failed', 'Failed'),
        ],
        default='uploaded'
    )
    
    # Extracted content (will be populated in next feature)
    extracted_text = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'
    
    def __str__(self):
        return f"Resume: {self.original_filename} ({self.status})"
    
    @property
    def file_size_mb(self):
        """Return file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
