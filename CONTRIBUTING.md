## CommitLint
Check [here](https://commitlint.js.org/guides/local-setup) for a local setup guide. CommitLint will be enforced with Github Actions as well (soon :tm:).

## Decision Log
Date is technically date logged (as of now), but since decisions should be logged as they're made, it's not a huge difference most of the time.
| Decision | Category | Date | Reason |
| -------- | -------- | ---- | ------ |
| Decision Log | Docs | 09/21/26 | Keeping track of decisions (and assumptions) made will be worth the effort in the long run |
| GitHub | Tools, Git, Dev | 09/22/26 | Near-universal, perfect for open-source, plus gives access to GitHub Actions and Projects. Keeping all of that in one place should be very nice. |
| Vue.js | Tools, UI | 09/22/26 | Vue is well-supported, well-documented, and provides a chance to get more tools in our toolboxes. |
| FastAPI | Tools, Backend | 09/22/26 | Simple, Fast (at least, as fast as Python can really get), and some of the team knows it. Since the backend isn't super complex or bottlenecked, it seems a great fit. |
| Docker | Tools, Deployment | 09/22/26 | Industry-standard, and the preference of the project sponsor. |
| commitlint | Tools, Docs, Dev | 09/22/26 | Keeping the repository organized includes keeping commits informative and consistent, which commitlint is a valuable tool for. |
