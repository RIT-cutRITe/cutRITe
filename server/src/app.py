"""FastAPI entrypoint for the cutRITe API.

Proxies the Boxes.py web app and exposes its generators and their parameters as JSON.
"""
import logging
import os
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Annotated

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from src.scraper import menu_search, retrieve_parameters
from src.types import GenerateParamters, Generator, ParametersResponse

# Base URL of the Boxes.py service.
URL = "http://boxes:8000"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    """Initialize the generator cache on app startup."""
    app.state.itemsDict = {}
    yield

app = FastAPI(
    title="cutRITe Boxes API",
    description="API for retrieving Boxes.py generators and parameters.",
    version="1.0.0",
    lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_methods=["GET, POST"],
)

# One logger to rule them all. Modules call logging.getLogger(__name__).
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

@app.get("/")
async def root() -> dict:
    """Return a hello-world message; useful as a liveness check."""
    return {"message": "Hello, World!"}

@app.get(
    "/getAll",
    response_model=dict[str, Generator],
    tags=["Generators"],
    summary="Get all box generators",
    description="Retrieves all available generators from Boxes.py. Results are cached.")
async def get_all(request: Request) -> dict:
    """Scrape the Boxes.py menu page for all generators, caching them in app state."""
    if len(request.app.state.itemsDict) == 0:
        response = requests.get(URL + "/Menu", timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        request.app.state.itemsDict = menu_search(soup)
    return request.app.state.itemsDict


@app.get(
    "/getAllParams",
    response_model=ParametersResponse,
    tags=["Generators"],
    summary="Get generator parameters",
    description="Retrieves available parameters for a specified Boxes.py generator.")
async def get_all_params(request: Request,
    name: Annotated[str, Query(
        ...,
        description="The generator identifier returned by /getAll",
        examples=["ABox"]
    )]) -> dict:
    """Scrape one generator's page and return its parameters grouped by section.

    Raises:
        HTTPException: 400 if ``name`` was not returned by ``/getAll``.
    """
    # Some verification that name isn't malicious
    if name not in request.app.state.itemsDict:
        raise HTTPException(status_code=400, detail=f"Generator {name} does not exist")

    response = requests.get(URL + "/" + name, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    data = retrieve_parameters(soup)

    return {
        "status": "success",
        "count": sum(len(parameters) for parameters in data.values()),
        "data": data
    }

@app.get(
    "/getImage",
    # response_model=Response,
    tags=["Generators"],
    summary="Get generator image from path",
    description="Retrieves image for a specified Boxes.py image link.")
async def get_image(request: Request, path: Annotated[str, Query(
        ...,
        description="The image returned by /getAll",
        examples=["ABox"]
    )]) -> Response:
    """."""
    result = requests.get(URL + path)
    if result.status_code > 300:
        raise HTTPException(result.status_code, detail="Image not found: " + path)
    return Response(result.content, media_type="image/jpeg")

@app.post(
    "/generate",
    tags=["Generators"],
    summary="Get generator svg",
    description="Retrieves svg for a specified Boxes.py generator and parameters.")
async def generate(request: Request,
    name: Annotated[str, Query(
        ...,
        description="The generator identifier returned by /getAll",
        examples=["ABox"]
    )], parameters: GenerateParamters) -> Response:
    """."""
    # url = URL.join([param[0] for key, param in parameters.params.items()])
    url = URL
    for _section_name, section in parameters.params.items():
        for parameter in section:
            if parameter.value:
                url += f"?{parameter.name}={parameter.value}"
            elif parameter.default:
                url += f"{parameter.name}={parameter.default}"
            else:
                logger.log(logging.WARNING, f"No value or default for {parameter.name}")  # noqa: G004 # circular error?
    result = requests.get(url)
    return Response(result.content, media_type="image/svg+xml")
