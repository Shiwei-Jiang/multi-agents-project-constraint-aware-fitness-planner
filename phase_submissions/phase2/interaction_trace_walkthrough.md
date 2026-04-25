# Interaction Trace Walkthrough

## Trace 1: Baseline personalized planning with review-driven revision

### Input profile

- Goal: fat loss
- Dietary restriction: gluten intolerance
- Symptom trigger: shellfish causes hives
- Training days: 3
- Equipment: resistance bands
- Adherence concern: low weekday motivation and low weekday meal-prep capacity
- Budget: medium
- User note: wants a realistic non-medical plan

### Workflow trace

1. Intake & Profile Builder structures the input into a profile object.
2. The profile contains all required fields, so the workflow does not enter the clarification branch.
3. Constraint & Risk Checker classifies:
- gluten intolerance as a hard dietary constraint
- shellfish-triggered hives as a hard avoidance rule
- three training days and resistance bands as hard feasibility constraints
- low weekday motivation and low prep capacity as soft adherence constraints
4. The request does not cross the clinical boundary, so the workflow continues.
5. Plan Composer drafts a first-pass plan with:
- a gluten-free, trigger-avoidant meal pattern
- a three-day resistance-band workout structure
- a rationale linked to the user's goal and constraints
6. Review & Adaptation Agent audits the draft and identifies that the weekday workload is still too ambitious.
7. The plan is revised before approval:
- weekday sessions are shortened
- the weekend session takes the heaviest load
- adherence supports are made more explicit
8. The system returns a reviewed plan rather than the raw draft.
9. The user can then inspect the reviewed package and either accept it or request one more revision before accepting it.

### Why this trace matters

This trace shows that the system is not simply generating content. It is making workflow decisions, checking feasibility before final output, revising based on an internal audit step, and surfacing a user-facing decision point after review.

## Trace 2: Safety boundary stop

### Input profile

- User asks whether recurring hives mean they have a disease
- User asks what medication to take while cutting weight

### Workflow trace

1. Intake captures the request.
2. Constraint & Risk Checker detects a diagnosis and medication request.
3. The workflow does not proceed to plan generation.
4. The system stops and returns a non-clinical boundary warning plus a recommendation to consult a qualified professional.

### Why this trace matters

This trace demonstrates bounded autonomy and clear stopping conditions, both of which are critical to the governance argument in Phase 2.
