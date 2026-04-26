# Version Notes

## Phase 3 Final Package

### `phase3-v1.6` — 2026-04-19

Major changes:

- refreshed the interaction framing so tradeoff handling now appears as workflow-owned human-resolution options rather than reviewer-only shortcut buttons
- synchronized the browser bundle, evidence exports, report, packet materials, and regenerated PDFs around a single current release label
- refreshed the screenshot set and rechecked the evidence package against the live UI so the visual submission materials match the current artifact state
- tightened the evaluation and report interpretation language so current-version results, historical failures, and remaining scope limits are explained more clearly

Why this matters:

- the Track B artifact now reads more like a usable multi-agent decision-support product and less like a fixed scenario player
- the exported materials are less likely to drift out of sync because the authoritative source, screenshots, packet text, and PDFs now point to one release
- the final report now interprets the evidence more clearly instead of only describing what files exist

### `phase3-v1.5` — 2026-04-17

Major changes:

- upgraded the clarification checkpoint so stacked blockers are surfaced together, which turns `P3-X01` from a visible partial failure into a current-version pass
- added an explicit handoff ledger to the artifact so bounded agent coordination is visible as published packets, not only as trace prose
- replaced the old prioritization shortcut framing with workflow-owned human-resolution options so tradeoff handling reads more like an agent-to-human decision handoff than a demo button pair
- added a downloadable reviewed-plan summary so the browser artifact produces a clearer end-user deliverable
- added `docs/package_index.md` and `eval/evaluation_scope_note.md` so authoritative-package guidance and evaluation-scope boundaries are explicit
- aligned `src/engine.mjs`, `app/engine.js`, README, report, and reviewer-facing evidence files around one authoritative version label

Why this matters:

- the current evidence package now reflects the latest version consistently instead of splitting the story across `phase3-v1.3` and `phase3-v1.4`
- the coordination evidence is stronger because the reviewer can inspect actual packet-level handoffs between bounded agents
- the tradeoff branch now feels more like a real user decision checkpoint because the workflow publishes explicit resolution paths instead of looking like a fixed demo fork
- the package is more honest and more polished because current-version results, historical failures, and evaluation-scope limits are now separated clearly
- the interactive artifact now looks more like a usable planning tool and less like a trace-only demo

### `phase3-v1.4` — 2026-04-17

Major changes:

- promoted two historically weak behaviors into formal regression checks inside `eval/test_cases.csv`, `eval/evaluation_results.csv`, and `outputs/extended_runs/`
- expanded the extended evaluation layer from 5 to 7 checks so the formal tables now include resolved grounding and rewrite-visibility issues, not only the still-open limitation
- refreshed the reviewer-facing evaluation view, screenshot captions, final report summary tables, and submission packet summary to match the expanded evidence package
- prepared the final packet PDFs for regeneration from the updated markdown sources

Why this matters:

- resolved failures are now inspectable in the same formal evidence layer as current passes and the remaining partial failure
- the final report now interprets the evaluation more strongly by distinguishing stable core behavior, adversarial stress behavior, and fixed-failure regression evidence
- the submission-facing materials are less likely to overstate or underspecify what the repo actually contains

### `phase3-v1.3` — 2026-04-17

Major changes:

- added optional body-context intake to the browser artifact and evaluation profiles so the visible input scope matches the refined Phase 2 design more closely
- replaced the earlier direct-match boundary detector with an intent-aware rule layer that catches treatment-seeking phrasing paired with symptom or recurrence language
- fixed plan-grounding defects so nutrition, workout wording, and weekly structure are conditioned on actual equipment, dietary constraints, budget, and training-day count
- made the rewrite loop visibly follow `Review -> Plan Composer -> Review` in the baseline and user-requested revision traces
- regenerated the exported evidence and re-graded the evaluation package so persona and adversarial cases match the actual saved outputs

Why this matters:

