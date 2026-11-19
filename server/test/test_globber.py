"""Tests for the .gitignore-style parameter filter."""

from pathlib import Path

from src.globber import glob_params, load_patterns

RESPONSE = {
    "status": "success",
    "count": 4,
    "data": {
        "default_settings": [{"name": "file_type"}, {"name": "thickness"}],
        "Box": [{"name": "x"}, {"name": "thickness"}],
    },
}


def names(result: dict) -> dict:
    """Flatten a filtered response to ``{section: [param names]}``."""
    return {section: [p["name"] for p in params] for section, params in result["data"].items()}


def test_section_with_negation() -> None:
    """Matching a section takes all its params; ``!`` re-includes one."""
    result = glob_params(
        RESPONSE, "ABox", ["*/default_settings", "!*/default_settings/file_type"], exclude=False
    )
    assert names(result) == {"default_settings": ["thickness"]}
    assert result["count"] == 1
    assert result["status"] == "success"


def test_unanchored_pattern_matches_any_section() -> None:
    """A pattern without ``/`` matches that name at any level."""
    assert names(glob_params(RESPONSE, "ABox", ["thick*"], exclude=False)) == {
        "default_settings": ["thickness"],
        "Box": ["thickness"],
    }


def test_star_does_not_cross_slash() -> None:
    """``*`` matches one segment only, and patterns are anchored at the generator."""
    assert names(glob_params(RESPONSE, "ABox", ["*/x"], exclude=False)) == {}
    assert names(glob_params(RESPONSE, "ABox", ["Other/*/x"], exclude=False)) == {}
    assert names(glob_params(RESPONSE, "ABox", ["ABox/*/x"], exclude=False)) == {"Box": ["x"]}


def test_load_patterns_skips_comments(tmp_path: Path) -> None:
    """Blank lines and ``#`` comments are ignored."""
    file = tmp_path / "advanced_parameters"
    file.write_text("# comment\n\n*/default_settings\n  !*/default_settings/file_type  \n")
    assert load_patterns(file) == ["*/default_settings", "!*/default_settings/file_type"]


def test_default_excludes_matches() -> None:
    """By default, matching parameters are removed."""
    result = glob_params(RESPONSE, "ABox", ["*/default_settings"])
    assert names(result) == {"Box": ["x", "thickness"]}
    assert result["count"] == 2
