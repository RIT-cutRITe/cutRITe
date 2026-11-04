# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Use the dev image to build and install dependencies.
FROM python AS builder

WORKDIR /app

RUN python3 -m venv /.venv
ENV PATH="/.venv/bin:$PATH"

# install uv
RUN pip install uv
# RUN curl -LsSf https://astral.sh/uv/install.sh | sh
# RUN source $HOME/.local/bin/env
RUN uv --version

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/uv to speed up subsequent builds.
# Leverage a bind mount to pyproject.toml to avoid having to copy them into
# this layer.
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync

# Use the minimal runtime image. It runs as nonroot by default.
FROM python

WORKDIR /app

COPY --from=builder /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Copy the source code into the container.
# it'd be pretty nice to copy on a subset, like say the src folder, but that didn't work when i tried it
COPY . .

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
# CMD ["uv", "--version"]
CMD ["uv", "run", "uvicorn", "src.app:app", "--host=0.0.0.0", "--port=8000"]
