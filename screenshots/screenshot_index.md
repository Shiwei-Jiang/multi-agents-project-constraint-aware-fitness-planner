---
output:
  pdf_document: default
  html_document: default
---
# Screenshot Index

The package now uses **8 primary screenshots** so each screen-based requirement is covered explicitly instead of being implied by one broad home-screen capture. The last two images were added to make the **state/history** slot and the **evaluation/results** slot easier for a reviewer to verify at a glance.

| screenshot_file | requirement_slot | what_it_shows | why_it_matters | where_it_is_discussed_in_the_report |
|---|---|---|---|---|
| `screenshots/01_home.png` | home or landing screen | Baseline workflow with optional body-context intake, the expanded reviewed user plan package, workflow trace, visible state, handoff ledger, and plan-summary export control | Shows the core happy-path artifact, including the stronger user-facing plan output, packet-level coordination evidence, and the more mature deliverable framing of the current Phase 3 artifact | Final Artifact Summary; Evaluation Results |
| `screenshots/02_clarification.png` | ambiguity / clarification branch | Clarification branch triggered by ambiguous trigger history, with the active workflow paused for missing symptom-trigger detail while the live preview also shows that the current draft would cross the safety boundary if the user kept the same wording | Shows that the system does not guess when key information is missing or vague, and also makes visible that updated evidence can still change the downstream branch after clarification | Coordination Logic and Workflow; Evaluation Results |
| `screenshots/03_boundary_stop.png` | failure or boundary case | Safety boundary stop triggered by diagnosis, prescription, or treatment-seeking language | Shows governance, bounded autonomy, and visible stopping behavior | Governance, Safety, Trust, and Scope Boundaries; Failure Analysis |
| `screenshots/04_prioritization.png` | branching logic / human intervention | Human prioritization branch for an infeasible goal-resource combination | Shows that hard tradeoffs are routed back to the human rather than guessed automatically | Coordination Logic and Workflow; Evaluation Results |
| `screenshots/05_adaptation.png` | artifact or output screen | Adaptation after an accepted plan is reopened by structured post-execution feedback, showing the revised reviewed plan package | Shows state-preserving revision in the demonstrated adaptation loop and makes the post-acceptance timing visible | Evaluation Results; Failure Analysis |
| `screenshots/06_uncertainty.png` | evidence of bounded confidence | Missing-field uncertainty handling when the user still demands a plan | Shows explicit disclosure of missing information and refusal to overclaim confidence | Evaluation Results; Governance, Safety, Trust, and Scope Boundaries |
| `screenshots/07_state_and_transitions.png` | state or history view | Revision scenario with the allowed-next-actions panel, authorized transition history, handoff ledger, and the longer `Review -> Plan Composer -> Review` evidence visible | Gives the reviewer a dedicated state/history image rather than asking them to infer coordination and state from the broader home screen | Final Artifact Summary; Architecture and Role or Component Design |
| `screenshots/08_evaluation_outputs.png` | evaluation or results screen | Reviewer-facing evaluation evidence page summarizing `14 / 14` current-version passes, regression checks, stability results, scope-note visibility, and exported evidence files | Makes the evaluation/results layer visible in the screenshot set and shows that the project produced inspectable outputs beyond the interactive workflow itself | Evaluation Methodology; Evaluation Results |

## Why `08_evaluation_outputs.png` exists

This screenshot is the **dedicated evaluation/results visual** for a screen-based submission.

Its purpose is not to show another workflow branch. Its purpose is to show, in one frame, that:

- the project ran a scenario suite
- results were summarized clearly
- exported evidence files exist
- the evidence layer is inspectable by a reviewer

Without this image, the screenshot set leans heavily toward workflow UI and boundary cases, but it is weaker on the assignment’s separate expectation for an **evaluation/results screen**.

## Capture Notes

- All 8 screenshots were refreshed after the latest `phase3-v1.6` refinement pass so the visuals match the current artifact, evaluation tables, regression checks, and governance evidence.
- `07_state_and_transitions.png` was captured from the current artifact with a scenario that produces a longer transition history.
- `08_evaluation_outputs.png` was captured from `docs/evaluation_evidence_view.html`, a lightweight reviewer-facing page that summarizes the already-generated evaluation outputs and evaluation-scope note without inventing new results.

### Notes on settings and controls coverage

Settings and controls are embedded within the main Intake and control panels 
(e.g., goal selection, constraints, scenario preset selector, workflow run controls, 
evidence view access, and export actions), rather than being implemented as a 
separate settings page.