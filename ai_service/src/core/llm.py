import httpx
import json
from typing import Optional, Dict, Any, AsyncGenerator, Literal
from tenacity import retry, stop_after_attempt, wait_exponential
from src.config.settings import settings
import structlog

logger = structlog.get_logger()


class LLMClient:
    """OpenRouter LLM client with streaming support"""
    
    def __init__(
        self,
        model: str = "z-ai/glm-4.5-air:free",
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
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def complete(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        response_format: Optional[Dict] = None,
        system_message: Optional[str] = None
    ) -> str:
        """Non-streaming completion"""
        
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
        
        async with httpx.AsyncClient(timeout=60.0) as client:
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
    
    async def stream(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        system_message: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Streaming completion"""
        
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload
            ) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        
                        try:
                            chunk = json.loads(data)
                            delta = chunk["choices"][0]["delta"]
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue
                        except (KeyError, IndexError):
                            continue
    
    async def classify_intent(
        self,
        query: str,
        valid_intents: list
    ) -> str:
        """Classify query intent"""
        prompt = f"""Phân loại câu hỏi sau thành 1 trong các intent: {', '.join(valid_intents)}

Câu hỏi: "{query}"

Chỉ trả về tên intent, không giải thích."""
        
        response = await self.complete(
            prompt,
            temperature=0.1,
            max_tokens=20
        )
        
        intent = response.strip().lower()
        return intent if intent in valid_intents else "general"
    
    async def extract_json(
        self,
        prompt: str,
        temperature: float = 0.2,
        max_retries: int = 2
    ) -> Dict[str, Any]:
        """Extract JSON from LLM response with retry"""
        
        for attempt in range(max_retries):
            try:
                response = await self.complete(
                    prompt,
                    temperature=temperature,
                    response_format={"type": "json_object"}
                )
                
                # Clean markdown
                cleaned = response.replace("```json", "").replace("```", "").strip()
                return json.loads(cleaned)
                
            except json.JSONDecodeError as e:
                logger.warning(
                    "json_parse_failed", 
                    attempt=attempt + 1,
                    error=str(e)
                )
                
                if attempt == max_retries - 1:
                    raise
                
                # Retry with stricter prompt
                prompt += "\n\nQUAN TRỌNG: Chỉ trả về JSON thuần, không markdown, không text thừa."
        
        return {}
    
    def estimate_tokens(self, text: str) -> int:
        """Rough token estimation"""
        return len(text.split()) * 1.3  # Rough estimate