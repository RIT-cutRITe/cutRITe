# borrowed from https://github.com/florianfesti/boxes.git with minimal changes

FROM python:3.12-slim AS builder

WORKDIR /app

# renamed the env to boxes_env so it's more obvious which environment comes from boxes.py
RUN python3 -m venv boxes_env
RUN /app/boxes_env/bin/pip install gunicorn

# ADD adds the remote repository (in its entirety) to the image, so this docker image runs fine without the surrounding code in this repo
# this was in the original Dockerfile but it's very helpful for us nonetheless
ADD https://github.com/florianfesti/boxes.git /app
RUN /app/boxes_env/bin/pip install .
RUN mv scripts/boxesserver scripts/boxesserver.py

# ---

FROM python:3.12-slim

RUN apt update && \
  apt install -y pstoedit --no-install-recommends && \
  apt clean

WORKDIR /app
COPY --from=builder /app /app

# this dockerfile doesn't expose any ports; the compose handles that.
# As such, you can't really use this Dockerfile on its own to test boxes.
# You can run just the 'boxes' service of the compose though, with `docker compose up --build 'boxes'`

CMD ["/app/boxes_env/bin/gunicorn",  "-b",  "[::]:8000", "-w", "4", "scripts.boxesserver"]
