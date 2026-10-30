"""HTML scraping helpers for the Boxes.py web app."""

from bs4 import BeautifulSoup


def menu_search(soup: BeautifulSoup) -> dict:
    """Collect generators from the Boxes.py ``/Menu`` page.

    Returns a dict keyed by each generator's href, with ``link``, ``name``,
    ``type`` (menu category), ``title`` (description) and optional ``image``.
    """
    return_dict: dict = {}

    for heading in soup.select("div.menu h3"):
        category = heading.get_text(strip=True)

        section = heading.find_next_sibling("div")
        if not section:
            continue

        for item in section.select("li.thumbnail"):
            link = item.find("a")
            if not link:
                continue

            href = link.get("href")
            name = link.get_text(strip=True)

            if not href or not name:
                continue

            # Description is the text after the link
            description = item.get_text(" ", strip=True)
            description = description.removeprefix(name).lstrip(" -")
            description = " ".join(description.split())

            image = item.get("data-thumbnail")

            return_dict[href] = {
                "link": href,
                "name": name,
                "type": category,
                "title": description,
            }

            if image:
                return_dict[href]["image"] = image

    return return_dict


def retrieve_parameters(soup: BeautifulSoup) -> dict:
    """Parse a generator page's argument form.

    Returns a dict mapping each section heading to a list of parameter dicts
    (``name``, ``type``, ``default``, ``description``, ``options``).
    """
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
