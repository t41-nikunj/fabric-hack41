# Logging & Error Handling Guidelines

## Python Logging Standards

### Logger Setup

Every module should use a module-level logger:

```python
import logging

logger = logging.getLogger(__name__)
```

Do NOT use bare `print()` statements for production logging. `print()` is acceptable only in CLI scripts or one-off utilities.

### Log Levels

| Level      | When to Use                                                        |
| ---------- | ------------------------------------------------------------------ |
| `DEBUG`    | Verbose diagnostic info (variable values, loop iterations)         |
| `INFO`     | Normal operational events (request received, task completed)       |
| `WARNING`  | Recoverable issues (retry attempted, fallback used, deprecation)   |
| `ERROR`    | Failures that affect a single operation but not the whole service   |
| `CRITICAL` | System-wide failures (DB down, config missing, service cannot start) |

### Log Message Format

Include context in every log message:

```python
# Good
logger.info("Order created", extra={"order_id": order_id, "user_id": user_id})
logger.error("Payment failed for order %s: %s", order_id, str(e))

# Bad
logger.info("Done")
logger.error("Something went wrong")
```

### Sensitive Data

Never log passwords, tokens, API keys, credit card numbers, or PII. Mask or omit them:

```python
logger.info("User authenticated: user_id=%s", user_id)  # Good
logger.info("User authenticated: password=%s", password)  # Bad
```

## Error Handling Standards

### External Calls

All external calls (database, HTTP, file I/O, third-party APIs) must be wrapped:

```python
# Python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.RequestException as e:
    logger.error("Failed to fetch %s: %s", url, e)
    raise
```

```javascript
// JavaScript/TypeScript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  logger.error(`Failed to fetch ${url}:`, error);
  throw error;
}
```

### Rules

1. **Never silently swallow exceptions** — always log or re-raise.
2. **Catch specific exceptions** — avoid bare `except:` or `except Exception`.
3. **API endpoints must return proper error responses** — use HTTP status codes and a structured error body. Never leak stack traces to clients.
4. **Use `logger.exception()` in except blocks** — it automatically includes the traceback.
5. **Add timeout to all external calls** — never make unbounded network requests.