---
name: pre-pr
description: This skill MUST be invoked when a user wants to raise a pull request. It runs all quality gates (logging, design QA, linting, tests) and only allows PR creation when ALL checks pass. Trigger phrases include "raise pr", "create pr", "open pr", "submit pr", "merge", "ready to merge", or "push to main".
---

# Pre-PR Gated Workflow

## Purpose

**Gate the PR creation process** — run a comprehensive sequence of quality checks, and **only create the PR when ALL checks pass**. This skill prevents broken or non-compliant code from being merged.

## When to Use

- User wants to raise/create/open a pull request
- User says "submit PR", "merge", "ready to merge"
- User wants to push changes to main/master
- Any request involving PR creation triggers this skill **automatically**

> [!IMPORTANT]
> This skill is **mandatory** before any PR creation. PRs cannot be raised until all gates pass.

---

## Inputs

Collect these before starting. Infer from context when possible.

| Input | Default | When to Ask |
|-------|---------|-------------|
| **Base branch** | `main` | Only if repo has no `main` branch |
| **PR title** | Auto-generate from commits | If unclear from context |
| **PR description** | Auto-generate | If user wants specific content |
| **Figma URL** | — | Only if frontend changes detected |
| **Frontend URL** | `http://localhost:5173` | Only if design QA needed |

---

## Gated Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PR REQUEST INITIATED                      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  GATE 1: Code Quality Review                                 │
│  ├─ Logging standards                                        │
│  ├─ Error handling                                           │
│  └─ Security scan                                            │
│                                                              │
│  ❌ FAIL → Fix issues → Re-run Gate 1                        │
│  ✅ PASS → Continue                                          │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  GATE 2: Design QA (if frontend changes)                     │
│  ├─ Invoke /design-qa skill                                  │
│  ├─ Pixel comparison                                         │
│  └─ Token validation                                         │
│                                                              │
│  ❌ FAIL → Fix design issues → Re-run Gate 2                 │
│  ✅ PASS → Continue                                          │
│  ⏭️ SKIP → No frontend changes                               │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  GATE 3: Formatting & Linting                                │
│  ├─ Auto-format code                                         │
│  ├─ Lint checks                                              │
│  └─ Type checking (if applicable)                            │
│                                                              │
│  ❌ FAIL → Fix lint errors → Re-run Gate 3                   │
│  ✅ PASS → Continue                                          │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  GATE 4: Test Suite                                          │
│  ├─ Unit tests                                               │
│  ├─ Integration tests                                        │
│  └─ E2E tests (if configured)                                │
│                                                              │
│  ❌ FAIL → Fix failing tests → Re-run Gate 4                 │
│  ✅ PASS → Continue                                          │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  GATE 5: Final Validation                                    │
│  ├─ All gates passed?                                        │
│  ├─ No uncommitted changes?                                  │
│  └─ Branch up to date with base?                             │
│                                                              │
│  ❌ FAIL → Resolve issues                                    │
│  ✅ PASS → CREATE PR                                         │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    🎉 PR CREATED                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Gate 1: Code Quality Review

### 1.1 Identify Changed Files

```bash
# Get changed files vs base branch
git diff --name-only main...HEAD

# Fallback for uncommitted changes
git diff --name-only --cached
git diff --name-only
```

### 1.2 Check If Logging Is Set Up

First, determine if the project has logging infrastructure:

**For Python projects**, check for:
- `logging` import in files
- Logger configuration in `main.py`, `app.py`, or `__init__.py`
- `logging.conf` or logging setup in settings

**For JavaScript/TypeScript projects**, check for:
- Logger library (`winston`, `pino`, `bunyan`, `loglevel`)
- Logger configuration file
- Console wrapper utility

### 1.3 Set Up Logging Infrastructure (If Missing)

> [!IMPORTANT]
> If logging is NOT set up, create the logging infrastructure BEFORE proceeding.

#### Python Logging Setup

Create `backend/core/logging_config.py`:

```python
import logging
import sys
from typing import Optional

def setup_logging(level: str = "INFO", log_file: Optional[str] = None):
    """Configure application-wide logging."""
    
    # Create formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # File handler (optional)
    handlers = [console_handler]
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        handlers=handlers
    )
    
    # Reduce noise from third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.INFO)

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance for a module."""
    return logging.getLogger(name)
```

Initialize in `backend/main.py`:

```python
from backend.core.logging_config import setup_logging

# Call at application startup
setup_logging(level="INFO")
```

#### JavaScript/TypeScript Logging Setup

Create `frontend/src/utils/logger.ts`:

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info';

