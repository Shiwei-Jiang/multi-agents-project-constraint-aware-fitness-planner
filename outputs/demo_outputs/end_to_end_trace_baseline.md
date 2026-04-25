# End-to-End Trace Example

Source case: `P3-01` (baseline)

This file is a reviewer-facing walkthrough of one complete run so a grader can inspect agent authority, decisions, reasoning, and controller transitions in one place.

## Trace

### Step 1: Intake & Profile Builder — Intake & Profile Builder
- Protocol state when logged: `intake_active`
- Authority: Normalize raw intake into a profile packet before any downstream safety or planning step runs.
- Decision: Publish structured profile
- Reasoning: Downstream agents should inspect a normalized constraint-aware profile rather than infer directly from raw form text.
- Alternative rejected: Passing raw input directly to planning was rejected because it would hide ambiguity and missing-field logic.
- Handoff to: Constraint & Risk Checker
- Confidence: high
- Evidence items:
  - Structured goal: fat loss
  - Body context: Busy student schedule with recovery and consistency concerns, but no request for clinical interpretation.
  - Training days: 3
  - Equipment: resistance bands
  - Hard constraints detected from input: gluten intolerance; avoid known triggers: shellfish causes hives; 3 training days; resistance bands only

### Step 2: Constraint & Risk Checker — Constraint & Risk Checker
- Protocol state when logged: `constraint_check_active`
- Authority: Authorize planning, escalate to the human, or stop the session based on feasibility and scope checks.
- Decision: Authorize draft planning
- Reasoning: No blocking ambiguity, scope violation, or unresolved hard tradeoff remains after constraint checking.
- Alternative rejected: Holding planning for an unnecessary extra confirmation was rejected.
- Handoff to: Plan Composer
- Confidence: high
- Evidence items:
  - Hard constraints: gluten intolerance; avoid known triggers: shellfish causes hives; 3 training days; resistance bands only
  - Soft constraints: low weekday motivation and low weekday meal-prep capacity; medium budget
  - Detected conflicts: none

### Step 3: Plan Composer — Plan Composer
- Protocol state when logged: `plan_composition_active`
- Authority: Draft the first-pass plan package once the controller authorizes planning.
- Decision: Publish draft package for review
- Reasoning: Composition is allowed only after missing information, boundary checks, and blocking tradeoffs have been resolved or surfaced.
- Alternative rejected: Delivering the first draft directly to the user without review was rejected.
- Handoff to: Review & Adaptation Agent
- Confidence: medium
- Evidence items:
  - Draft plan package created after constraint checks passed.
  - Draft contains nutrition strategy, workout strategy, weekly schedule, adherence supports, rationale, and warnings.
  - Package is passed forward for review rather than delivered directly.

### Step 4: Review & Adaptation Agent — Review & Adaptation Agent
- Protocol state when logged: `review_active`
- Authority: Approve the draft, revise it before release, or send back a bounded change request.
- Decision: Request bounded rewrite before approval
- Reasoning: The reviewer judged the first draft as too burdensome to release unchanged, so the next step is a visible rewrite request rather than a silent inline edit.
- Alternative rejected: Passing the first draft through unchanged was rejected.
- Handoff to: Plan Composer
- Confidence: medium
- Evidence items:
  - Reviewer disagreed with the initial weekday burden and requested a bounded rewrite before approval.
  - Weekday workload and meal-prep friction should be reduced before the package is released.

### Step 5: Plan Composer — Plan Composer
- Protocol state when logged: `plan_composition_active`
- Authority: Rewrite the draft only within the bounded changes requested by review.
- Decision: Publish revised draft package
- Reasoning: The composer revised weekday load and adherence supports without changing the accepted hard constraints or non-clinical scope.
- Alternative rejected: Restarting intake or ignoring the review guidance was rejected.
- Handoff to: Review & Adaptation Agent
- Confidence: medium
- Evidence items:
  - The Plan Composer received a bounded rewrite request from review and revised the draft accordingly.
  - Weekday session load should be reduced and restart-friendly supports strengthened.
  - Keep the original hard constraints and non-clinical scope unchanged during the rewrite.

### Step 6: Review & Adaptation Agent — Review & Adaptation Agent
- Protocol state when logged: `review_active`
- Authority: Approve the rewritten draft once the bounded issues have been resolved.
- Decision: Approve rewritten draft as reviewed package
- Reasoning: The revised draft now fits the adherence concerns closely enough to release while preserving the original hard constraints.
- Alternative rejected: Requesting another rewrite before user inspection was rejected.
- Handoff to: Human-in-the-Loop
- Confidence: medium
- Evidence items:
  - Reviewer disagreed with the initial weekday burden and sent the draft back for a bounded rewrite.
  - The rewritten package reduced weekday workload and meal-prep friction before approval.
  - The review step checked the draft against hard constraints, adherence fit, and non-clinical scope.
  - The reviewed package preserves the original hard constraints while improving deliverability.
  - Plan remains within non-clinical scope.

### Step 7: Controller — Final Output
- Protocol state when logged: `review_active`
- Authority: Expose the reviewed package only after the authorized review outcome is available.
- Decision: Wait for user inspection
- Reasoning: The reviewed package is ready, but completion authority remains with the human user.
- Alternative rejected: Completing the session automatically after review was rejected.
- Handoff to: Human-in-the-Loop
- Confidence: high
- Evidence items:
  - Version 1 plan ready.
  - Reviewed plan package returned to the user interface.
  - The workflow now waits for the user's post-review decision.

### Step 8: Human-in-the-Loop — Human Actor
- Protocol state when logged: `awaiting_user_acceptance`
- Authority: Own the final acceptance decision for the reviewed package.
- Decision: Accept reviewed package
- Reasoning: The package looks feasible enough to try without another bounded revision.
- Alternative rejected: Requesting another revision was rejected by the human at this checkpoint.
- Handoff to: Controller
- Confidence: human_authority
- Evidence items:
  - The end user inspected the reviewed package and accepted it.
  - No further revision was requested at this stage.

### Step 9: Controller — Completed
- Protocol state when logged: `awaiting_user_acceptance`
- Authority: Close the session only after the user has accepted the current reviewed package.
- Decision: Mark session completed
- Reasoning: The human has exercised final approval authority, so the controller can close the current planning cycle.
- Alternative rejected: Keeping the session open without need was rejected.
- Handoff to: Completed state
- Confidence: high
- Evidence items:
  - Version 2 marked as accepted.
  - The workflow entered a completed state after user approval.

## State transitions

- `intake_active` -> `constraint_check_active` (Structured intake completed.) | authorized by: Intake & Profile Builder
- `constraint_check_active` -> `plan_composition_active` (Constraint report cleared planning.) | authorized by: Constraint & Risk Checker
- `plan_composition_active` -> `review_active` (Draft passed to review.) | authorized by: Plan Composer
- `review_active` -> `plan_composition_active` (Reviewer requested a bounded rewrite before approval.) | authorized by: Review & Adaptation Agent
- `plan_composition_active` -> `review_active` (Revised draft returned to review for approval.) | authorized by: Plan Composer
- `review_active` -> `awaiting_user_acceptance` (Reviewed package ready for user inspection.) | authorized by: Review & Adaptation Agent
- `awaiting_user_acceptance` -> `completed` (User accepted the reviewed package.) | authorized by: Human-in-the-Loop

## Final outcome

- Final protocol state: `completed`
- Outcome: `accepted`
- Accepted: `true`
