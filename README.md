# Constraint-Aware Fitness Planner

Authoritative **Phase 3 v1.6** package for **Agentic Systems Studio**.

## Repository

https://github.com/Shiwei-Jiang/multi-agents-project-constraint-aware-fitness-planner.git

## Team

Shiwei Jiang

## Selected Track

Track B: usable interactive artifact with scenario-based evaluation, visible ambiguity and breakdown cases, clear coordination logic, and supporting technical evidence.

## Five-Minute Reviewer Summary

Constraint-Aware Fitness Planner is a **non-clinical fitness planning system** for users who want a diet and workout plan that respects real-world constraints such as food intolerances, symptom-trigger histories, optional body-context notes, limited equipment, limited time, budget, and adherence challenges. The core problem is agentic because the system must decide **when to ask for clarification, when to stop for safety, when to route a conflict back to the human, when review should send a draft back for a bounded rewrite, and how to preserve state across revision and post-acceptance execution feedback**. This package contains a usable browser artifact, mirrored workflow logic for the browser and evaluation runner, saved scenario traces, extended adversarial and persona evaluation artifacts, a completed evaluation package, a failure log, architecture materials, screenshots, and final report source.

The current coordination layer is intentionally a **demonstration-level policy layer** for branching, scope control, and inspectable workflow evidence. It is not presented as a comprehensive clinical or optimization engine.

## Phase 3 Start Here

- Open [docs/package_index.md](docs/package_index.md) for the reviewer-facing package map.
- Treat the root-level `app/`, `src/`, `scripts/`, `docs/`, `eval/`, and `outputs/` folders as the authoritative Phase 3 materials.
- Treat `phase_submissions/phase1/`, `phase_submissions/phase2/`, and `phase_submissions/phase3/` as continuity archives only.

## What To Inspect First

1. Open [app/index.html](app/index.html) directly in a browser, or serve the project locally and open `http://127.0.0.1:8765/app/index.html`.
2. Read [docs/final_report.md](docs/final_report.md).
3. Inspect [docs/validation_checklist.md](docs/validation_checklist.md) for a rubric-to-evidence map.
4. Inspect [docs/course_concepts_crosswalk.md](docs/course_concepts_crosswalk.md) for the L4/L5/L6/L7 course-concept mapping.
5. Inspect [outputs/demo_outputs/scenario_trace_index.md](outputs/demo_outputs/scenario_trace_index.md) and the JSON traces in [outputs/sample_runs](outputs/sample_runs).
6. Review [eval/evaluation_results.csv](eval/evaluation_results.csv) and [eval/failure_log.md](eval/failure_log.md).

## Architecture Diagram

![Phase 3 human-in-the-loop multi-agent architecture and workflow](docs/phase3_architecture_workflow.png)

The primary Phase 3 architecture and workflow diagram is [docs/phase3_architecture_workflow.png](docs/phase3_architecture_workflow.png). It shows the human actor, four role-based agents, shared session state, stop and escalation branches, handoff packets, and the reviewed/adapted plan output.

## Track B Reviewer Guide

| Track B expectation | Open here | Scenario or artifact | What should be visible |
|---|---|---|---|
| screen-based interactive agent experience | `app/index.html` | `baseline` | intake, coordination trace, reviewed output package, state, and acceptance |
| visible branching and decision structure | `app/index.html` | `clarification`, `prioritization`, `medicalBoundary` | stop states, escalation, and protocol transitions rather than one-shot output |
| inspectable workflow evidence | `app/index.html` and `outputs/sample_runs/` | any scenario plus exported JSON | trace entries, protocol state, transition history, and allowed next actions |
| explicit agent authority and handoffs | `app/index.html` and `outputs/demo_outputs/end_to_end_trace_baseline.md` | baseline or revision | each trace card now records agent authority, decision, reasoning, rejected alternative, confidence, handoff target, and a published packet in the handoff ledger |
| human-in-the-loop revision | `app/index.html` | `revision` | one bounded user-requested revision before final acceptance |
| adaptation / iteration evidence | `app/index.html` | `adaptation` | state-preserving revision after an accepted plan is reopened by structured post-acceptance execution feedback |
| evaluation / results layer | `docs/evaluation_evidence_view.html`, `outputs/demo_outputs/scenario_trace_index.md`, and `outputs/exported_artifacts/extended_evaluation_snapshot.json` | exported evidence package | scenario suite summary, adversarial cases, persona variation, stability check, evaluation-scope note, and reviewer-facing evidence files |

