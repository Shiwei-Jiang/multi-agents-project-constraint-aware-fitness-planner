---
output:
  pdf_document: default
  html_document: default
---
# Phase 3 Submission Packet

## Project Title

Constraint-Aware Fitness Planner

## Team Members

Shiwei Jiang

## Selected Track

Track B: Interactive artifact

## One-Paragraph Project Summary

Constraint-Aware Fitness Planner is a local browser artifact for non-clinical diet and workout planning under real-world constraints such as symptom-trigger histories, dietary restrictions, limited equipment, schedule limits, budget limits, and adherence challenges. The system is agentic because it coordinates structured intake, ambiguity handling, safety-boundary stopping, human prioritization, reviewer-led revision, explicit packet-level handoffs, and state-preserving adaptation through structured post-acceptance execution feedback. The final artifact now delivers a clearer reviewed user plan package with a profile-fit summary, sample meal pattern, grocery focus, session blueprint, expanded weekly schedule, rationale, warnings, next-step guidance, and a downloadable plan-summary export, while keeping the coordination trace and evidence layer visible for grading.

## Repository Or Project Link

Current review package for local inspection:

- Clean local repository folder: `final_repo_ready/team-project/`

GitHub repository:

- https://github.com/Shiwei-Jiang/multi-agents-project-constraint-aware-fitness-planner.git

## Video Link

- https://drive.google.com/file/d/1t9Of0rJVdyEZj3Q7Pm51GctNnXfZJSWq/view?usp=drive_link
- Local reference file: `media/demo_video_link.txt`

## Final Report

- Source: `docs/final_report.md`
- Exported PDF: `docs/final_report.pdf`
- Coverage: problem and user, architecture, implementation choices, evaluation methodology, results, failure analysis, governance, formal artifact schemas, lessons learned, and future improvements

## Architecture Diagram

- Primary Phase 3 architecture and workflow figure: `docs/phase3_architecture_workflow.png`
- Supporting/legacy architecture figures retained for continuity: `docs/architecture_diagram.svg`; `docs/architecture_diagram_compact.png`
- Shows: bounded agent roles, controller-managed branches, handoff packets, stop conditions, and human-in-the-loop checkpoints

## Screenshot Index

- Screenshot index file: `screenshots/screenshot_index.md`
- Coverage summary: landing screen, ambiguity checkpoint, boundary stop, human tradeoff branch, adaptation, uncertainty handling, state/history view, and evaluation/results view
- Screenshot set:
  - `screenshots/01_home.png`
  - `screenshots/02_clarification.png`
  - `screenshots/03_boundary_stop.png`
  - `screenshots/04_prioritization.png`
  - `screenshots/05_adaptation.png`
  - `screenshots/06_uncertainty.png`
  - `screenshots/07_state_and_transitions.png`
  - `screenshots/08_evaluation_outputs.png`

## Evaluation Summary

- Deterministic core scenarios: `7`
- Extended adversarial, regression, and persona cases: `7`
- Total evaluated cases: `14`
- Full passes: `14`
- Partial failures: `0`
- Failures: `0`
- Full-pass rate: `100%`
- Repeated-run stability: `7/7`

Interpretation note:

- The `14 / 14` result is intended as evidence of latest-version behavior within the project's bounded Phase 3 scope.
- It is based on internal scenario emulation, saved traces, deterministic reruns, and structured manual review rather than an external user study.
- Historical failures are still preserved in `eval/failure_log.md`, so the pass table should be read together with the failure-analysis and governance sections rather than as a universal robustness claim.

Primary files:

- `eval/test_cases.csv`
- `eval/evaluation_results.csv`
- `eval/failure_log.md`
- `eval/evaluation_scope_note.md`
- `eval/version_notes.md`
- `outputs/demo_outputs/evaluation_summary.md`
- `outputs/demo_outputs/scenario_trace_index.md`
- `outputs/demo_outputs/end_to_end_trace_baseline.md`
- `outputs/exported_artifacts/automatic_evaluation_snapshot.json`
- `outputs/exported_artifacts/stability_check.json`
- `outputs/exported_artifacts/extended_evaluation_snapshot.json`
- `docs/package_index.md`

## Submitted Files And Folders

- `README.md`
- `AI_USAGE.md`
- `platform_notes.md`
- `app/`
- `src/`
- `scripts/`
- `docs/`
- `screenshots/`
- `eval/`
- `outputs/`
- `data/`
- `media/`
- `presentation/`

## Notes For Final Submission Assembly

- The packet wording now avoids machine-specific filesystem paths and is ready to accept either a final GitHub URL or a compressed project-folder submission.
- The stakeholder wording in the report has been aligned with the Phase 1 feedback so the operational stakeholder is a trainer, coach, licensed dietitian, or referring provider rather than the evaluator.
- The final report now includes an explicit operational risk register and lightweight formal schemas for the main handoff artifacts and session state, which more directly addresses the Phase 2 feedback about governance structure and data clarity.
- The report PDF has been regenerated from the current Phase 3 source.
- The screenshot set has been regenerated after the latest `phase3-v1.6` artifact and evidence update.
- The evaluation exports have been regenerated from `node scripts/run_evaluation.mjs`.
- The final approved project video link is now recorded in `media/demo_video_link.txt`.
