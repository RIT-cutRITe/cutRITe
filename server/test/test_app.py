"""Basic tests for the cutRITe API."""

from collections.abc import Iterator

import pytest
import requests
from fastapi.testclient import TestClient

from src.app import app

MENU_HTML = """
<div class="menu">
  <h3>Boxes</h3>
  <div>
    <ul>
      <li class="thumbnail" data-thumbnail="/abox.png">
        <a href="ABox">ABox</a> - A simple box
      </li>
    </ul>
  </div>
</div>
"""

PARAMS_HTML = """
<form id="arguments">
  <h3>Box</h3>
  <table>
    <tr>
      <td><label for="x">x</label></td>
      <td><input id="x" name="x" type="number" value="100"></td>
      <td id="x_description">Width</td>
    </tr>
  </table>
</form>
"""


class FakeResponse:
    """Stand-in for ``requests.Response``."""

    def __init__(self, text: str) -> None:
        """Store the canned response body."""
        self.text = text

    def raise_for_status(self) -> None:
        """Do nothing, as a successful response would."""


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> Iterator[TestClient]:
    """Return a client whose upstream Boxes.py requests serve canned HTML."""

    def fake_get(url: str, timeout: int) -> FakeResponse:
        """Return the menu or parameters page depending on the URL."""
        return FakeResponse(MENU_HTML if url.endswith("/Menu") else PARAMS_HTML)

    monkeypatch.setattr(requests, "get", fake_get)
    with TestClient(app) as test_client:
        yield test_client


def test_root(client: TestClient) -> None:
    """Check that the root endpoint returns the hello message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}


def test_get_all(client: TestClient) -> None:
    """Check that /getAll parses the menu page into generators."""
    response = client.get("/getAll")
    assert response.status_code == 200
    data = response.json()
    assert data["ABox"]["name"] == "ABox"
    assert data["ABox"]["type"] == "Boxes"
    assert data["ABox"]["image"] == "/abox.png"


def test_get_all_params(client: TestClient) -> None:
    """Check that /getAllParams returns the parsed parameters."""
    client.get("/getAll")
    response = client.get("/getAllParams", params={"name": "ABox"})
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["count"] == 1
    assert body["data"]["Box"][0]["name"] == "x"


def test_get_all_params_unknown_generator(client: TestClient) -> None:
    """Check that /getAllParams rejects an unknown generator with a 400."""
    response = client.get("/getAllParams", params={"name": "Nope"})
    assert response.status_code == 400
