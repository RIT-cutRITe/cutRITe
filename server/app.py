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

    return allValues