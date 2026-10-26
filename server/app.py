from http.client import HTTPException

from bs4 import BeautifulSoup
from contextlib import asynccontextmanager
import requests
from fastapi import FastAPI, Request, HTTPException

URL = "http://boxes:8000"
URL_2 = "http://boxes:8000/ABox"

# 1. Initialize state within a lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup phase: Assign variables to app.state
    app.state.itemsDict = {}
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

def homepage_search(soup: BeautifulSoup, classname: str) -> dict:
    returnDict = {}
    for span in soup.find_all("span", class_=classname):
        link = span.find_all("a")[0]
        image = link.find_all("img")
        if len(image) > 0:
            src = image[0].get("src")
        name = link.get_text(strip=True)
        title = link.get("title")
        href = link["href"]

        if name:
            returnDict[href] = {
                "link": href,
                "name": name,
            }
            if image:
                returnDict[name].update({"image": src})
            if title:
                returnDict[name].update({"title": title})
    return returnDict

@app.get("/getAll")
async def getAll(request: Request):
    if len(request.app.state.itemsDict) == 0:
        response = requests.get(URL, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        allValues = {}

        # For all the normal items with images
        allValues.update(homepage_search(soup, "gallery"))
        # All the items without images have a different classname
        allValues.update(homepage_search(soup, "gallery_missing"))

        request.app.state.itemsDict = allValues
    return request.app.state.itemsDict


@app.get("/getAllParams")
async def get_all_params(request: Request, name: str):
    # Some verification that name isn't malicious
    if name not in request.app.state.itemsDict:
        raise HTTPException(status_code=400, detail=f"Generator {name} does not exist")

    response = requests.get(URL + "/" + name, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    
    data = []
    for row in soup.find_all('tr')[1:]:  # skip header
        cells = [td.get_text(strip=True) for td in row.find_all('td')]
        data.append({
            "col1": cells[0],
            "col2": cells[1],
            "col3": cells[2]
        })

    response = {
        "status": "success",
        "count": len(data),
        "data": data
    }

    return response