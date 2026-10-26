from bs4 import BeautifulSoup
import requests
from fastapi import FastAPI

URL = "http://boxes:8000"
URL_2 = "http://boxes:8000/ABox"
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
        href = link.get("href")

        if name:
            allValues[name] = {
                "link": URL + "/" + href,
                "image": src,
                "title": title,
            }

    return allValues

@app.get("/getAllParams")
async def get_all_params():
    response = requests.get(URL_2, timeout=10)
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