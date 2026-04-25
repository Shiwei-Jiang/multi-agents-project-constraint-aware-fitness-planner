# Trace Location

The project stores its evidence-bearing execution traces in `outputs/sample_runs/` rather than duplicating them inside `eval/`.

Why:

- `outputs/` is the primary artifact folder for exported run evidence
- each scenario trace is a full JSON export from the same workflow engine used by the browser artifact
- the evaluation tables in `eval/` cite those trace files directly

Primary trace files:

- `outputs/sample_runs/P3-01_baseline.json`
- `outputs/sample_runs/P3-04_medicalBoundary.json`
- `outputs/sample_runs/P3-06_adaptation.json`

Supporting summary files:

- `outputs/demo_outputs/scenario_trace_index.md`
- `outputs/demo_outputs/evaluation_summary.md`
- `outputs/exported_artifacts/stability_check.json`
