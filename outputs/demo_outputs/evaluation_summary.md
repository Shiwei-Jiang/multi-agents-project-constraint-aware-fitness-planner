# Evaluation Summary

Generated with `node scripts/run_evaluation.mjs` against workflow engine version `phase3-v1.6`.

## Automatic coverage

- Completed scenarios exported: 7
- Repeated-run stability checks passed: 7/7
- Evidence snapshot: `outputs/exported_artifacts/automatic_evaluation_snapshot.json`
- Stability snapshot: `outputs/exported_artifacts/stability_check.json`
- Extended evaluation snapshot: `outputs/exported_artifacts/extended_evaluation_snapshot.json`

## Track B evidence highlights

- `baseline` shows the main interactive workflow with visible handoffs, reviewed output, and acceptance.
- `medicalBoundary` shows a safety stop instead of plan generation.
- `prioritization` shows a human escalation branch instead of silent tradeoff resolution.
- `outputs/exported_artifacts/clarification_resume_demo.json` and `outputs/exported_artifacts/prioritization_resume_demo.json` show that the paused workflow can now continue in the same session after human updates.
- `revision` shows one bounded user-requested revision before completion.
- `adaptation` shows state-preserving revision after an accepted plan is reopened by structured post-acceptance execution feedback.
- exported traces now include agent authority, decision, reasoning, rejected alternatives, confidence labels, and explicit handoff targets.

## Multi-dimensional checks reflected in the evaluation tables

- hard constraints preserved
- correct branch taken
- unsafe advice avoided
- human handoff shown when needed
- context preserved across revision or adaptation
- agent-level decision authority and handoff visibility

## Extended evaluation after refinement

- Adversarial cases added: 2
- Persona-variation cases added: 3
- Regression checks added: 2
- Adversarial full passes: 2
- Adversarial partial failures: 0
- Adversarial failures: 0
- Persona variation passes: 3/3
- Regression passes: 2/2
- Regression failures: 0
- The clarification checkpoint now surfaces stacked blockers jointly instead of revealing only one blocker at a time.
- The strengthened boundary detector now stops a treatment-seeking phrasing that previously slipped through the keyword list.
- Regression checks now keep two resolved failures visible in the evidence layer: plan grounding and the visible rewrite path.

## Why this matters

- The project now shows both outcome evidence and process evidence through saved traces.
- Repeated-run stability supports the lecture 7 emphasis on reliability and consistency measurement.
- The extended evaluation layer adds persona variation plus adversarial coordination and governance evidence instead of only self-confirming passes.
- The package now states explicitly that this evidence is internal scenario evaluation, not an external user study.
- Failure analysis remains separate and is documented in `eval/failure_log.md`.
