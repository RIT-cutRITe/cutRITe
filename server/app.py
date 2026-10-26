"""Primary Entrypoint for CutRITe API."""

import logging
import os

from fastapi import FastAPI

# One logger to rule them all. Modules call logging.getLogger(__name__).
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()


@app.get("/")
async def root() -> dict[str, str]:
    """Placeholder landing page."""
    return {"message": "Hello, World!"}
