from bs4 import BeautifulSoup
import requests
from fastapi import FastAPI

URL = "http://boxes:8000"
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.get("/getAll")
async def getAll():
    response = requests.get(URL, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    allValues = {}

    for link in soup.find_all("a", href=True):
        name = link.get_text(strip=True)
        href = link["href"]

        if name:
            allValues[name] = [href]

    return allValues