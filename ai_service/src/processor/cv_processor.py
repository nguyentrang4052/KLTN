import fitz  # PyMuPDF
from docx import Document
from typing import List, Dict, Any, Tuple
import re
import structlog

logger = structlog.get_logger()


class CVProcessor:
    def __init__(self):
        self.chunk_size = 1500
        self.chunk_overlap = 300
    
    async def extract_text(self, file_bytes: bytes, mime_type: str) -> str:
        """Extract text from PDF or DOCX"""
        try:
            if mime_type == "application/pdf":
                return await self._extract_pdf(file_bytes)
            elif mime_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                              "application/msword"]:
                return await self._extract_docx(file_bytes)
            else:
                raise ValueError(f"Unsupported file type: {mime_type}")
        except Exception as e:
            logger.error("text_extraction_failed", error=str(e), mime_type=mime_type)
            raise
    
    async def _extract_pdf(self, file_bytes: bytes) -> str:
        """Extract text from PDF using PyMuPDF"""
        text = ""
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
        return self._clean_text(text)
    
    async def _extract_docx(self, file_bytes: bytes) -> str:
        """Extract text from DOCX"""
        from io import BytesIO
        doc = Document(BytesIO(file_bytes))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return self._clean_text(text)
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep Vietnamese
        text = re.sub(r'[^\w\s\u00C0-\u1EF9.,;:!?()-]', '', text)
        return text.strip()
    
    def create_chunks(
        self,
        text: str,
        metadata: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Create overlapping chunks from text"""
        # Simple sentence-based chunking
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            sentence_length = len(sentence)
            
            if current_length + sentence_length > self.chunk_size and current_chunk:
                # Save current chunk
                chunk_text = " ".join(current_chunk)
                chunks.append({
                    "content": chunk_text,
                    "metadata": {**metadata, "chunk_index": len(chunks)}
                })
                
                # Start new chunk with overlap
                overlap_text = " ".join(current_chunk[-3:]) if len(current_chunk) > 3 else ""
                current_chunk = [overlap_text, sentence] if overlap_text else [sentence]
                current_length = len(overlap_text) + sentence_length
            else:
                current_chunk.append(sentence)
                current_length += sentence_length
        
        # Add remaining chunk
        if current_chunk:
            chunks.append({
                "content": " ".join(current_chunk),
                "metadata": {**metadata, "chunk_index": len(chunks)}
            })
        
        return chunks
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        """Extract key sections from CV"""
        sections = {}
        
        # Common section headers in Vietnamese/English CVs
        patterns = {
            "experience": r'((kinh nghiệm|experience|work history|employment)[\s\S]*?)(?=(học vấn|education|skills|kỹ năng|projects|dự án|$))',
            "education": r'((học vấn|education|academic|qualification)[\s\S]*?)(?=(kinh nghiệm|experience|skills|kỹ năng|$))',
            "skills": r'((kỹ năng|skills|technical|technologies)[\s\S]*?)(?=(kinh nghiệm|experience|education|projects|$))',
            "projects": r'((dự án|projects|portfolio)[\s\S]*?)(?=(kinh nghiệm|experience|education|skills|$))'
        }
        
        for section, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                sections[section] = match.group(1).strip()[:2000]  # Limit length
        
        return sections