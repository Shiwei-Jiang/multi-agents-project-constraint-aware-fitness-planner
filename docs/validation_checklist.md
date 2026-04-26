# Phase 3 Validation Checklist

This checklist maps the main Phase 3 rubric claims to concrete files in this clean final package. It is intended as a quick reviewer path, not a substitute for the final report.

## Required Package Structure

| Requirement | Evidence |
|---|---|
| README and run instructions | `README.md` |
| Platform or dependency notes | `platform_notes.md` |
| Final report source and PDF | `docs/final_report.md`; `docs/final_report.pdf` |
| Course-concept interpretation | `docs/course_concepts_crosswalk.md` |
| Architecture diagram | Primary Phase 3 diagram: `docs/phase3_architecture_workflow.png`; supporting/legacy diagram files: `docs/architecture_diagram.svg`; `docs/architecture_diagram_compact.png` |
| Screenshots and screenshot index | `screenshots/`; `screenshots/screenshot_index.md` |
| Evaluation package | `eval/test_cases.csv`; `eval/evaluation_results.csv`; `eval/failure_log.md`; `eval/version_notes.md`; `eval/evaluation_scope_note.md` |
| Outputs and exported artifacts | `outputs/sample_runs/`; `outputs/extended_runs/`; `outputs/demo_outputs/`; `outputs/exported_artifacts/` |
| AI usage disclosure | `AI_USAGE.md` |
| Presentation materials | `presentation/FINAL_DECK.pptx`; `presentation/VIDEO_PRESENTATION.pptx`; `media/demo_video_link.txt` |
| Phase archives | `phase_submissions/phase1/`; `phase_submissions/phase2/`; `phase_submissions/phase3/` |

## Rubric Evidence Map

| Rubric category | Main evidence | What to verify |
|---|---|---|
| Final artifact quality and completeness | `app/index.html`; `app/app.js`; `app/engine.js`; `src/engine.mjs`; `screenshots/01_home.png` | The browser artifact runs locally, loads scenarios, shows intake, trace, reviewed output, state, allowed actions, and plan export controls. |
| Agentic behavior or coordination | `outputs/sample_runs/P3-01_baseline.json`; `outputs/demo_outputs/end_to_end_trace_baseline.md`; `screenshots/07_state_and_transitions.png` | Trace entries show actor, authority, decision, reasoning, rejected alternative, handoff target, transitions, and handoff ledger packets. |
| Evaluation quality and results | `eval/test_cases.csv`; `eval/evaluation_results.csv`; `outputs/exported_artifacts/stability_check.json`; `outputs/exported_artifacts/extended_evaluation_snapshot.json` | There are 14 cases with expected vs actual behavior, cited evidence, repeated-run stability, adversarial checks, regression checks, and persona variation. |
| Failure analysis and iteration | `eval/failure_log.md`; `eval/version_notes.md`; `outputs/extended_runs/P3-R01_grounding_regression.json`; `outputs/extended_runs/P3-R02_rewrite_visibility_regression.json` | Historical failures include trigger, root cause, fix, status, and current evidence or regression checks. |
| Governance, trust, and responsible behavior | `outputs/sample_runs/P3-04_medicalBoundary.json`; `outputs/extended_runs/P3-X02_boundary_evasion.json`; `outputs/sample_runs/P3-02_clarification.json`; `outputs/sample_runs/P3-03_prioritization.json` | The workflow stops at non-clinical boundaries, pauses for ambiguity, and routes value-laden tradeoffs to the human. |
| Documentation and reproducibility | `README.md`; `docs/package_index.md`; `platform_notes.md`; `scripts/run_evaluation.mjs`; `outputs/demo_outputs/scenario_trace_index.md` | A reviewer can run the local artifact, regenerate evidence with Node, and locate every main output quickly. |

## Reproducibility Checks

Run from the repository root:

```bash
node scripts/run_evaluation.mjs
```

Expected result:

- `outputs/sample_runs/` contains 7 primary scenario traces.
- `outputs/extended_runs/` contains 7 extended traces.
- `outputs/exported_artifacts/stability_check.json` reports 7 repeated-run stability checks.
- `eval/test_cases.csv` and `eval/evaluation_results.csv` contain the same 14 case IDs.

## Known Pending Submission Items

Completed submission links:

- GitHub repository URL is listed in `phase_submissions/phase3/submission_packet_source.md`
- 5-minute project video URL is listed in `media/demo_video_link.txt`
