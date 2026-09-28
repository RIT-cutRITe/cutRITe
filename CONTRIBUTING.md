## Signing Keys
The repository requires commits be signed, set up a GPG or SSH key for signing.

[GitHub docs about signing keys](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)

## CommitLint
Check [this other repository](https://github.com/conventionalcommit/commitlint) for releases and local setup instructions, but basically:
1. Download a release binary for your system
2. Extract the release, and put the `commitlint` binary file on your PATH
3. run `commitlint init` from the root folder of this repository. This will create a `.commitlint` folder in the repository, which is gitignored (on purpose). In that folder, you'll find `hooks/commit-msg`, a bash script which handles the local commit linting.
4. Now, whenever you commit to this repository, commitlint will check the message to make sure it follows conventional commit standards. If the message does not, the commit will not apply.

A proper conventional commit is of the form `type(scope?): subject`, where
- type is one of `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`, which describes generally what kind of commit this is
- scope is optional (omit the parentheses if you omit scope), and describes where the changes live. This isn't checked against file structure or anything, so "GitHub Actions" would be an acceptable scope despite not being a path in the repository. Scope is just about communicating where to find your changes to your fellow engineers.
- subject is the description of the changes made. There is a character limit to this, to encourage keeping commit messages concise. If you're used to not using conventional commits, subject is where the "usual" commit message goes.

## Decision Log
Date is technically date logged (as of now), but since decisions should be logged as they're made, it's not a huge difference most of the time.
| Decision | Category | Date | Reason |
| -------- | -------- | ---- | ------ |
| Decision Log | Docs | 09/21/26 | Keeping track of decisions (and assumptions) made will be worth the effort in the long run |
| Acceptable Timing <3s, most of the time should be <1s | Requirements | 09/24/26 | Need to have times to build architecture against. Sponsor approved before decision log was made |
| GitHub | Tools, Git, Dev | 09/22/26 | Near-universal, perfect for open-source, plus gives access to GitHub Actions and Projects. Keeping all of that in one place should be very nice. |
| Vue.js | Tools, UI | 09/22/26 | Vue is well-supported, well-documented, and provides a chance to get more tools in our toolboxes. |
| FastAPI | Tools, Backend | 09/22/26 | Simple, Fast (at least, as fast as Python can really get), and some of the team knows it. Since the backend isn't super complex or bottlenecked, it seems a great fit. |
| Docker | Tools, Deployment | 09/22/26 | Industry-standard, and the preference of the project sponsor. |
| commitlint | Tools, Docs, Dev | 09/22/26 | Keeping the repository organized includes keeping commits informative and consistent, which commitlint is a valuable tool for. |