function formatLog(entry: LogEntry): string {
  const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
  return `${entry.timestamp} | ${entry.level.toUpperCase().padEnd(5)} | ${entry.module} | ${entry.message}${dataStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export function createLogger(module: string) {
  const log = (level: LogLevel, message: string, data?: Record<string, unknown>) => {
    if (!shouldLog(level)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
    };
    
    const formatted = formatLog(entry);
    
    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  };

  return {
    debug: (msg: string, data?: Record<string, unknown>) => log('debug', msg, data),
    info: (msg: string, data?: Record<string, unknown>) => log('info', msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => log('warn', msg, data),
    error: (msg: string, data?: Record<string, unknown>) => log('error', msg, data),
  };
}
```

### 1.4 Add Logs to Changed Files

For each changed source file, **add logging at these critical points**:

#### Where to Add Logs

| Location | Log Level | What to Log |
|----------|-----------|-------------|
| Function entry | `DEBUG` | Function name, key parameters |
| Function exit | `DEBUG` | Return value summary |
| API endpoints | `INFO` | Request method, path, user ID |
| Database operations | `INFO` | Query type, table, record count |
| External API calls | `INFO` | Service name, endpoint, response status |
| Authentication | `INFO` | Login attempts, token validation |
| Business logic decisions | `INFO` | Decision made, reason |
| Caught exceptions | `ERROR` | Exception type, message, context |
| Validation failures | `WARN` | What failed, input summary |

#### Python Example Transformation

**Before:**
```python
def create_user(user_data: dict):
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()
    return user
```

**After:**
```python
from backend.core.logging_config import get_logger

logger = get_logger(__name__)

def create_user(user_data: dict):
    logger.info("Creating new user", extra={"email": user_data.get("email")})
    try:
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        logger.info("User created successfully", extra={"user_id": user.id})
        return user
    except Exception as e:
        logger.exception("Failed to create user")
        raise
```

#### JavaScript Example Transformation

**Before:**
```typescript
async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

**After:**
```typescript
import { createLogger } from '@/utils/logger';

const logger = createLogger('UserService');

async function fetchUserData(userId: string) {
  logger.info('Fetching user data', { userId });
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      logger.error('Failed to fetch user', { userId, status: response.status });
      throw new Error(`HTTP ${response.status}`);
    }
    logger.debug('User data fetched successfully', { userId });
    return response.json();
  } catch (error) {
    logger.error('Error fetching user data', { userId, error: String(error) });
    throw error;
  }
}
```

### 1.5 Replace print() Statements

Find and replace all bare `print()` with appropriate logger calls:

```bash
# Find print statements in Python files
grep -rn "print(" --include="*.py" .
```

Replace each with the appropriate log level:
- Debugging output → `logger.debug()`
- Status messages → `logger.info()`
- Warnings → `logger.warn()`
- Errors → `logger.error()`

### 1.6 Error Handling Check

| Requirement | Action |
|-------------|--------|
| External calls wrapped | Add try/except around DB, HTTP, file I/O |
| Exceptions logged | Add `logger.exception()` in except blocks |
| No silent swallowing | Ensure all exceptions are logged before re-raising or handling |
| Structured API errors | Return proper error responses, never raw stack traces |

### 1.7 Security Scan

| Requirement | Check |
|-------------|-------|
| No hardcoded secrets | No API keys, passwords in code |
| No debug flags | `DEBUG=True` not in production code |
| Input validation | User inputs sanitized |

### Gate 1 Result

```
❌ FAIL: Issues found
   → Apply fixes automatically where possible
   → Re-run Gate 1 until all pass

✅ PASS: All code quality checks passed
   → Proceed to Gate 2
```

---

## Gate 2: Design QA

### 2.1 Detect Frontend Changes

Check if any changed files match:
- Directories: `frontend/`, `src/components/`, `src/pages/`, `client/`, `app/`
- Extensions: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.css`, `.scss`, `.html`

### 2.2 Execute Design QA

**If frontend changes detected:**

1. Request Figma URL from user (if not provided)
2. Invoke the `/design-qa` skill with full iteration loop
3. Wait for design QA to complete all iterations

**If NO frontend changes:**
```
⏭️ SKIP: No frontend changes — skipping Design QA
→ Proceed to Gate 3
```

### Gate 2 Result

```
❌ FAIL: Design mismatches remain after max iterations
   → Manual intervention required
   → Cannot proceed until design matches

✅ PASS: Design matches Figma (≤2% pixel diff, all tokens pass)
   → Proceed to Gate 3

⏭️ SKIP: No frontend changes
   → Proceed to Gate 3
```

