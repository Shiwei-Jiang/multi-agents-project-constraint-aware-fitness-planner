---
title: "Constraint-Aware Fitness Planner Failure Log"
output:
  html_document: default
  pdf_document: default
---

# Failure Log

This log records concrete issues found during Phase 3 implementation and evaluation. It separates **fixed issues** from **remaining limitations**.

The file is intentionally historical: it includes problems found in older versions as well as the latest fixes. The current-version formal results live in `eval/evaluation_results.csv`; resolved issues appear there only if they were promoted into explicit regression checks.

---

## F-001

- **failure_id:** F-001  
- **date:** 2026-04-15  
- **version_tested:** phase2 prototype logic reviewed during Phase 3 refactor  
- **what_triggered_the_problem:** Targeted safety review of the older Phase 2 boundary detector  
- **what_happened:** The earlier browser logic only matched `diagnose`, `disease`, `medication`, and `medicine`, so wording like `prescription` or `dosage` could have slipped through  
- **severity:** high  
- **fix_attempted:** Expanded the detector in `src/engine.mjs` to include `diagnosis`, `prescription`, `drug`, `treatment`, `dose`, and `dosage`; added a saved medical-boundary scenario using `prescription` wording  
- **current_status:** fixed in `phase3-v1.0`  
- **evidence:** `phase_submissions/phase2/phase2_submission_source.md`; `src/engine.mjs`; `outputs/sample_runs/P3-04_medicalBoundary.json`  

---

## F-002

- **failure_id:** F-002  
- **date:** 2026-04-15  
- **version_tested:** phase3-v0.9  
- **what_triggered_the_problem:** First execution of `node scripts/run_evaluation.mjs` from a directory containing spaces  
- **what_happened:** The script used the URL pathname from `import.meta.url`, which preserved `%20` encodings and caused output-directory creation to fail  
- **severity:** medium  
- **fix_attempted:** Replaced pathname handling with `fileURLToPath(import.meta.url)` and reran the evaluation export  
- **current_status:** fixed in `phase3-v1.0`  
- **evidence:** `scripts/run_evaluation.mjs`; generated files in `outputs/sample_runs/` and `outputs/exported_artifacts/`  

---

## F-003

- **failure_id:** F-003  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.0  
- **what_triggered_the_problem:** Clarification scenario during final evaluation  
- **what_happened:** The workflow correctly stopped and asked a targeted follow-up question, but the browser artifact originally forced a full rerun instead of resuming the paused session  
- **severity:** medium  
- **fix_attempted:** Added `continueWorkflow` to the engine, surfaced a `Continue After Update` UI action, and exported `outputs/exported_artifacts/clarification_resume_demo.json` as concrete evidence of same-session continuation  
- **current_status:** fixed in `phase3-v1.0`  
- **evidence:** `outputs/sample_runs/P3-02_clarification.json`; `outputs/exported_artifacts/clarification_resume_demo.json`; `src/engine.mjs`; `app/app.js`  

---

## F-004

- **failure_id:** F-004  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.0  
- **what_triggered_the_problem:** Prioritization scenario during final evaluation  
- **what_happened:** The workflow correctly escalated the infeasible tradeoff to the human, but the browser artifact originally could not resume the paused session after the user revised priorities  
- **severity:** medium  
- **fix_attempted:** Reused `continueWorkflow` for `awaiting_prioritization`, exposed the continuation path in the UI, and exported `outputs/exported_artifacts/prioritization_resume_demo.json` as evidence of resumed planning and review  
- **current_status:** fixed in `phase3-v1.0`  
- **evidence:** `outputs/sample_runs/P3-03_prioritization.json`; `outputs/exported_artifacts/prioritization_resume_demo.json`; `src/engine.mjs`; `app/app.js`  

---

## F-005

- **failure_id:** F-005  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.0  
- **what_triggered_the_problem:** Adaptation path audit against the Phase 2 design  
- **what_happened:** The simulated adaptation path was previously available before the reviewed plan had been accepted, which made the timing look wrong relative to the intended post-execution feedback loop  
- **severity:** medium  
- **fix_attempted:** Gated adaptation so it only appears after `completed` with an accepted plan, updated the adaptation scenario to accept before reopening, and aligned documentation and evaluation claims with that behavior  
- **current_status:** fixed in `phase3-v1.0`  
- **evidence:** `src/engine.mjs`; `outputs/sample_runs/P3-06_adaptation.json`; `eval/evaluation_results.csv`; `docs/final_report.md`  

---

## F-006

- **failure_id:** F-006  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.0  
- **what_triggered_the_problem:** Artifact-quality review focused on Track B interaction realism  
- **what_happened:** The adaptation branch still depended on one fixed demo event, so the browser artifact looked like it was replaying a scripted branch rather than collecting real execution feedback from the user  
- **severity:** medium  
- **fix_attempted:** Added structured post-acceptance feedback input with category selection plus a free-text note, passed that input into the engine, and made the adaptation notes and change summary reflect the captured feedback  
- **current_status:** fixed in `phase3-v1.1`  
- **evidence:** `app/index.html`; `app/app.js`; `src/engine.mjs`; `outputs/sample_runs/P3-06_adaptation.json`  

