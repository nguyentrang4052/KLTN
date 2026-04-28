import fitz  # PyMuPDF
from docx import Document
from typing import List, Dict, Any
import re
import structlog

logger = structlog.get_logger()

class CVProcessor:
    def __init__(self):
        self.chunk_size = 1500
        self.chunk_overlap = 300
        self.max_text_length = 50000  # KHÔNG ĐƯỢC THIẾU
    
    async def extract_text(self, file_bytes: bytes, mime_type: str) -> str:
        """Extract text với giới hạn kích thước"""
        try:
            if len(file_bytes) > 10 * 1024 * 1024:
                raise ValueError("File quá lớn (>10MB)")
            
            if mime_type == "application/pdf":
                text = await self._extract_pdf(file_bytes)
            elif mime_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
                text = await self._extract_docx(file_bytes)
            else:
                raise ValueError(f"Không hỗ trợ: {mime_type}")
            
            # Giới hạn độ dài
            if len(text) > self.max_text_length:
                text = text[:self.max_text_length] + "\n...[Đã cắt ngắn]..."
            
            return text
            
        except Exception as e:
            logger.error("extract_text_error", error=str(e))
            raise
    
    async def _extract_pdf(self, file_bytes: bytes) -> str:
        text = ""
        try:
            with fitz.open(stream=file_bytes, filetype="pdf") as doc:
                for i, page in enumerate(doc):
                    if i >= 50:  # Giới hạn 50 trang
                        break
                    text += page.get_text() + "\n"
        except Exception as e:
            raise ValueError(f"Không đọc được PDF: {str(e)}")
        return self._clean_text(text)
    
    async def _extract_docx(self, file_bytes: bytes) -> str:
        from io import BytesIO
        try:
            doc = Document(BytesIO(file_bytes))
            text = "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            raise ValueError(f"Không đọc được DOCX: {str(e)}")
        return self._clean_text(text)
    
    def _clean_text(self, text: str) -> str:
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def create_chunks(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            sentence_length = len(sentence)
            if current_length + sentence_length > self.chunk_size and current_chunk:
                chunks.append({
                    "content": " ".join(current_chunk),
                    "metadata": {**metadata, "chunk_index": len(chunks)}
                })
                overlap = current_chunk[-3:] if len(current_chunk) > 3 else []
                current_chunk = overlap + [sentence]
                current_length = sum(len(s) for s in overlap) + sentence_length
            else:
                current_chunk.append(sentence)
                current_length += sentence_length
        
        if current_chunk:
            chunks.append({
                "content": " ".join(current_chunk),
                "metadata": {**metadata, "chunk_index": len(chunks)}
            })
        
        return chunks
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        sections = {}
        patterns = {
            "experience": r'((kinh nghiệm|experience)[\s\S]*?)(?=(học vấn|education|$))',
            "education": r'((học vấn|education)[\s\S]*?)(?=(kinh nghiệm|experience|$))',
            "skills": r'((kỹ năng|skills)[\s\S]*?)(?=(kinh nghiệm|experience|$))',
        }
        for section, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                sections[section] = match.group(1).strip()[:2000]
        return sections