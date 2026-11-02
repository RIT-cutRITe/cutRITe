"""Pydantic models for API response types."""

from pydantic import BaseModel, Field


class Generator(BaseModel):
    """A Boxes.py generator listed on the menu page."""
    link: str = Field(
        description="Relative URL of the generator",
        examples=["ABox"]
    )
    name: str = Field(
        description="Display name of the generator",
        examples=["ABox"]
    )
    type: str = Field(
        description="Menu category the generator belongs to",
        examples=["Boxes"]
    )
    image: str | None = Field(
        default=None,
        description="Optional image URL"
    )
    title: str | None = Field(
        default=None,
        description="Additional generator description"
    )

class Parameter(BaseModel):
    """A single input field of a generator."""
    name: str
    type: str
    default: str | bool
    description: str
    options: list[str] | None = None

class ParametersResponse(BaseModel):
    """Response of ``/getAllParams``: parameters grouped by section heading."""
    status: str
    count: int
    data: dict[str, list[Parameter]]
