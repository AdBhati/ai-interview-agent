"""
Utility functions for resume processing
"""
import PyPDF2
import io
from django.core.files.uploadedfile import InMemoryUploadedFile


def extract_text_from_pdf(pdf_file):
    """
    Extract text from PDF file using PyPDF2
    
    Args:
        pdf_file: Django FileField or file-like object
        
    Returns:
        str: Extracted text from PDF
    """
    try:
        # Handle Django FileField - open the file
        if hasattr(pdf_file, 'path'):
            # FileField with path
            with open(pdf_file.path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                return _extract_text_from_reader(pdf_reader)
        elif hasattr(pdf_file, 'read'):
            # File-like object (InMemoryUploadedFile)
            pdf_file.seek(0)  # Reset file pointer
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            return _extract_text_from_reader(pdf_reader)
        else:
            raise ValueError("Unsupported file type")
    
    except PyPDF2.errors.PdfReadError as e:
        raise ValueError(f"Invalid PDF file: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error extracting text from PDF: {str(e)}")


def _extract_text_from_reader(pdf_reader):
    """Helper function to extract text from PyPDF2 PdfReader"""
    # Extract text from all pages
    text_content = []
    for page_num, page in enumerate(pdf_reader.pages):
        try:
            text = page.extract_text()
            if text:
                text_content.append(text)
        except Exception as e:
            # Skip pages that can't be extracted
            print(f"Error extracting page {page_num + 1}: {str(e)}")
            continue
    
    # Combine all pages
    extracted_text = '\n\n'.join(text_content)
    
    # Clean up text (remove excessive whitespace but preserve line breaks)
    lines = extracted_text.split('\n')
    cleaned_lines = [' '.join(line.split()) for line in lines if line.strip()]
    extracted_text = '\n'.join(cleaned_lines)
    
    return extracted_text

