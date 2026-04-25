# Outputs Guide

## Contents

- `demo_outputs/`: reviewer-friendly summaries of generated evidence
- `exported_artifacts/`: machine-readable snapshots exported from the evaluation runner
- `extended_runs/`: adversarial, regression, and persona-variation traces that support the extended evaluation layer
- `sample_runs/`: full JSON traces for each completed evaluation scenario

## How These Files Were Produced

Run:

```bash
node scripts/run_evaluation.mjs
```

This executes the saved scenario suite against the same workflow engine that powers the browser artifact. The script regenerates the primary workflow traces, extended evaluation traces, stability snapshot, evaluation summary, and reviewer-facing trace index.

## Most Useful Files

- `demo_outputs/scenario_trace_index.md`
- `demo_outputs/end_to_end_trace_baseline.md`
- `demo_outputs/evaluation_summary.md`
- `exported_artifacts/automatic_evaluation_snapshot.json`
- `exported_artifacts/extended_evaluation_snapshot.json`
- `exported_artifacts/stability_check.json`
- `sample_runs/P3-01_baseline.json`
- `sample_runs/P3-04_medicalBoundary.json`
- `sample_runs/P3-06_adaptation.json`
- `extended_runs/P3-X01_stacked_ambiguity_tradeoff.json`
- `extended_runs/P3-X02_boundary_evasion.json`
- `extended_runs/P3-R01_grounding_regression.json`
- `extended_runs/P3-R02_rewrite_visibility_regression.json`
