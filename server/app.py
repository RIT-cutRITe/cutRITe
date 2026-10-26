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

@app.get("/getAll")
async def getAll(request: Request):
    if len(request.app.state.itemsDict) == 0:
        response = requests.get(URL, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        allValues = {}

        for span in soup.find_all("span", class_="gallery"):
            link = span.find_all("a")[0]
            image = link.find_all("img")[0]
            src = image.get("src")
            name = link.get_text(strip=True)
            title = link.get("title")
            href = link["href"]

            if name:
                allValues[name] = {
                    "link": href,
                    "image": src,
                    "title": title,
                }

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