# Server Setup

Docker setup done by following [this guide](https://docs.docker.com/guides/python/), except that guide uses enterprise-only base images, so those were swapped out for the "standard" python base image (alpine).

## For Local Development:

**Local Setup:**
- Run `python3 -m venv /venv` to set up a virtual environment. Might be `python` instead of `python3` on Windows.
- On Linux, Run `source venv/bin/activate`; on Windows, Run `venv\Scripts\activate`. Now, your terminal will use the python, pip, etc. in the venv (which is good for a handful of reasons).
    - Make sure the activate script has execution permissions.
- Run `pip install -r requirements.txt` to install necessary packages in the virtual environment. If requirements.txt changes, you'll probably need to do this step again.
- Do your development. The rest of these steps assume you're in the virtual enviorment terminal.
- When you're done, Run `deactivate` to exit the virtual environment terminal.

**To run just the python script locally:**
- Run `uvicorn app:app --reload`
- Ctrl+C to close it out.

**To run the docker image locally:**
- Make sure you have the docker daemon running (usually by opening Docker Desktop, though you can do it from the command line if you'd rather).
- Run `docker compose up --build` from this directory (cutRITe/server).
- Open your browser to `localhost:8000` to see the server output directly.
- When you're done, Ctrl+C in the terminal to close it. This does destroy the container. You could consider running the compose command with `-d` (for "detached") before the `--build` to use your terminal while it's running. Then, you'd stop the container with Docker Desktop for by searching for its ID in the terminal and killing it that way.
- Doing this all once makes an image in Docker Desktop, which could be used to run all of this from Docker Desktop, except that didn't work when I tried it with default settings. I think something went sideways with exposing the port?

**When you make changes:**
- Verify that the docker image still runs (and works)
- If you added, removed, or changed any imports, reflect those changes in requirements.txt
- Don't forget your conventional commit message(s)!

## For Production:

Coming soon!
