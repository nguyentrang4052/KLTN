"""Translation service for English ↔ Vietnamese"""
import re

import httpx
import asyncio
from typing import Optional, Literal
from enum import Enum
import structlog

from src.config.settings import settings

logger = structlog.get_logger()


class Language(str, Enum):
    VIETNAMESE = "vi"
    ENGLISH = "en"


class TranslationService:
    """
    Service dịch thuật Anh - Việt.
    Hỗ trợ cả Google Translate API (free) và local model fallback.
    """
    
    def __init__(self):
        self._cache: dict = {}
        self._cache_max_size = 1000
        
        # Cấu hình Google Translate API (free, không cần key)
        self.google_translate_url = "https://translate.googleapis.com/translate_a/single"
        
        # Cấu hình HuggingFace translation models (optional)
        self.use_huggingface = bool(settings.huggingface_api_key) if hasattr(settings, 'huggingface_api_key') else False
        self.huggingface_url = "https://api-inference.huggingface.co/models/"
        
        logger.info("translation_service_initialized", 
                   use_huggingface=self.use_huggingface,
                   cache_size=self._cache_max_size)
        
    
    def detect_language(self, text: str) -> Language:
        """Phát hiện ngôn ngữ của văn bản - ƯU TIÊN TIẾNG VIỆT"""
        if not text:
            return Language.VIETNAMESE
        
        text_lower = text.lower().strip()
        
        # Bộ ký tự tiếng Việt có dấu
        vietnamese_chars = set("áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ")
        
        # Từ tiếng Việt phổ biến
        viet_words = [
            "tôi", "bạn", "chào", "cảm ơn", "xin", "làm ơn", "việc", "lương", 
            "gì", "nào", "sao", "thế", "này", "kia", "đó", "ạ", "nhé", "nhỉ",
            "của", "với", "cho", "về", "mà", "thì", "là", "một", "những",
            "được", "không", "có", "sẽ", "đang", "rất", "hơn", "như", "các",
            "nhưng", "hoặc", "khi", "nếu", "vì", "nên", "vẫn", "lại", "ra",
            "vào", "lên", "xuống", "theo", "qua", "lại", "chỉ", "còn",
            "phỏng vấn", "câu hỏi", "trả lời", "ứng viên", "tuyển dụng",
            "kinh nghiệm", "kỹ năng", "công ty", "vị trí"
        ]
        
        # Từ tiếng Anh phổ biến (để phân biệt)
        english_words = [
            "the", "and", "of", "to", "in", "for", "on", "with", "by", 
            "that", "is", "are", "was", "were", "be", "been", "being",
            "have", "has", "had", "having", "do", "does", "did", "doing",
            "a", "an", "this", "these", "those", "it", "they", "we", "you",
            "what", "where", "when", "why", "how", "which", "who", "whom",
            "interview", "question", "answer", "job", "position", "company"
        ]
        
        # Đếm số lượng từ trong text
        words = re.findall(r'\b[a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+\b', text_lower)
        
        viet_count = 0
        eng_count = 0
        
        for w in words:
            if w in viet_words:
                viet_count += 1
            if w in english_words:
                eng_count += 1
        
        # Kiểm tra dấu tiếng Việt
        has_vietnamese_diacritics = any(c in text_lower for c in vietnamese_chars)
        
        # 🔥 QUAN TRỌNG: Ưu tiên nhận diện tiếng Việt
        # Nếu có dấu tiếng Việt -> chắc chắn là tiếng Việt
        if has_vietnamese_diacritics:
            logger.debug(f"Detected Vietnamese: has diacritics")
            return Language.VIETNAMESE
        
        # Nếu có nhiều từ tiếng Việt hơn tiếng Anh
        if viet_count > eng_count and viet_count >= 1:
            logger.debug(f"Detected Vietnamese: viet_words={viet_count}, eng_words={eng_count}")
            return Language.VIETNAMESE
        
        # Nếu text dài và có ít nhất 1 từ tiếng Việt
        if len(words) > 3 and viet_count >= 1:
            logger.debug(f"Detected Vietnamese: has Vietnamese words")
            return Language.VIETNAMESE
        
        # Mặc định: text ASCII -> tiếng Anh
        if len(text) > 0 and all(ord(c) < 128 for c in text):
            logger.debug(f"Detected English: ASCII text")
            return Language.ENGLISH
        
        # Fallback: tiếng Việt
        logger.debug(f"Defaulting to Vietnamese")
        return Language.VIETNAMESE
    
    async def translate(
        self,
        text: str,
        source_lang: Language,
        target_lang: Language,
        use_cache: bool = True
    ) -> str:
        """
        Dịch văn bản giữa tiếng Anh và tiếng Việt
        
        Args:
            text: Văn bản cần dịch
            source_lang: Ngôn ngữ nguồn (vi/en)
            target_lang: Ngôn ngữ đích (vi/en)
            use_cache: Có dùng cache hay không
        
        Returns:
            Văn bản đã dịch
        """
        if not text or not text.strip():
            return text
        
        # Kiểm tra cache
        cache_key = f"{source_lang}:{target_lang}:{text[:100].lower()}"
        if use_cache and cache_key in self._cache:
            logger.debug("translation_cache_hit", key=cache_key[:50])
            return self._cache[cache_key]
        
        try:
            # Thử Google Translate trước (nhanh, free)
            translated = await self._translate_google(text, source_lang, target_lang)
            
            # Lưu cache
            if use_cache:
                self._add_to_cache(cache_key, translated)
            
            return translated
            
        except Exception as e:
            logger.warning("google_translate_failed", error=str(e))
            
            # Fallback: Dùng local method (rule-based cho text ngắn)
            if len(text) < 200:
                translated = self._simple_fallback_translate(text, source_lang, target_lang)
            else:
                # Nếu dài quá, trả về text gốc + warning
                logger.error("translation_failed_no_fallback", text_length=len(text))
                translated = f"[Dịch tạm] {text}"
            
            return translated
    
    async def _translate_google(
        self,
        text: str,
        source_lang: Language,
        target_lang: Language
    ) -> str:
        """Dùng Google Translate API (free, không cần key)"""
        params = {
            "client": "gtx",
            "sl": source_lang.value,
            "tl": target_lang.value,
            "dt": "t",
            "q": text
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(self.google_translate_url, params=params)
            response.raise_for_status()
            
            # Parse response: [["Hello", "en", None, None], ...]
            data = response.json()
            
            # Kết hợp các đoạn dịch
            translated_parts = []
            for part in data[0]:
                if part and part[0]:
                    translated_parts.append(part[0])
            
            return " ".join(translated_parts)
    
    async def _translate_huggingface(
        self,
        text: str,
        source_lang: Language,
        target_lang: Language
    ) -> str:
        """Dùng HuggingFace models (cần API key)"""
        if not self.use_huggingface:
            raise ValueError("HuggingFace API not configured")
        
        # Chọn model phù hợp
        if source_lang == Language.ENGLISH and target_lang == Language.VIETNAMESE:
            model = "Helsinki-NLP/opus-mt-en-vi"
        elif source_lang == Language.VIETNAMESE and target_lang == Language.ENGLISH:
            model = "Helsinki-NLP/opus-mt-vi-en"
        else:
            raise ValueError(f"Unsupported language pair: {source_lang} -> {target_lang}")
        
        headers = {"Authorization": f"Bearer {settings.huggingface_api_key}"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.huggingface_url}{model}",
                headers=headers,
                json={"inputs": text}
            )
            response.raise_for_status()
            data = response.json()
            
            # Parse response
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("translation_text", text)
            elif isinstance(data, dict):
                return data.get("translation_text", text)
            
            return text
    
    def _simple_fallback_translate(
        self,
        text: str,
        source_lang: Language,
        target_lang: Language
    ) -> str:
        """
        Fallback đơn giản cho text ngắn.
        Chỉ hoạt động với các cụm từ phổ biến.
        """
        # Dictionary các cụm từ thông dụng
        common_phrases = {
            # English -> Vietnamese
            "hello": "xin chào",
            "hi": "chào",
            "good morning": "chào buổi sáng",
            "good afternoon": "chào buổi chiều",
            "good evening": "chào buổi tối",
            "thank you": "cảm ơn",
            "thanks": "cảm ơn",
            "sorry": "xin lỗi",
            "yes": "có",
            "no": "không",
            "please": "làm ơn",
            "help": "giúp đỡ",
            "job": "công việc",
            "salary": "lương",
            "skill": "kỹ năng",
            "experience": "kinh nghiệm",
            "company": "công ty",
            "position": "vị trí",
            "interview": "phỏng vấn",
            "cv": "cv",
            "resume": "hồ sơ",
            
            # Vietnamese -> English
            "xin chào": "hello",
            "chào": "hi",
            "cảm ơn": "thank you",
            "cám ơn": "thank you",
            "xin lỗi": "sorry",
            "có": "yes",
            "không": "no",
            "làm ơn": "please",
            "giúp": "help",
            "công việc": "job",
            "việc làm": "job",
            "lương": "salary",
            "kỹ năng": "skill",
            "kinh nghiệm": "experience",
            "công ty": "company",
            "vị trí": "position",
            "phỏng vấn": "interview",
        }
        
        text_lower = text.lower().strip()
        
        # Kiểm tra exact match
        if source_lang == Language.ENGLISH and target_lang == Language.VIETNAMESE:
            if text_lower in common_phrases:
                return common_phrases[text_lower]
        elif source_lang == Language.VIETNAMESE and target_lang == Language.ENGLISH:
            if text_lower in common_phrases:
                return common_phrases[text_lower]
        
        # Không tìm thấy, trả về text gốc
        return text
    
    def _add_to_cache(self, key: str, value: str):
        """Thêm vào cache, tự động xóa cũ nếu quá size"""
        if len(self._cache) >= self._cache_max_size:
            # Xóa 20% cũ nhất
            remove_count = int(self._cache_max_size * 0.2)
            for old_key in list(self._cache.keys())[:remove_count]:
                del self._cache[old_key]
        
        self._cache[key] = value
    
    def get_cache_stats(self) -> dict:
        """Lấy thống kê cache"""
        return {
            "cache_size": len(self._cache),
            "max_size": self._cache_max_size
        }


