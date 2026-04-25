# AI Usage Disclosure

This file documents Phase 3 AI assistance for the final package. Earlier AI usage from Phase 2 is preserved in the archived materials under `phase_submissions/phase2/` and the older phase folders.

## Tool Name and Version

- Codex desktop assistant based on GPT-5

## What It Was Used For

- auditing the existing Phase 1 and Phase 2 repository contents
- promoting the Phase 2 prototype into a Phase 3 final package
- refactoring the browser-only logic into a shared workflow engine
- generating a reproducible evaluation runner and saved evidence artifacts
- drafting and revising the final README, evaluation files, failure log, version notes, report source, screenshot index, and video script
- reorganizing the repository to match the final submission structure more closely

## Prompt And Brief Output Record

This section adds a concise prompt-and-output trail for the most material Phase 3 Codex uses. The full thread was longer than this summary, but these entries capture the substantive work that affected the final package.

| prompt_or_task | brief_output |
|---|---|
| Complete the Phase 3 package without inventing fake functionality, fake evaluation evidence, or fake screenshots. | Audited the repository, promoted the root-level final package, built the evaluation runner, exported scenario traces, and drafted the README, report source, evaluation files, failure log, screenshot index, and video support files. |
| Act as a strict Phase 3 final reviewer and identify inconsistencies, stale evidence, overclaims, and Track B weaknesses. | Produced a strict audit that flagged adaptation-timing issues, continuation-loop gaps, stale documentation or diagrams, and weak evidence-linkage risks. |
| Fix the implementation, UI behavior, and documentation so the system is internally consistent and aligned with the Phase 2 design or honestly simplified. | Implemented same-session continuation for clarification and prioritization, gated adaptation to post-acceptance, aligned UI actions with allowed transitions, and updated docs and evaluation files to match the new behavior. |
| Re-review the Track B package with special attention to workflow explanation, evidence visibility, and screen-based compliance. | Identified that the system itself was stronger but the package still needed clearer reviewer guidance, more precise Track B wording, and fresher evidence screens. |
| Refresh the screenshots and ensure evidence files, evaluation views, and screenshot references all match the latest implementation. | Re-captured the screen set from the current app and evaluation view, synchronized screenshot references, and refreshed the report PDF so final-facing visual evidence matches the current code and CSV outputs. |

## Exact Main Prompt Given to the Tool

The main Phase 3 task prompt was:

> You are helping me complete Phase 3 of my course project for “Agentic Systems Studio.”
>
> You must act as a strict senior engineer, auditor, and grader at the same time.
>
> I completed phase 1 and phase 2, and they are in the folder "95846 A4 Agentic studio Project".
>
> Your job is to COMPLETE the Phase 3 deliverables in this codebase so that:
> 1. the project strongly satisfies the Phase 3 rubric,
> 2. the repository/package structure matches the assignment requirements,
> 3. the codebase and docs are complete and professional,
> 4. the final submission packet materials are all prepared except the final exported PDF report, which I will export manually myself.
>
> Important constraints:
> - Do NOT make up fake functionality, fake results, fake logs, fake screenshots, fake evaluation evidence, fake claims, or fake metrics.
> - Do NOT claim something is implemented unless you can point to the exact code/file or you implement it now.
> - Do NOT leave vague placeholders if you can complete the work directly.
> - If something cannot be completed from the existing codebase, explicitly say so and create the strongest honest fallback artifact possible.
> - Preserve alignment with my existing Phase 1 and Phase 2 design decisions unless there is a strong reason to improve them.
> - The final result must look portfolio-ready, reproducible, and easy for a grader to inspect.
>
> The prompt then required, in order: repository audit, Phase 3 completion plan, implementation of missing deliverables, a rigorous evaluation package, failure analysis, a final report source, a screenshot index, video support materials, and a final structure check.

## What Was Changed Manually Afterward

- selected which older artifacts to preserve as historical evidence versus which files to promote into the new root-level final package
- reviewed the package structure for assignment alignment
- verified that the report and README claims matched actual code and generated artifacts
- retained the project’s original non-clinical scope and did not expand it into unsupported medical functionality
- manually reviewed the refreshed screenshots and final-facing files for obvious stale wording or stale evaluation counts before submission packaging

## What Was Verified Independently

- the repository was audited locally before writing the final package
- the evaluation runner was executed locally with `node scripts/run_evaluation.mjs`
- saved outputs were inspected in `outputs/sample_runs/`, `outputs/demo_outputs/`, and `outputs/exported_artifacts/`
- the final package structure was checked against the Phase 3 assignment checklist provided in the course prompt
- screenshots and phase archives were checked for path consistency

## Scope Note

This disclosure covers the final Phase 3 packaging and implementation work. It does not replace the earlier Phase 2 AI usage materials, which remain archived for completeness.

The quoted block above is the exact main completion prompt used for the final Phase 3 packaging pass. Follow-up review and cleanup prompts are summarized separately in `phase_submissions/phase3/ai_usage_appendix.md`.

## Appendix Reference

For a concise record of the main Codex prompts used during Phase 3 completion, strict review, and post-review cleanup, see `phase_submissions/phase3/ai_usage_appendix.md`.
