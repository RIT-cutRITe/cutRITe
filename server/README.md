# Server Setup

Docker setup done by following [this guide](https://docs.docker.com/guides/python/), except that guide uses enterprise-only base images, so those were swapped out for the "standard" python base image (alpine, I think? But it's just called "python" in the dockerfiles).

## For Local Development:

**Local Setup:**
- Run `python3 -m venv /venv` to set up a virtual environment. Might be `python` instead of `python3` on Windows.
- On Linux, Run `source venv/bin/activate`; on Windows, Run `venv\Scripts\activate`. Now, your terminal will use the python, pip, etc. in the venv.
    - If that fails, make sure the activate script has execution permissions and try again.
- Run `pip install -r requirements.txt` to install necessary packages in the virtual environment. If requirements.txt changes, you'll probably need to do this step again.
    - (requirements.txt isn't exactly a robust way to handle dependencies; something like a pyproject.toml would be better, but also takes more work to set up I think. requirements.txt is fine for this initial setup, and changing the docker images to handle something more robust isn't terribly hard).
- VSCode might not recognise the venv right away. You can manually set the python environment it uses (for code highlighting and whatnot) in the bottom status bar by clicking the button between the Copilot and Notifications button, which is called whatever python enviorment its using right now. You may need to browse for the Python in the venv (`venv/bin/python`), but once you do, the imports/etc. will highlight as normal.
- Do your development. The rest of the sections assume you're in the virtual enviorment terminal.
    - It seems that VSCode might notice and automatically activate the venv if you open a project with one? Or maybe only if you had activated it once before? Or if you had closed it while it was activated? In any case, that's pretty cool if true, but I can't speak for how your VSCode (or other IDE) handles things. Clearly, I can't even really speak for how *my* VSCode handles things.
- When you're done, Run `deactivate` to exit the virtual environment terminal.

**To run just the FastAPI python script locally:**
- Run `uvicorn app:app --reload`.
- Ctrl+C to close it out.

**To run the docker image locally:**
- Make sure you have the docker daemon running (usually by opening Docker Desktop, though you can do it from the command line if you'd rather).
- Run `docker compose up --build` from the root directory (cutRITe, not cutRITe/server). Technically, this doesn't require you to be in the virtual envioronment terminal, since all the python stuff happens in a docker image anyways. It'll work fine either way.
    - To run only the FastAPI server, run `docker compose up --build 'server'`. To run just the boxes server, run `docker compose up --build 'boxes'`.
- Open your browser to `localhost:8000` to see the server output directly. Open your browser to `localhost:4455` to see the boxes server directly.
- When you're done, Ctrl+C in the terminal to close it. This does destroy the container. You could consider running the compose command with `-d` (for "detached") before the `--build` to use your terminal while it's running. Then, you'd stop the container with Docker Desktop or by searching for its ID in the terminal and killing it that way.
- Doing this all once makes an image in Docker Desktop, which could be used to run all of this from Docker Desktop, except that didn't work when I tried it with default settings. Not sure why :/
    - To clarify, the container did *run*, but I couldn't connect to the server from a browser to see it's output. That does work when I run it from the command line, so it's not that the image is bad. If you figure out what the deal with that is, and how to make it work, update this README please!

**When you make changes:**
- Verify that the docker image still runs (and works)
- If you added, removed, or changed any imports, reflect those changes in requirements.txt

## For Production:

Coming soon!