---

## Gate 3: Formatting & Linting

### 3.1 Auto-Format Code

```bash
# Python formatting
black .
ruff format .

# JavaScript/TypeScript formatting (if applicable)
npx prettier --write "**/*.{js,jsx,ts,tsx,css,json}"
```

### 3.2 Lint Checks

```bash
# Python linting with auto-fix
ruff check --fix .

# Check for remaining errors
ruff check .

# TypeScript/JavaScript linting (if applicable)
npx eslint --fix .
npx eslint .
```

### 3.3 Type Checking (if applicable)

```bash
# Python type checking
mypy . --ignore-missing-imports

# TypeScript type checking
npx tsc --noEmit
```

### Gate 3 Result

```
❌ FAIL: Lint/type errors remain
   → Display errors
   → Fix issues (auto or manual)
   → Re-run Gate 3

✅ PASS: All formatting and lint checks passed
   → Stage changes: git add -u
   → Proceed to Gate 4
```

---

## Gate 4: Test Suite

### 4.1 Detect Test Command

Auto-detect from project configuration:

| Config File | Command |
|-------------|---------|
| `pyproject.toml` / `pytest.ini` | `pytest --tb=short -q` |
| `package.json` with `test` script | `npm test` |
| `Makefile` with `test` target | `make test` |
| None found | Ask user |

### 4.2 Run Tests

```bash
# Example for Python
pytest --tb=short -q --cov=. --cov-report=term-missing

# Example for Node.js
npm test -- --coverage
```

### 4.3 Coverage Check (optional)

If coverage is configured, ensure minimum threshold:
- Minimum coverage: 80% (configurable)
- New code coverage: 90%

### Gate 4 Result

```
❌ FAIL: Tests failed
   → Display failure summary
   → Fix failing tests
   → Re-run Gate 4
   → CANNOT PROCEED WITH PR

✅ PASS: All tests passed
   → Proceed to Gate 5
```

---

## Gate 5: Final Validation

### 5.1 Verify All Gates Passed

| Gate | Status |
|------|--------|
| Gate 1: Code Quality | ✅ |
| Gate 2: Design QA | ✅ or ⏭️ |
| Gate 3: Lint & Format | ✅ |
| Gate 4: Tests | ✅ |

### 5.2 Check Git State

```bash
# Ensure no uncommitted changes
git status --porcelain

# Ensure branch is up to date with base
git fetch origin main
git log HEAD..origin/main --oneline
```

### 5.3 Final Commit (if needed)

```bash
# Stage all changes from fixes
git add -A

# Commit with descriptive message
git commit -m "chore: pre-PR fixes (logging, formatting, lint)"
```

### Gate 5 Result

```
❌ FAIL: Not all gates passed
   → Return to first failing gate
   → Re-run from that point

❌ FAIL: Uncommitted changes or branch outdated
   → Commit changes
   → Rebase on base branch
   → Re-run Gate 5

✅ PASS: All validations complete
   → PROCEED TO PR CREATION
```

---

## PR Creation

**Only executed when ALL gates pass.**r

### Generate PR Content

```bash
# Get commit messages for PR description
git log main..HEAD --pretty=format:"- %s" --reverse
```

### Create PR

```bash
# Push branch
git push origin HEAD

# Create PR via GitHub CLI
gh pr create \
  --base main \
  --title "<generated or user-provided title>" \
  --body "<auto-generated description with changes summary>"
```

### PR Template

```markdown
## Summary
<Brief description of changes>

## Changes
<List of commit messages>

## Checklist
- [x] Code quality review passed
- [x] Design QA passed (or N/A)
- [x] Lint & format checks passed
- [x] All tests passing
- [x] No uncommitted changes

## Screenshots (if UI changes)
<Before/after screenshots from design QA>
```

---

## Summary

| Gate | What It Checks | Blocking? |
|------|----------------|-----------|
| **Gate 1** | Logging, error handling, security | ✅ Yes |
| **Gate 2** | Design fidelity (frontend only) | ✅ Yes |
| **Gate 3** | Formatting, linting, types | ✅ Yes |
| **Gate 4** | Unit/integration/E2E tests | ✅ Yes |
| **Gate 5** | Final validation, git state | ✅ Yes |

> [!CAUTION]
> **PRs CANNOT be created if any gate fails.** All issues must be resolved before proceeding.

---

## Retry Behavior

- Each gate can be re-run independently after fixes
- User can request to skip specific gates (with warning logged)
- Maximum retries per gate: 3 (then require manual intervention)
- If stuck, generate a report of all blocking issues for manual review