Recommended reviewer path:

1. Run `baseline` to see the full happy path.
2. Run `medicalBoundary` to see bounded autonomy.
3. Run `prioritization` to see human escalation.
4. Run `revision` or `adaptation` to see iteration.
5. Open `docs/evaluation_evidence_view.html` or `outputs/demo_outputs/scenario_trace_index.md` to inspect the evidence layer.

## How To Run

### Browser demo

Open [app/index.html](app/index.html) directly in a browser.

If you prefer to serve the project locally instead, run:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/app/index.html
```

What to look for:

- visible role transitions across intake, constraint checking, plan composition, review, and adaptation
- optional body-context capture alongside goal, schedule, equipment, and constraint intake
- branch behavior for clarification, prioritization, and safety stop conditions
- versioned session state and allowed next actions
- separation between the workflow trace and the final reviewed plan package
- a visible `Review -> Plan Composer -> Review` rewrite cycle before approval when the reviewer or user rejects the current burden level
- a delivered plan artifact that now includes profile-fit summary, sample meal pattern, session blueprint, day-by-day weekly structure, next-step guidance, an operational handoff note, and a downloadable plan-summary export
- structured post-acceptance feedback input, current-checkpoint guidance, and version-to-version change comparison
- an agent handoff ledger that shows bounded packet exchanges instead of only a controller log

### Reproducible evaluation run

Run:

```bash
node scripts/run_evaluation.mjs
```

This generates:

- saved scenario traces in `outputs/sample_runs/`
- extended evaluation traces in `outputs/extended_runs/`
- an automatic run snapshot in `outputs/exported_artifacts/automatic_evaluation_snapshot.json`
- a repeated-run stability snapshot in `outputs/exported_artifacts/stability_check.json`
- an extended evaluation snapshot in `outputs/exported_artifacts/extended_evaluation_snapshot.json`
- a compact run index in `outputs/demo_outputs/scenario_trace_index.md`
- a reviewer-facing evaluation summary in `outputs/demo_outputs/evaluation_summary.md`
- an end-to-end trace walkthrough in `outputs/demo_outputs/end_to_end_trace_baseline.md`

## Platform and Dependencies

- No external API is required.
- No package installation is required for the included artifact.
- The browser UI is plain HTML/CSS/JavaScript.
- The evaluation runner uses the built-in Node.js runtime.
- See [platform_notes.md](platform_notes.md) for environment details.

## Repository Guide

- `app/`: browser-based final artifact
- `src/`: evaluation-facing workflow engine and source-of-truth logic for the browser bundle
- `scripts/`: reproducible evaluation export script
- `docs/`: final report source, architecture assets, summary, package index, and evidence view
- `screenshots/`: final visual evidence set and screenshot index
- `eval/`: test cases, completed evaluation results, failure log, and version notes
- `outputs/`: saved traces and exported evidence artifacts
- `data/`: manifest describing the intentional no-external-dataset design
- `media/`: demo video link file for the 5-minute project video
- `presentation/`: final presentation deck and video-specific deck used to support the 5-minute project video
- `phase_submissions/phase1`, `phase_submissions/phase2`, `phase_submissions/phase3`: prior deliverables and final packet source materials

## Evaluation Summary

The final package includes **7 completed deterministic workflow scenarios** plus **7 extended evaluation checks**:

- 5 primary rubric-facing evaluation cases
- 2 additional workflow cases for adaptation and user-requested revision
- 2 adversarial cases, both now passing in the latest version after the stacked-blocker checkpoint was upgraded and the governance detector was strengthened
- 2 fixed-failure regression checks that keep resolved weaknesses visible in the formal tables
- 3 lightweight persona-variation cases showing non-identical reviewed outputs

Interpretation note:

- the current `14 / 14` outcome should be read as **latest-version behavior within the project's bounded Phase 3 scope**
- the evidence is based on internal scenario emulation, saved traces, deterministic reruns, and structured manual review rather than an external user study
- historical failures remain visible in `eval/failure_log.md`, so the pass table should be read together with the failure-analysis and evaluation-scope materials rather than as a universal robustness claim

It also includes **interaction-level failure analysis** in the failure log:

- a safety-boundary detection weakness found in the Phase 2 logic and fixed in Phase 3
- paused clarification and prioritization branches that originally behaved like dead ends and were upgraded into resumable checkpoints
- artifact-level iteration fixes around adaptation input, checkpoint explainability, explicit reviewer disagreement traces, and visible `Review -> Plan Composer -> Review` rewrite evidence
- a plan-grounding defect, a treatment-intent governance miss, and an earlier stacked-blocker explanation gap that are all preserved historically in the failure log with version tags, while only the current-version evidence remains in the formal results table

Evaluation scope note:

- internal scenario emulation and structured observation are treated as reproducible evaluation evidence
- this evaluation is intentionally structured as reproducible scenario-based testing so branching, coordination behavior, and failure cases remain observable and comparable across runs
- this is not presented as equivalent to an external user study or third-party observational review
- see `eval/evaluation_scope_note.md` for the boundary between current formal evidence and historical debugging evidence

## What The Evidence Proves

- `app/index.html` plus the screenshot set show that the submission includes a usable Track B artifact with visible branching, state, checkpoints, and reviewed outputs rather than only a static mockup.
- `outputs/sample_runs/` plus `outputs/demo_outputs/end_to_end_trace_baseline.md` show bounded agent coordination, explicit authority, handoffs, and transition logic in concrete runs.
- `eval/evaluation_results.csv` plus `outputs/exported_artifacts/stability_check.json` show that the current release passes the defined workflow, governance, adaptation, and stability checks within the stated non-clinical scope.
- `outputs/extended_runs/` shows that evaluation goes beyond the happy path by including adversarial governance and coordination cases plus persona-variation evidence.
- `eval/failure_log.md` plus `eval/version_notes.md` show that important failures were found during development, fixed, and then reconnected to the final system through versioned changes and regression evidence.

In reviewer terms, the package is not arguing only that "14 cases passed." It is arguing that the artifact demonstrates the specific Phase 3 abilities the rubric asks for: usable interaction, visible coordination and branching, bounded governance, meaningful failure analysis, iteration after testing, persona-sensitive outputs, and reproducible evidence.

## Outputs Included

- saved JSON traces for each evaluated scenario
- extended adversarial and persona JSON traces
- an automatic evaluation snapshot
- a repeated-run stability snapshot
- an extended evaluation snapshot with adversarial, regression, and persona-variation evidence
- a scenario trace index for quick review
- an end-to-end trace walkthrough for one full run
- a limitation observation note tying remaining workflow constraints to concrete saved runs
- an evaluation scope note clarifying the difference between internal scenario emulation and external user testing
- architecture diagrams and reviewer-facing evidence views
- workflow screenshots with captions
- final report source and project summary
- a shareable video link file for the 5-minute project video
- richer checkpoint, trust, plan-diff, handoff-ledger, and plan-export evidence inside the interactive artifact

## Phase Continuity Note

The archived Phase 2 materials retain their original phase wording and metadata, including the earlier track framing used at that time. The root-level final package should be treated as the authoritative Phase 3 submission package, and [docs/package_index.md](docs/package_index.md) identifies exactly which files are authoritative.

## Known Limitations

- The system is **local and policy-driven**, with deterministic scenario exports used for reproducibility. It is not model-backed and not deployed as a production service.
- Clarification and prioritization now support pause-and-continue resumption in the same session and expose stacked blockers more clearly, but they still use a structured form update model rather than a fully conversational chat loop.
- The adaptation branch now accepts structured feedback categories plus a free-text note, but the downstream revision policy is still category-bounded rather than open-ended natural-language reasoning.
- The strengthened boundary detector now catches treatment-seeking phrasing that previously slipped through a literal keyword list, but the governance policy is still hand-authored rather than a full natural-language policy engine.
- The evaluation package is now cleaner and more explicit about scope, but it still relies on internal scenario emulation rather than external user observation.
- The project is intentionally bounded to **non-clinical planning support** and does not provide diagnosis, medication advice, or medical treatment guidance.