- the final artifact now aligns more cleanly with the Phase 2 architecture claim instead of relying on a narrower visible implementation
- adversarial governance evidence is stronger because `P3-X02` is now a documented pass after a real detector refinement rather than a quietly removed failure
- persona variation evidence is more trustworthy because the reviewed outputs are now grounded in the constraints shown in the intake
- the remaining visible limitation is now concentrated in `P3-X01`, where stacked blockers are still surfaced sequentially rather than jointly

### `phase3-v1.2` — 2026-04-16

Major changes:

- kept the centralized controller intact, but upgraded trace entries so each agent now exposes decision authority, explicit decisions, reasoning, rejected alternatives, confidence labels, and handoff targets
- added transition-level `authorizedBy` evidence so reviewers can see which agent output triggered each protocol-state change
- added an end-to-end baseline trace walkthrough in `outputs/demo_outputs/end_to_end_trace_baseline.md`
- extended evaluation beyond the core deterministic suite with adversarial cases and persona-variation cases exported to `outputs/extended_runs/`
- added `outputs/exported_artifacts/extended_evaluation_snapshot.json` so failure and persona evidence are linked to concrete artifacts rather than only described in prose

Why this matters:

- the system still matches the Phase 2 centralized state-machine design, but now reads more clearly as agentic coordination rather than a generic pipeline
- reviewers can now see one explicit reviewer-versus-composer disagreement in the saved traces
- the evidence package no longer relies on `7 / 7` internal passes alone; it now includes adversarial and persona evidence that was later refined further in `phase3-v1.3`

### `phase3-v1.1` — 2026-04-16

Major changes:

- upgraded adaptation from a fixed demo event to structured post-acceptance feedback input with category selection plus a free-text note
- added a current-checkpoint panel so clarification, prioritization, acceptance, and boundary-stop states explain what the workflow is waiting on
- added trust-and-scope cues directly in the artifact rather than relying on documentation alone
- added a version-to-version comparison view so review, revision, and adaptation changes are inspectable without reading raw JSON
- tightened evaluation, failure-analysis, and governance wording in the README and final report to match the updated interaction model

Why this matters:

- the final artifact now looks more like a real interactive system and less like a scripted scenario player
- human-in-the-loop checkpoints are easier to inspect during grading
- adaptation evidence is stronger because the browser now collects real user-provided execution feedback before reopening the workflow

### `phase3-v1.0` — 2026-04-15

Major changes:

- created a clean root-level final submission package
- positioned the project as a Track B final artifact with a usable browser experience, scenario-based evaluation, and supporting technical evidence
- refactored workflow logic into a source-of-truth engine in `src/engine.mjs`
- rebuilt the browser app in `app/` around a browser bundle that mirrors the engine logic
- added explicit protocol transitions and allowed-next-action evidence to the UI
- added `scripts/run_evaluation.mjs` for reproducible scenario exports
- generated final saved outputs in `outputs/sample_runs/`, `outputs/demo_outputs/`, and `outputs/exported_artifacts/`
- added repeated-run stability checking to strengthen reliability evidence
- wrote final evaluation files, failure log, report source, screenshot index, video support materials, and AI usage disclosure

Testing-driven changes:

- expanded safety-boundary detection beyond the narrower Phase 2 keyword set
- fixed evaluation runner path handling for local directories containing spaces
- fixed browser artifact integrity issues so loading a new scenario clears stale evidence, exported trace JSON reflects only the current session, and UI buttons visibly follow allowed-next-action gating
- refreshed the eight primary screenshots from the updated final browser artifact and reviewer-facing evaluation view after the artifact-integrity fixes
- added same-session pause-and-continue support for clarification and prioritization
- gated adaptation so it only opens after a reviewed plan has been accepted
- kept the remaining limitation focused on the still rule-based adaptation policy after feedback capture

## Phase 2 Baseline

The Phase 2 prototype and submission artifacts are preserved in `phase_submissions/phase2/`. Those materials remain useful historical evidence, but the final grading package should be evaluated primarily from the new root-level final structure.
