"""The methods for scraping boxes.py."""

from bs4 import BeautifulSoup


def homepage_search(soup: BeautifulSoup, classname: str) -> dict:
    """Parses through the homepage of boxes.py and retrieves all generator data."""
    return_dict: dict = {}
    for span in soup.find_all("span", class_=classname):
        link = span.find_all("a")[0]
        image = link.find_all("img")
        src = None
        if len(image) > 0:
            src = image[0].get("src")
        name = link.get_text(strip=True)
        title = link.get("title")
        href = link["href"]

        if name:
            return_dict[href] = {
                "link": href,
                "name": name,
            }
            if image and src:
                return_dict[name].update({"image": src})
            if title:
                return_dict[name].update({"title": title})
    return return_dict


def retrieve_parameters(soup: BeautifulSoup) -> dict:
    """Parses through the page of a provided boxes.py generator and returns all the parameters."""
    data: dict = {}
    for table in soup.select("form#arguments table"):
        heading = table.find_previous_sibling("h3")
        group = heading.get_text(strip=True) if heading else "Other"

        data.setdefault(group, [])

        for row in table.find_all("tr"):
            label = row.find("label")
            field = row.find("select") or row.find("input", id=True)

            if not label or not field:
                continue

            name = field.get("name")
            description = row.find("td", id=f"{name}_description")

            if field.name == "select":
                field_type = "select"
                options = [option["value"] for option in field.find_all("option")]

                selected = field.find("option", selected=True)
                default = selected["value"] if selected else (options[0] if options else "")

            elif field.get("type") == "checkbox":
                field_type = "checkbox"
                options = None
                default = field.has_attr("checked")

            else:
                field_type = field.get("type", "text")
                options = None
                default = field.get("value", "")

            data[group].append(
                {
                    "name": name,
                    "type": field_type,
                    "default": default,
                    "description": (description.get_text(" ", strip=True) if description else ""),
                    "options": options,
                }
            )

    return data
