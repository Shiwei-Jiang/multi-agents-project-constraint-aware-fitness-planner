# Saved Scenario Outputs

Generated with `node scripts/run_evaluation.mjs` against workflow engine version `phase3-v1.6`.

This file is meant to function as a **Track B evidence index**: each row links one workflow branch to the exported evidence that a reviewer can inspect quickly.

| case_id | scenario | branch_type | final_protocol_state | why_it_matters_for_track_b | screenshot |
|---|---|---|---|---|---|
| P3-01 | baseline | happy path + acceptance | completed | Shows the full Track B interaction loop with visible handoffs, reviewed output, and completion. | screenshots/01_home.png |
| P3-02 | clarification | clarification stop | awaiting_clarification | Shows that the system pauses and asks for more information instead of guessing under ambiguity, then can resume after clarification. | screenshots/02_clarification.png |
| P3-03 | prioritization | human escalation | awaiting_prioritization | Shows a visible human-in-the-loop checkpoint for unresolved tradeoffs, then can resume after the user revises priorities. | screenshots/04_prioritization.png |
| P3-04 | medicalBoundary | safety boundary | stopped_boundary | Shows bounded autonomy through a visible non-clinical stop condition. | screenshots/03_boundary_stop.png |
| P3-05 | uncertainty | missing-info uncertainty | awaiting_clarification | Shows refusal to overclaim confidence when key planning fields are still missing. | screenshots/06_uncertainty.png |
| P3-06 | adaptation | demonstrated adaptation | awaiting_user_acceptance | Shows state-preserving revision after an accepted plan is reopened by structured post-acceptance execution feedback. | screenshots/05_adaptation.png |
| P3-07 | revision | bounded user revision | completed | Shows one more visible human decision before final acceptance rather than immediate completion. | screenshots/07_state_and_transitions.png |

Each row has a corresponding JSON artifact in `outputs/sample_runs/`.

Additional continuation evidence:

- `outputs/exported_artifacts/clarification_resume_demo.json` shows a paused clarification session resumed with updated intake.
- `outputs/exported_artifacts/prioritization_resume_demo.json` shows a paused prioritization session resumed after the user revises the intake.
- `outputs/demo_outputs/end_to_end_trace_baseline.md` walks one full baseline run step by step with agent authority and transition authorization visible.
- `outputs/exported_artifacts/extended_evaluation_snapshot.json` links the adversarial and persona-variation cases that go beyond the deterministic core suite.

Recommended reviewer path: `baseline` -> `medicalBoundary` -> `prioritization` -> `revision` or `adaptation`.
