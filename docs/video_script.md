# 5-Minute Video Script and Shot Order

## Goal

Show the problem, the usable interactive artifact, the coordination logic, the evidence layer, one boundary or failure case, one iteration case, and the final outputs in under five minutes.

## What To Open Before Recording

- [README.md](../README.md)
- [app/index.html](../app/index.html)
- [docs/phase3_architecture_workflow.png](phase3_architecture_workflow.png)
- [eval/evaluation_results.csv](../eval/evaluation_results.csv)
- [eval/failure_log.md](../eval/failure_log.md)
- [outputs/demo_outputs/end_to_end_trace_baseline.md](../outputs/demo_outputs/end_to_end_trace_baseline.md)
- [outputs/demo_outputs/evaluation_summary.md](../outputs/demo_outputs/evaluation_summary.md)
- [docs/evaluation_evidence_view.html](evaluation_evidence_view.html)

## Recommended Shot Order

1. Problem and target user
2. Architecture
3. Baseline artifact walkthrough
4. Safety boundary case
5. Adaptation case
6. Evaluation package and exported evidence
7. Honest limitation and contribution

## Direct Recording Script

### 0:00 to 0:25 — Problem and target user

Say:

"This project is Constraint-Aware Fitness Planner, a non-clinical planning system for users who need realistic diet and workout guidance under real constraints like dietary restrictions, symptom-trigger histories, limited equipment, schedule limits, budget, and adherence challenges. The problem is agentic because the system has to decide when to ask for clarification, when to stop for safety, when to escalate tradeoffs back to the user, and when to revise a plan through bounded review and adaptation."

Show:

- `README.md`
- the project title and summary near the top

### 0:25 to 0:50 — Architecture

Say:

"The system uses four internal roles: Intake and Profile Builder, Constraint and Risk Checker, Plan Composer, and Review and Adaptation, plus a human-in-the-loop actor. A controller manages explicit protocol states, and the trace makes each role's authority, reasoning, rejected alternative, and handoff visible."

Show:

- `docs/phase3_architecture_workflow.png`
- point to the controller and the five roles
- point to the reviewed package and evidence outputs

### 0:50 to 2:05 — Main workflow demo

Say:

"Here is the runnable interactive artifact on the baseline scenario. The intake includes structured constraints plus optional body-context notes. After I run the workflow, the trace shows a visible Review to Plan Composer to Review rewrite cycle before the user sees the reviewed package. The final reviewed plan includes a profile-fit summary, sample meal pattern, session blueprint, expanded weekly schedule, warnings, and next-step guidance. The state panel on the right keeps protocol transitions, allowed next actions, and session history visible."

Show:

- open `app/index.html`
- load `Baseline constrained planning`
- click `Run Workflow`
- point to:
  - body-context intake field
  - trace entries with authority, decision, and handoff
  - visible `Review -> Plan Composer -> Review` rewrite path
  - reviewed package
  - state and transitions panel
- click `Accept Plan`

### 2:05 to 2:45 — Boundary case

Say:

"This is the governance boundary case. When the request moves into diagnosis, prescription, or treatment-seeking territory, the workflow stops before planning. The project is intentionally non-clinical, so bounded autonomy is part of the design rather than an afterthought."

Show:

- load `Safety boundary stop`
- click `Run Workflow`
- point to the stop-state explanation and the trace

### 2:45 to 3:30 — Adaptation and iteration

Say:

"The system also demonstrates iteration after testing. In the adaptation scenario, the reviewed plan is accepted first, then the workflow reopens only after structured post-acceptance feedback. It preserves prior state and updates only the relevant plan sections instead of restarting from zero."

Show:

- load `Adaptation after accepted plan fails`
- click `Run Workflow`
- click `Accept Plan`
- click `Apply Post-Acceptance Feedback`
- point to changed schedule, adherence supports, and version-to-version comparison

### 3:30 to 4:25 — Evaluation and evidence package

Say:

"For Phase 3, I added a source-of-truth workflow engine for evaluation plus a browser bundle that mirrors the same logic for direct interaction. Running `node scripts/run_evaluation.mjs` exports the core traces, a stability snapshot, an end-to-end walkthrough, and an extended evaluation snapshot. The evaluation table now includes fourteen total cases: seven deterministic workflow cases, two adversarial cases, three persona cases, and two regression checks that keep previously fixed failures visible. In the current release, all fourteen formal cases pass within the project's bounded internal evaluation scope, while the historical failures remain documented separately in the failure log and regression evidence."

Show:

- `outputs/demo_outputs/evaluation_summary.md`
- `eval/evaluation_results.csv`
- `outputs/demo_outputs/end_to_end_trace_baseline.md`
- `outputs/extended_runs/`
- `docs/evaluation_evidence_view.html`
- point to:
  - the `14 / 14` current-version pass summary
  - `P3-X02` as the strengthened governance pass
  - `P3-R01` and `P3-R02` as fixed-failure regression checks

### 4:25 to 5:00 — Honest limitation and final contribution

Say:

"One honest limitation is that adaptation and governance are still policy-driven and bounded rather than fully open-ended, and the evaluation evidence is still internal scenario testing rather than an external user study. The main Phase 3 contribution was turning the earlier prototype into a reproducible final package with a usable artifact, explicit handoffs, grounded persona evidence, adversarial evaluation, regression checks for fixed failures, and a reviewer-friendly evidence layer."

Show:

- `eval/failure_log.md`
- `docs/final_report.md`

## Exact Images and Evidence Worth Showing

### Must show from the artifact

- [screenshots/01_home.png](../screenshots/01_home.png): main interaction, trace, reviewed package, state panel
- [screenshots/03_boundary_stop.png](../screenshots/03_boundary_stop.png): safety boundary stop
- [screenshots/05_adaptation.png](../screenshots/05_adaptation.png): post-acceptance adaptation
- [screenshots/07_state_and_transitions.png](../screenshots/07_state_and_transitions.png): revision and state visibility

### Must show from evidence and outputs

- [docs/phase3_architecture_workflow.png](phase3_architecture_workflow.png)
- [screenshots/08_evaluation_outputs.png](../screenshots/08_evaluation_outputs.png)
- [eval/evaluation_results.csv](../eval/evaluation_results.csv)
- [eval/failure_log.md](../eval/failure_log.md)
- [outputs/demo_outputs/end_to_end_trace_baseline.md](../outputs/demo_outputs/end_to_end_trace_baseline.md)
- [outputs/exported_artifacts/extended_evaluation_snapshot.json](../outputs/exported_artifacts/extended_evaluation_snapshot.json)

## What To Emphasize Verbally

- This is a usable interactive artifact, not just a report.
- Agent coordination is visible in the trace, not hidden behind one final answer.
- The evaluation layer includes both current limitations and fixed-failure regression checks.
- Governance is explicit: the system stops when it should stop.
- The final package is reproducible because the evidence can be regenerated with `node scripts/run_evaluation.mjs`.

## Best Failure Case To Include

Use the **Safety boundary stop** case on screen because it is the fastest and clearest boundary example.

Mention the **historical stacked-blocker failure** verbally during the evaluation section as an example of how the failure log and regression evidence document real iteration without pretending the current release is still failing there.