---

## F-007

- **failure_id:** F-007  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.0  
- **what_triggered_the_problem:** Strict rubric-oriented review of paused workflow states  
- **what_happened:** The system could pause correctly, but the artifact still made some checkpoints feel opaque because the user had to infer what the workflow was waiting on and what changed across reviewed versions  
- **severity:** medium  
- **fix_attempted:** Added a current-checkpoint panel, visible human-resolution controls for tradeoff branches, trust-and-scope cues, and a version-to-version change view so paused states and iteration become easier to inspect directly in the artifact  
- **current_status:** fixed in `phase3-v1.1`  
- **evidence:** `app/index.html`; `app/app.js`; `app/styles.css`; `src/engine.mjs`  

---

## F-008

- **failure_id:** F-008  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.1  
- **what_triggered_the_problem:** Strict grading of agentic coordination evidence  
- **what_happened:** The workflow branches were real, but the trace still looked like a controller log rather than a set of agent decisions because it did not show who owned each decision, what alternative was rejected, or which output authorized the next state transition  
- **severity:** medium  
- **fix_attempted:** Added explicit trace metadata for authority, decision, reasoning, rejected alternatives, confidence, and handoff target; also added `authorizedBy` to transitions and exported an end-to-end trace walkthrough  
- **current_status:** fixed in `phase3-v1.2`  
- **evidence:** `src/engine.mjs`; `app/app.js`; `outputs/demo_outputs/end_to_end_trace_baseline.md`; `outputs/sample_runs/P3-01_baseline.json`  

---

## F-009

- **failure_id:** F-009  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.1  
- **what_triggered_the_problem:** Governance review of ambiguity, safety, and tradeoff handling  
- **what_happened:** The artifact showed what happened at clarification, prioritization, and boundary stops, but not clearly why that decision was chosen over alternative actions such as proceeding conservatively or asking for human prioritization first  
- **severity:** medium  
- **fix_attempted:** Added explicit reasoning, rejected alternatives, and confidence labels to governance-relevant trace entries so ambiguity, tradeoff escalation, and boundary stops now explain why the chosen branch was taken  
- **current_status:** fixed in `phase3-v1.2`  
- **evidence:** `src/engine.mjs`; `outputs/sample_runs/P3-02_clarification.json`; `outputs/sample_runs/P3-03_prioritization.json`; `outputs/sample_runs/P3-04_medicalBoundary.json`  

---

## F-010

- **failure_id:** F-010  
- **date:** 2026-04-16  
- **version_tested:** phase3-v1.1  
- **what_triggered_the_problem:** Evaluation audit for over-clean self-verification  
- **what_happened:** The evidence package showed only internally designed full-pass cases, which made the system look over-verified and hid important remaining weaknesses  
- **severity:** medium  
- **fix_attempted:** Added adversarial and persona-variation exports so historically weak behaviors became formal evidence instead of disappearing into prose; later versions converted the remaining adversarial gaps into documented passes while preserving the underlying failure history in this log and in regression evidence  
- **current_status:** fixed in `phase3-v1.3`  
- **evidence:** `scripts/run_evaluation.mjs`; `outputs/exported_artifacts/extended_evaluation_snapshot.json`; `outputs/extended_runs/`; `eval/evaluation_results.csv`  

---

## F-011

- **failure_id:** F-011  
- **date:** 2026-04-17  
- **version_tested:** phase3-v1.2  
- **what_triggered_the_problem:** Strict audit of persona-variation outputs against the rubric  
- **what_happened:** Two persona exports still leaked template language, so the saved plans did not fully respect the actual equipment, dietary, or budget profile shown in the intake  
- **severity:** high  
- **fix_attempted:** Reworked plan generation so nutrition, workout wording, and weekly structure are conditioned on actual intake constraints; regenerated persona outputs and re-graded the evaluation table  
- **current_status:** fixed in `phase3-v1.3`  
- **evidence:** `src/engine.mjs`; `app/engine.js`; `outputs/extended_runs/P3-U02_persona_committed_gym_builder.json`; `outputs/extended_runs/P3-U03_persona_cautious_recomp.json`; `eval/evaluation_results.csv`  

---

## F-012

- **failure_id:** F-012  
- **date:** 2026-04-17  
- **version_tested:** phase3-v1.2  
- **what_triggered_the_problem:** Adversarial governance review of treatment-seeking phrasing  
- **what_happened:** A query about recurring hives and what to take before workouts could evade the literal boundary keyword list and continue when it should have stopped  
- **severity:** high  
- **fix_attempted:** Replaced the direct-match detector with an intent-aware governance check that combines treatment-seeking patterns with symptom or recurrence language; regenerated the adversarial evidence and re-graded the case as a pass  
- **current_status:** fixed in `phase3-v1.3`  
- **evidence:** `src/engine.mjs`; `app/engine.js`; `outputs/extended_runs/P3-X02_boundary_evasion.json`; `outputs/exported_artifacts/extended_evaluation_snapshot.json`; `eval/evaluation_results.csv`  

