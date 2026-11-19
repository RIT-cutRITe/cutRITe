"""Filter ``/getAllParams`` JSON with .gitignore-style glob patterns.

Each parameter is addressed as ``<generator>/<section>/<param name>``, e.g.
``ABox/Default Settings/format``. Patterns follow .gitignore rules:

- ``#`` starts a comment, blank lines are ignored.
- ``*``, ``?`` and ``[...]`` match within one path segment (never across ``/``).
- A pattern containing ``/`` is anchored at the generator; one without ``/``
  matches any segment (so ``thickness`` hits that param in every section).
- Matching a section matches every parameter inside it.
- ``!`` re-includes; the last matching pattern wins. A negation can
  re-include a parameter inside a matched section.
"""

from fnmatch import fnmatchcase
from pathlib import Path

ADVANCED_PARAMETERS = Path(__file__).parent.parent / "advanced_parameters"


def load_patterns(path: Path = ADVANCED_PARAMETERS) -> list[str]:
    """Read a .gitignore-style file into a list of patterns, skipping blanks and comments."""
    lines = (line.strip() for line in path.read_text().splitlines())
    return [line for line in lines if line and not line.startswith("#")]


def _pattern_matches(pattern: str, path: tuple[str, ...]) -> bool:
    """Return True if ``pattern`` (without ``!``) matches ``path`` or one of its ancestors."""
    pattern = pattern.strip("/")
    if "/" not in pattern:
        return any(fnmatchcase(segment, pattern) for segment in path)
    parts = pattern.split("/")
    return len(parts) <= len(path) and all(map(fnmatchcase, path, parts))


def is_match(patterns: list[str], path: tuple[str, ...]) -> bool:
    """Return True if the last pattern matching ``path`` is not a negation."""
    matched = False
    for pattern in patterns:
        negated = pattern.startswith("!")
        if _pattern_matches(pattern.removeprefix("!"), path):
            matched = not negated
    return matched


def glob_params(
    response: dict, generator: str, patterns: list[str], *, exclude: bool = True
) -> dict:
    """Return ``response`` with parameters matching ``patterns`` removed, like .gitignore.

    With ``exclude=False``, keep only the matching parameters instead.

    Empty sections are dropped and ``count`` is recomputed.
    """
    data = {}
    for section, params in response["data"].items():
        kept = [p for p in params if is_match(patterns, (generator, section, p["name"])) != exclude]
        if kept:
            data[section] = kept
    return {**response, "count": sum(len(params) for params in data.values()), "data": data}
