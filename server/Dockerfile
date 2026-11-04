# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# that whole "builder" situation didn't play nice with uv, so now everything builds in one step
# since we're not using the pip caching thing or a hardended image anyways this is probably better

# Use the minimal runtime image. It runs as nonroot by default.
FROM python

WORKDIR /app

RUN python3 -m venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Copy the source code into the container.
COPY src/*.py src/

# install uv
RUN pip install uv

# the bind mounts here means we don't need to copy the full pyproject or lockfile to run uv sync
# it'll just use the ones in the repo as-is, which should be way faster especially for the uv.lock
RUN --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD ["uv", "run", "uvicorn", "src.app:app", "--host=0.0.0.0", "--port=8000"]
