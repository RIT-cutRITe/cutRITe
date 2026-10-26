# Python Style Guide

Applies to everything under `server/`. Stack: Python 3.14+, FastAPI, Uvicorn, Docker (see the [Decision Log](../CONTRIBUTING.md#decision-log)).

If this guide and a tool disagree, the tool wins and this guide gets fixed.

## Formatting & Linting

- Follow [PEP 8](https://peps.python.org/pep-0008/). [Ruff](https://docs.astral.sh/ruff/) enforces it: `ruff format` then `ruff check`.
- Line length 100.
- Imports: stdlib, third-party, local, each group separated by a blank line (Ruff's `I` rules sort them).
- **No wildcard imports** (`from boxes import *`). Import what you use so readers and type checkers can see where names come from.
- Naming: `snake_case` functions/variables/modules, `PascalCase` classes, `UPPER_SNAKE_CASE` constants, `_leading_underscore` for module-private.

## Type Hints

Every function, method, and module-level variable whose type isn't obvious gets a type hint. No exceptions for "small" helpers.

- Annotate **all** parameters and **all** return types, including `-> None`.
- Use modern syntax: `list[str]`, `dict[str, int]`, `X | None`. Not `List`, `Dict`, `Optional`, `Union`.
- Avoid `Any`. If you truly need it, leave a comment explaining why.
- Use `Annotated` for FastAPI parameters so the type and its metadata stay together (see example below).
- Request/response bodies are stdlib `@dataclass`es, never bare `dict`s. **Don't import `pydantic` directly**; FastAPI uses it internally, but our code stays on the stdlib.
- Type checking runs with [ty](https://docs.astral.sh/ty/) (`uvx ty check` from `server/`, configured in `ty.toml`). Ruff checks that hints exist; ty checks they're correct. Code must pass with no errors and no blanket ignores. A targeted ignore needs the rule name and a reason: `# ty: ignore[unresolved-import]  # boxes ships no type info`.

```python
# Bad
def get_box(name, params=None):
    ...

# Good
def get_box(name: str, params: dict[str, float] | None = None) -> BoxGenerator:
    ...
```

## Docstrings

Every public module, class, and function gets a docstring. Use [Google style](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings).

- First line: one-sentence summary in the imperative mood ("Return...", "Generate..."), ending in a period.
- `Args:`, `Returns:`, `Raises:` sections when they apply. Don't repeat the types; the hints already say them.
- Explain *why* and any non-obvious behavior, not a line-by-line narration.
- Modules start with a docstring saying what the module is for.

```python
def render_svg(generator: BoxGenerator, thickness: float) -> str:
    """Render a box generator to an SVG string.

    Args:
        generator: Configured generator to render.
        thickness: Material thickness in mm. Affects finger-joint sizing.

    Returns:
        The SVG document as text.

    Raises:
        ValueError: If ``thickness`` is not positive.
    """
```

Comments (`#`) are for explaining tricky lines. Don't leave commented-out code or long scratch notes in committed files; put plans in an issue, not a comment.

## API Docs (Swagger / OpenAPI)

FastAPI builds the OpenAPI schema at `/docs` (Swagger UI) and `/redoc` from the code. That schema is the API's documentation, so every endpoint must render cleanly there.

Every route must have:

- `summary=`: short title shown in the endpoint list.
- A **docstring**: FastAPI uses it as the endpoint's description (Markdown is supported).
- `tags=`: group related endpoints.
- A typed return (a dataclass) so the response schema is documented.
- `responses=` for every non-200 status the endpoint can return.
- `description=` (and `examples=` where helpful) on every path/query parameter.
- An `Attributes:` section in each response/request dataclass's docstring. FastAPI shows the class docstring in the schema; per-field descriptions aren't available without Pydantic.

```python
"""Endpoints for listing and rendering box generators."""

from dataclasses import dataclass
from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Query

router = APIRouter(prefix="/boxes", tags=["boxes"])


@dataclass
class BoxSummary:
    """Short description of an available box generator.

    Attributes:
        name: Unique generator name, e.g. ``ClosedBox``.
        description: Human-readable summary of the generator.
    """

    name: str
    description: str


@router.get(
    "/{name}",
    summary="Get a box generator",
    responses={404: {"description": "No generator with that name exists."}},
)
async def get_box(
    name: Annotated[str, Path(description="Generator name.", examples=["ClosedBox"])],
    thickness: Annotated[float, Query(gt=0, description="Material thickness in mm.")] = 3.0,
) -> BoxSummary:
    """Return metadata for a single box generator.

    Looks up the generator in boxes.py first, then in the static templates.
    """
    ...
    raise HTTPException(status_code=404, detail=f"Unknown generator: {name}")
```

Before opening a PR that touches an endpoint, open `/docs` and check it reads well.

## Errors

- Raise `HTTPException` with a clear `detail` for client errors; document the status in `responses=`.
- Catch specific exceptions, never bare `except:` or a silent `except Exception: pass`.

## Logging

Use the stdlib `logging` module. It's configured once in `app.py` (level from the `LOG_LEVEL` env var, set in `compose.yaml`); output goes to stderr, so `docker compose logs server` shows it.

- Each module gets its own logger: `logger = logging.getLogger(__name__)`. Never call `logging.basicConfig` outside `app.py`, and never use `print()` for diagnostics.
- Pass values as arguments, don't pre-format: `logger.info("Rendering %s", name)`, not `logger.info(f"Rendering {name}")`. The message is only built if the level is enabled.
- Inside `except`, use `logger.exception(...)` so the traceback is included.
- Levels: `DEBUG` for detail useful only while developing, `INFO` for normal events worth seeing in production, `WARNING` for recoverable problems, `ERROR` when a request fails.
- Never log secrets, tokens, or full request bodies that may hold user data.

## Dependencies

- Pin exact versions in `requirements.txt` (`package==x.y.z`).
- Before adding a package, check whether the stdlib or an existing dependency already does the job.
