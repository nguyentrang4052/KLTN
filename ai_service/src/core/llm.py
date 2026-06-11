import httpx
import asyncio
from typing import Optional, Dict, Any, AsyncGenerator, Literal
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from src.config.settings import settings
import structlog
import json

logger = structlog.get_logger()

class LLMClient:
    def __init__(
        self,
        model: str = "meta-llama/llama-3-8b-instruct",
        base_url: Optional[str] = None,
        api_key: Optional[str] = None
    ):
        self.model = model
        self.base_url = base_url or settings.openrouter_base_url
        self.api_key = api_key or settings.openrouter_api_key
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://career-rag-bot.local",
            "X-Title": "Career RAG Bot"
        }
    
    @retry(
        stop=stop_after_attempt(2),  # Giảm xuống 2 lần để tránh treo quá lâu
        wait=wait_exponential(multiplier=1, min=2, max=5),
        retry=retry_if_exception_type((httpx.TimeoutException, httpx.ConnectError))
    )
    async def complete(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        response_format: Optional[Dict] = None,
        system_message: Optional[str] = None
    ) -> str:
        if system_message is None:
            system_message = """Bạn là trợ lý AI chuyên nghiệp, thân thiện. 
                QUY TẮC QUAN TRỌNG:
                1. Trả lời TRỰC TIẾP câu hỏi, KHÔNG lặp lại hướng dẫn hay quy tắc trong câu trả lời
                2. KHÔNG thêm các cụm từ như "Dựa trên yêu cầu của bạn", "Theo hướng dẫn", "Như bạn đã yêu cầu"
                3. KHÔNG liệt kê các quy tắc hoặc điều kiện trong câu trả lời
                4. Chỉ xuất ra nội dung câu trả lời thuần túy
                5. Sử dụng ngôn ngữ tự nhiên, dễ hiểu"""

        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        if response_format:
            payload["response_format"] = response_format
        
        # Timeout 30s cho OpenRouter
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                
                content = data["choices"][0]["message"]["content"]
                usage = data.get("usage", {})
                
                logger.debug(
                    "llm_completion",
                    model=self.model,
                    prompt_tokens=usage.get("prompt_tokens"),
                    completion_tokens=usage.get("completion_tokens")
                )
                
                return content
                
            except httpx.TimeoutException:
                logger.error("llm_timeout", model=self.model)
                raise  # Để tenacity retry
            except Exception as e:
                logger.error("llm_error", error=str(e))
                raise
    
    async def classify_intent(self, query: str, valid_intents: list) -> str:
        """Classify với timeout ngắn hơn"""
        prompt = f"""Phân loại câu hỏi sau thành 1 trong các intent: {', '.join(valid_intents)}

Câu hỏi: "{query}"

Chỉ trả về tên intent, không giải thích."""
        
        try:
            response = await asyncio.wait_for(
                self.complete(prompt, temperature=0.1, max_tokens=20),
                timeout=15.0  # Intent classification nhanh hơn
            )
            intent = response.strip().lower()
            return intent if intent in valid_intents else "general"
        except asyncio.TimeoutError:
            logger.warning("intent_classification_timeout")
            return "general"
    
    async def extract_json(self, prompt: str, temperature: float = 0.2, max_retries: int = 2) -> Dict[str, Any]:
        """Extract JSON với timeout và retry - FIX 400 Bad Request"""
        for attempt in range(max_retries):
            try:
                # FIX: Không dùng response_format nếu model không hỗ trợ
                # Thay vào đó yêu cầu JSON trong prompt và parse thủ công
                response = await asyncio.wait_for(
                    self.complete(
                        prompt + "\n\nQUAN TRỌNG: Chỉ trả về JSON thuần, không markdown, không giải thích.",
                        temperature=temperature,
                        max_tokens=2000,
                        # Bỏ response_format để tránh 400 với một số model
                    ),
                    timeout=30.0
                )
                
                # Parse JSON từ response
                cleaned = response.strip()
                # Tìm JSON trong code block
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0].strip()
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0].strip()
                
                return json.loads(cleaned)
                
            except json.JSONDecodeError as e:
                logger.warning("json_parse_failed", attempt=attempt + 1, error=str(e), response_preview=response[:200] if 'response' in dir() else 'N/A')
                if attempt == max_retries - 1:
                    raise
            except asyncio.TimeoutError:
                logger.warning("json_extract_timeout", attempt=attempt + 1)
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(1)
            except Exception as e:
                # FIX: Nếu là 400 Bad Request, thử lại không dùng response_format
                logger.warning("llm_request_failed", attempt=attempt + 1, error=str(e))
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(1)
        
        return {}