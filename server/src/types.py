"""A file that contains pydantic classes for API return types."""
from pydantic import BaseModel, Field


class Generator(BaseModel):
    """."""
    link: str = Field(
        description="Relative URL of the generator",
        examples=["ABox"]
    )
    name: str = Field(
        description="Display name of the generator",
        examples=["ABox"]
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
    """."""
    name: str
    type: str
    default: str | bool
    description: str
    options: list[str] | None = None

class ParametersResponse(BaseModel):
    """."""
    status: str
    count: int
    data: dict[str, list[Parameter]]
