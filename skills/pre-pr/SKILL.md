---
name: pre-pr
description: This skill should be used when the user wants to prepare code for a pull request, run pre-PR checks, validate code quality, or ensure code is production-ready before merging. Trigger phrases include "pre pr", "before pr", "ready for pr", "prepare for merge", "run checks", "pre-commit checks", "lint and test", or "review before pr".
---

# Pre-PR Checks

## Purpose

Run a sequence of quality gates to ensure code is production-ready before raising a pull request. Covers logging, error handling, design fidelity (for frontend changes), formatting, linting, and tests.

## When to Use

- The user wants to prepare a branch for a pull request.
- The user asks to "run checks", "lint and test", "pre-commit", or anything about PR readiness.
- The user says "before PR" or "ready to merge".

## Gathering Inputs

Before starting, determine the following. Ask only if needed — infer from context when possible.

1. **Base branch** — Default: `main`. Ask only if the repo doesn't have a `main` branch: _"What is the base branch to compare against?"_
2. **Figma URL** (only if frontend changes are detected) — Ask: _"There are frontend changes. Do you have a Figma URL to compare against? (or skip design QA)"_
3. **Frontend URL** (only if design QA runs) — Default: `http://localhost:5173`. Ask only if the user hasn't mentioned it.
4. **Test command** — Auto-detect from `pyproject.toml`, `package.json`, or `Makefile`. Ask only if none can be found: _"What command runs your tests?"_

## Workflow

Execute all four steps in order. Each step reports its results before moving to the next.

### Step 1: Logging & Error Handling Review

Identify changed files relative to the base branch:

```bash
git diff --name-only main...HEAD
```

If no commits exist on the branch yet, fall back to:

```bash
git diff --name-only --cached
```

For each changed source file (`.py`, `.ts`, `.tsx`, `.js`, `.jsx`), read it and review against the guidelines in `references/logging-guidelines.md`.

Checklist:

- Module-level logger used instead of bare `print()` statements.
- Log messages include context (function name, relevant IDs).
- Critical paths (auth, payments, data mutations) log at appropriate levels.
- External calls (DB, HTTP, file I/O) wrapped in try/except or try/catch.
- Exceptions logged (with `logger.exception()` where applicable) and not silently swallowed.
- API endpoints return structured error responses — no stack trace leaks.
- Sensitive data (passwords, tokens, PII) never logged.

Apply fixes directly. Keep changes minimal — only add logging and error handling where clearly missing. Do not refactor surrounding code.

After completing fixes, summarize what was changed and proceed.

### Step 2: Design QA (Frontend Changes Only)

Determine if any changed files are frontend-related:

- Directories: `frontend/`, `src/components/`, `src/pages/`, `src/views/`, `client/`, `app/`
- Extensions: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.css`, `.scss`, `.html`

**If no frontend changes**: Print "No frontend changes detected — skipping Design QA." and proceed to Step 3.

**If frontend changes exist**:

1. Ask the user for the Figma URL if not already provided. If the user says "skip", proceed to Step 3.
2. Invoke the `/design-qa` skill, passing the Figma URL and frontend URL. Let it run its full workflow and produce a report.
3. **Do NOT make code changes** in this step — design QA is review-only.

After the report:

- **No mismatches**: Inform the user and proceed to Step 3.
- **Mismatches found**: Present the summary and ask: _"Design mismatches were found. Would you like to proceed to linting/tests, or fix the mismatches first?"_
  - Fix → Stop the workflow here.
  - Proceed → Continue to Step 3.

### Step 3: Formatting & Lint Checks

Run formatters and linters:

```bash
# Format with black
black .

# Format with ruff
ruff format .

# Lint with ruff, auto-fix safe issues
ruff check --fix .
```

Check for remaining errors:

```bash
ruff check .
```

- **No errors**: Stage formatting changes (`git add -u`) and proceed to Step 4.
- **Errors remain**: Display them, fix manually, re-run `ruff check .` to confirm, then stage and proceed.

### Step 4: Run Tests

Run the project test suite. Auto-detect the test command:

- If `pyproject.toml` or `pytest.ini` exists → `pytest --tb=short -q`
- If `package.json` has a `test` script → `npm test`
- If `Makefile` has a `test` target → `make test`
- Otherwise, ask the user.

Present results:

- **All pass**: Inform the user that all pre-PR checks are complete and the branch is ready.
- **Failures**: Show the failure summary and ask: _"Some tests failed. Would you like to fix them, or proceed with the PR anyway?"_
