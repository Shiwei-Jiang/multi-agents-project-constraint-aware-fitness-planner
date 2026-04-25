# Platform Notes

## Runtime

- Browser: any modern local browser that can open a static HTML file
- Node.js: used only for reproducible evaluation export
- Verified locally with `node v23.3.0`
- Verified locally with `python 3.10.6` available, although Python is not required for the final artifact

## External Services

- No network calls
- No hosted backend
- No external model API
- No package installation required for the included workflow

## Reproducibility Notes

- The browser artifact is fully local.
- The evaluation runner is deterministic because it calls the same local workflow engine used by the browser UI.
- The exported stability snapshot verifies repeated-run consistency for the saved scenario suite.
- Saved outputs can be regenerated with:

```bash
node scripts/run_evaluation.mjs
```

## Operating Constraints

- The current package was assembled and tested in a local filesystem with spaces in the path.
- A Phase 3 bug in the evaluation runner related to space-containing paths was found and fixed; see `eval/failure_log.md`.
