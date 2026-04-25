# Course Concepts Crosswalk

This file summarizes how the final artifact connects to the course concepts used in the Phase 3 report.

| course concept | project interpretation | primary evidence |
|---|---|---|
| L4 bounded task specification | The system is scoped to non-clinical diet and workout planning under user constraints. It explicitly excludes diagnosis, medication, prescription, and treatment guidance. | `docs/final_report.md`; `outputs/sample_runs/P3-04_medicalBoundary.json` |
| L4 bounded autonomy | The workflow can normalize intake, check constraints, draft, review, and adapt, but it must stop for safety and route unresolved value tradeoffs to the human. | `outputs/sample_runs/P3-03_prioritization.json`; `outputs/sample_runs/P3-04_medicalBoundary.json` |
| L4 human checkpoints | Clarification, prioritization, acceptance, bounded revision, and post-acceptance feedback are modeled as explicit checkpoints. | `app/index.html`; `screenshots/07_state_and_transitions.png` |
| L5 memory design | The project uses session state as working memory for the current interaction and intentionally avoids persistent memory. | `src/engine.mjs`; `outputs/sample_runs/P3-06_adaptation.json` |
| L6 role-based cooperation | The system uses Intake, Constraint & Risk Checker, Plan Composer, Review & Adaptation Agent, and Human-in-the-Loop roles. | `docs/architecture_diagram.svg`; `outputs/sample_runs/P3-01_baseline.json` |
| L6 communication structure | Agents communicate through controller-routed handoff packets and shared session state rather than free-form negotiation. | `outputs/demo_outputs/end_to_end_trace_baseline.md`; `screenshots/07_state_and_transitions.png` |
| L6 centralized control tradeoff | The centralized controller improves auditability and safety enforcement while limiting open-ended autonomy. | `docs/final_report.md`; `src/engine.mjs` |
| L7 process-over-outcome evaluation | The evaluation checks protocol states, branch correctness, handoff visibility, safety behavior, and state preservation, not just pass/fail outcomes. | `eval/test_cases.csv`; `eval/evaluation_results.csv` |
| L7 observability | Each run exports traces, transitions, handoff ledger evidence, and reviewer-facing summaries. | `outputs/sample_runs/`; `outputs/demo_outputs/scenario_trace_index.md` |
| L7 failure diagnosis | Historical failures are logged with triggers, root causes, fixes, statuses, and regression evidence. | `eval/failure_log.md`; `eval/version_notes.md`; `outputs/extended_runs/` |
| L7 reliability / stability | Deterministic reruns are checked for the 7 core scenarios. | `outputs/exported_artifacts/stability_check.json` |

## Short Interpretation

The main course-aligned claim is that this is not a generic plan generator. It is a bounded, observable, role-coordinated workflow whose value comes from when it plans, when it pauses, when it stops, when it asks the human to decide, and how it preserves state across revision and adaptation.
