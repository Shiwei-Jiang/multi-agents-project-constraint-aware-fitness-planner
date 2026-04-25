# Evaluation Scope Note

## What This Evaluation Is

The Phase 3 evidence package is based on:

- reproducible scenario runs from `node scripts/run_evaluation.mjs`
- structured internal observation while interacting with the browser artifact
- saved traces, screenshots, regression checks, and failure logging

This evaluation is intentionally designed as structured, reproducible, interaction-based scenario testing so coordination behavior, branching logic, and failure cases remain observable and comparable across runs.

Each case is written from a realistic user-perspective interaction situation, such as ambiguity, missing information, conflicting goals, or boundary-seeking requests, rather than as a purely synthetic input list.

## What This Evaluation Is Not

This package does **not** claim:

- a formal external user study
- independent third-party reviewer notes
- live deployment evidence from a production environment

## Why This Distinction Matters

Scenario-based user emulation is still useful for Track B because it stress-tests branch behavior, safety boundaries, revision loops, and state preservation. But it should be described honestly as internal scenario evaluation, not as equivalent to outside observational testing.

## How The Repo Separates Current Evidence From History

- `eval/evaluation_results.csv` records the current-version formal evidence table.
- `eval/failure_log.md` records historically observed failures, including issues found in older versions that were later fixed.
- `eval/version_notes.md` explains which changes moved an issue from historical failure into current regression evidence.
