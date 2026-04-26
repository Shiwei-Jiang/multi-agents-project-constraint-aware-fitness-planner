# Phase 3 AI Usage Appendix

This appendix records the main follow-up Codex prompts that materially shaped the Phase 3 package after the main completion prompt documented in `AI_USAGE.md`. It is intentionally concise and should be read together with that summary disclosure.

| prompt | brief output |
|---|---|
| Audit the repository like a strict Phase 3 reviewer, focusing on Track B expectations, internal consistency, stale artifacts, and rubric risk. | Returned a structured audit with critical issues, high-risk issues, rubric scoring, and a fix-before-submit verdict. |
| Provide a concrete, file-level plan to fix the identified issues instead of just listing them. | Produced a prioritized remediation plan covering AI disclosure, evaluation contradictions, stale diagrams, adaptation wording, and final package cleanup. |
| Enter implementation-fix mode and make the artifact, engine, UI, docs, and evaluation outputs consistent with the intended workflow. | Added continuation support, corrected adaptation timing, aligned UI gating with engine state, regenerated evaluation outputs, and updated the report and evidence files. |
| Re-check the package from a Track B reviewer perspective, especially workflow explanation, inspectability, and evidence navigation. | Added or tightened reviewer guidance, strengthened Track B documentation, and clarified what each branch and artifact demonstrates. |
| Refresh screenshots and final-facing evidence so the visible package matches the latest implementation and evaluation outputs. | Re-captured the screenshot set, refreshed the evaluation-results screen, and synchronized screenshot descriptions with the current HTML and CSV evidence. |
| Update repository and video-link references after the GitHub repository and final video link were created. | Added the GitHub repository URL and Google Drive video link to the README, package index, submission packet source/PDF, and video-link reference file where appropriate. |
| Clean the presentation and final package contents before submission. | Kept only the needed presentation decks, removed optional video-script material from the final GitHub package, excluded local video binaries, and cleaned temporary `.DS_Store` / `.Rhistory` files. |
| Promote the current Phase 3 human-in-the-loop workflow diagram as the primary architecture diagram. | Added `docs/phase3_architecture_workflow.png`, embedded it in the README and final report, updated packet/checklist references, and retained older Phase 2 diagrams only as supporting/legacy continuity files. |
| Improve README navigation for final reviewers. | Added the inline architecture diagram, agent-role summary, submission-materials table, and clearer setup/no-installation instructions. |
| Perform final package checklist audits against the required project package, README minimum contents, screenshot expectations, evaluation files, and submitted-files list. | Verified the local package and GitHub mirror, fixed the packet submitted-files list to include `phase_submissions/`, regenerated the packet PDF, and confirmed the working tree was clean before final submission. |

## Limitation Note

This appendix summarizes the main follow-up prompts and their outputs rather than reproducing the full Codex thread transcript. The main exact completion prompt remains quoted in `AI_USAGE.md`. If the course staff require the exact full prompt-and-response history, it should be exported manually from the Codex conversation history and attached separately.
