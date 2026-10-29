"""Primary Entrypoint for CutRITe API."""
import logging
import os
from contextlib import asynccontextmanager
from typing import Annotated

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException, Query, Request

from src.scraper import homepage_search, retrieve_parameters
from src.types import Generator, ParametersResponse

URL = "http://boxes:8000"

# 1. Initialize state within a lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """."""
    # Setup phase: Assign variables to app.state
    app.state.itemsDict = {}
    yield

app = FastAPI(
    title="cutRITe Boxes API",
    description="API for retrieving Boxes.py generators and parameters.",
    version="1.0.0",
    lifespan=lifespan)

# One logger to rule them all. Modules call logging.getLogger(__name__).
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

@app.get("/")
async def root() -> dict:
    """."""
    return {"message": "Hello, World!"}

# def homepage_search(soup: BeautifulSoup, classname: str) -> dict:
#     returnDict: dict = {}
#     for span in soup.find_all("span", class_=classname):
#         link = span.find_all("a")[0]
#         image = link.find_all("img")
#         src = None
#         if len(image) > 0:
#             src = image[0].get("src")
#         name = link.get_text(strip=True)
#         title = link.get("title")
#         href = link["href"]

#         if name:
#             returnDict[href] = {
#                 "link": href,
#                 "name": name,
#             }
#             if image and src:
#                 returnDict[name].update({"image": src})
#             if title:
#                 returnDict[name].update({"title": title})
#     return returnDict

@app.get(
    "/getAll",
    response_model=dict[str, Generator],
    tags=["Generators"],
    summary="Get all box generators",
    description="Retrieves all available generators from Boxes.py. Results are cached.")
async def get_all(request: Request) -> dict:
    """."""
    if len(request.app.state.itemsDict) == 0:
        response = requests.get(URL, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        all_values = {}

        # For all the normal items with images
        all_values.update(homepage_search(soup, "gallery"))
        # All the items without images have a different classname
        all_values.update(homepage_search(soup, "gallery_missing"))

        request.app.state.itemsDict = all_values
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
    """."""
    # Some verification that name isn't malicious
    if name not in request.app.state.itemsDict:
        raise HTTPException(status_code=400, detail=f"Generator {name} does not exist")

    response = requests.get(URL + "/" + name, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    data = retrieve_parameters(soup)

    # for table in soup.select("form#arguments table"):
    #     heading = table.find_previous_sibling("h3")
    #     group = heading.get_text(strip=True) if heading else "Other"

    #     data.setdefault(group, [])

    #     for row in table.find_all("tr"):
    #         label = row.find("label")
    #         field = row.find("select") or row.find("input", id=True)

    #         if not label or not field:
    #             continue

    #         name = field.get("name")
    #         description = row.find("td", id=f"{name}_description")

    #         if field.name == "select":
    #             field_type = "select"
    #             options = [
    #                 option["value"]
    #                 for option in field.find_all("option")
    #             ]

    #             selected = field.find("option", selected=True)
    #             default = selected["value"] if selected else (
    #                 options[0] if options else ""
    #             )

    #         elif field.get("type") == "checkbox":
    #             field_type = "checkbox"
    #             options = None
    #             default = field.has_attr("checked")

    #         else:
    #             field_type = field.get("type", "text")
    #             options = None
    #             default = field.get("value", "")

    #         data[group].append({
    #             "name": name,
    #             "type": field_type,
    #             "default": default,
    #             "description": (
    #                 description.get_text(" ", strip=True)
    #                 if description else ""
    #             ),
    #             "options": options
    #         })

    return {
        "status": "success",
        "count": sum(len(parameters) for parameters in data.values()),
        "data": data
    }
