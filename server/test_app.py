import app
import pytest
import asyncio

@pytest.mark.asyncio
async def test_blank():
    result = await app.root()
    assert type(result) is dict
    assert "message" in result
    assert result["message"] == "Hello, World!"

def test_failure():
    assert 1==2