---

## F-013

- **failure_id:** F-013  
- **date:** 2026-04-17  
- **version_tested:** phase3-v1.2  
- **what_triggered_the_problem:** Strict Phase 2 continuity audit against the final artifact  
- **what_happened:** The final package still under-showed two Phase 2 commitments: optional body-context intake was missing from the visible form, and review-driven revision looked more like an internal edit than a visible hand-back to `Plan Composer`  
- **severity:** medium  
- **fix_attempted:** Added body-context intake to the browser artifact and evaluation profiles, then made the rewrite path visibly follow `Review -> Plan Composer -> Review` before approval  
- **current_status:** fixed in `phase3-v1.3`  
- **evidence:** `app/index.html`; `app/app.js`; `src/engine.mjs`; `outputs/sample_runs/P3-01_baseline.json`; `outputs/sample_runs/P3-07_revision.json`  

## F-014

- **failure_id:** F-014  
- **date:** 2026-04-17  
- **version_tested:** phase3-v1.4  
- **what_triggered_the_problem:** Adversarial review of stacked ambiguity plus feasibility conflict  
- **what_happened:** The clarification branch paused for ambiguous symptom evidence, but it did not surface the already-detectable goal-resource conflict in the same checkpoint, so the user saw only one blocker at a time  
- **severity:** medium  
- **fix_attempted:** Added a stacked-blocker preview in the clarification checkpoint, trace reasoning, and handoff packet so ambiguity and the downstream tradeoff are now surfaced together; regenerated the adversarial evidence and re-graded `P3-X01` as a pass in `phase3-v1.5`  
- **current_status:** fixed in `phase3-v1.5`  
- **evidence:** `src/engine.mjs`; `app/engine.js`; `outputs/extended_runs/P3-X01_stacked_ambiguity_tradeoff.json`; `eval/evaluation_results.csv`  

---

## What Changed After Testing

- The safety detector was expanded so more medical-boundary wording is caught.
- The evaluation runner was made robust to local filesystem paths with spaces.
- The final UI now exposes transitions and allowed actions more clearly so waiting states are easier to interpret during review.
- Clarification and prioritization were upgraded from stop-and-rerun branches to real pause-and-continue session flows.
- Adaptation is now gated to the correct post-acceptance point in the workflow instead of appearing before user acceptance.
- Adaptation now captures structured user feedback plus a free-text note instead of relying on one fixed demo event.
- The artifact now shows the active checkpoint, trust cues, and version-to-version plan changes directly, which makes iteration evidence easier to inspect.
- The saved trace now shows agent ownership, decision logic, rejected alternatives, and authorized state transitions instead of only showing a stage label and bullet list.
- The evaluation package now includes adversarial cases and persona variation, separates current-version formal results from historical failure evidence, and documents previously failing governance and coordination cases as fixed rather than quietly deleting them.
- Persona outputs are now grounded in actual equipment, dietary, budget, and schedule constraints instead of leaking template phrases across profiles.
- The boundary detector now uses intent-aware treatment and symptom cues rather than relying only on literal keywords.
- The final artifact now exposes optional body-context intake and a visible `Review -> Plan Composer -> Review` rewrite path, which tightens continuity with the Phase 2 design.
- The clarification checkpoint now surfaces stacked blockers jointly, which closes the earlier gap where ambiguity hid a visible feasibility conflict until a later rerun.

## User-Facing Impact Summary

- F-001 mattered because a user could have received planning behavior when medical-boundary wording should have triggered a stop.
- F-002 mattered because a reviewer could have failed to reproduce the exported evidence on a normal filesystem path with spaces.
- F-003 mattered because the clarification branch looked correct in theory but felt broken in actual interaction until same-session continuation was added.
- F-004 mattered because the prioritization branch escalated correctly but did not initially let the user complete the interaction from the paused state.
- F-005 mattered because early adaptation availability made the workflow timing look less believable from the user and reviewer perspective.
- F-006 mattered because a fixed adaptation event weakened the claim that the artifact really responded to user-observed breakdowns.
- F-007 mattered because reviewers could see that something changed, but not always why the workflow paused or what changed between reviewed versions without reading raw state dumps.
- F-008 mattered because the architecture promised meaningful agent roles, but the evidence layer did not yet show their decision authority clearly enough.
- F-009 mattered because governance evidence is stronger when the system explains why it stopped, clarified, or escalated instead of only showing the branch outcome.
- F-010 mattered because a `7 / 7` pass sheet alone can look like under-challenging evaluation rather than honest testing.
- F-011 mattered because persona evidence loses credibility if the saved outputs still ignore the intake constraints they claim to honor.
- F-012 mattered because treatment-seeking language around recurring symptoms should trigger a stop even when the user avoids the most obvious keywords.
- F-013 mattered because strict grading rewards visible continuity between earlier architecture claims and the final interactive artifact, not only hidden code-level compatibility.
- F-014 mattered because a user facing more than one blocker should see the full situation at once, not discover the second blocker only after satisfying the first one.
