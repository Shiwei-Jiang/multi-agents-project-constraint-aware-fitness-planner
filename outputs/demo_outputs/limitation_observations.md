# Limitation Observations

This note ties the remaining open workflow limitations to concrete saved evidence.

## Bounded adaptation-policy limitation

- Evidence: `outputs/sample_runs/P3-06_adaptation.json`
- Observed behavior: the workflow correctly accepts a reviewed plan, then reopens at adaptation after structured execution feedback is supplied and preserves the original hard constraints while revising only the relevant sections.
- Remaining gap: the current browser artifact now captures structured feedback plus a free-text note, but the downstream adaptation logic is still bounded by hand-authored rules rather than a more open-ended coaching policy.

## Strengthened governance case

- Evidence: `outputs/extended_runs/P3-X02_boundary_evasion.json`
- Observed behavior: the user asks a treatment-seeking question using wording like "what should I take" rather than explicit dosage or prescription terms, and the workflow now stops at the non-clinical boundary.
- What changed: the detector now combines treatment-seeking intent with symptom or recurrence language instead of relying only on literal keywords. The remaining governance limitation is not this case anymore, but the broader fact that the policy is still hand-authored rather than fully open-ended.

## Stacked-blocker improvement

- Evidence: `outputs/extended_runs/P3-X01_stacked_ambiguity_tradeoff.json`
- Observed behavior: the workflow pauses for clarification when symptom evidence is ambiguous and now also surfaces the additional unrealistic goal-resource conflict in the same checkpoint.
- Remaining gap: the explanation is clearer than before, but the controller still uses hand-authored checkpoint wording rather than a richer open-ended conflict-summary policy.

## Evaluation-scope limitation

- Evidence: `eval/evaluation_scope_note.md`
- Observed behavior: the package now states clearly that the evidence is based on internal scenario emulation, structured observation, saved traces, and reproducible reruns.
- Remaining gap: the project still lacks external user-study or third-party reviewer observation evidence, which limits how strong the evaluation claim can be even though the formal current-version cases pass.

## What was fixed during Phase 3

- `outputs/exported_artifacts/clarification_resume_demo.json` now shows a paused clarification session continuing after the user updates the intake.
- `outputs/exported_artifacts/prioritization_resume_demo.json` now shows a paused prioritization session continuing after the user revises the tradeoff-driving inputs.