# Singleton instance
_translation_service: Optional[TranslationService] = None


def get_translation_service() -> TranslationService:
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service

async def translate_on_request(
    self,
    text: str,
    source_lang: Optional[Language] = None,
    target_lang: Optional[Language] = None,
    user_request: str = ""
) -> str:
    """
    Dịch text KHI ĐƯỢC YÊU CẦU
    Nếu không có yêu cầu rõ ràng, trả về text gốc
    """
    if not user_request:
        return text
    
    user_lower = user_request.lower()
    
    # Kiểm tra yêu cầu dịch sang tiếng Anh
    to_english = any(phrase in user_lower for phrase in [
        "dịch sang tiếng anh", "translate to english",
        "bằng tiếng anh", "in english", "english please",
        "trả lời bằng tiếng anh", "answer in english"
    ])
    
    # Kiểm tra yêu cầu dịch sang tiếng Việt
    to_vietnamese = any(phrase in user_lower for phrase in [
        "dịch sang tiếng việt", "translate to vietnamese",
        "bằng tiếng việt", "in vietnamese",
        "trả lời bằng tiếng việt", "answer in vietnamese"
    ])
    
    if to_english:
        logger.info("Translating to English as requested")
        return await self.translate(text, Language.VIETNAMESE, Language.ENGLISH)
    
    if to_vietnamese:
        logger.info("Translating to Vietnamese as requested")
        return await self.translate(text, Language.ENGLISH, Language.VIETNAMESE)
    
    # Không có yêu cầu, trả về gốc
    return text