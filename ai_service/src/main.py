import uvicorn
from src.api import app
from src.config.settings import settings


if __name__ == "__main__":
    uvicorn.run(
        "src.api:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.debug,
        workers=1 if settings.debug else 4
    )