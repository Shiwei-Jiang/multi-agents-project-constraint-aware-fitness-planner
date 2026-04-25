(function () {
const APP_VERSION = "phase3-v1.6";

const SCENARIOS = {
  baseline: {
    id: "baseline",
    caseId: "P3-01",
    title: "Baseline constrained planning",
    profile: {
      goal: "fat loss",
      bodyContext: "Busy student schedule with recovery and consistency concerns, but no request for clinical interpretation.",
      trainingDays: "3",
      equipment: "resistance bands",
      dietaryRestrictions: "gluten intolerance",
      symptomTriggers: "shellfish causes hives",
      adherenceConcerns: "low weekday motivation and low weekday meal-prep capacity",
      budget: "medium",
      userQuestion: "I want a realistic plan and not anything medical."
    },
    actions: ["runWorkflow", "acceptPlan"]
  },
  clarification: {
    id: "clarification",
    caseId: "P3-02",
    title: "Clarification for ambiguous trigger history",
    profile: {
      goal: "fat loss",
      bodyContext: "Wants a practical starting point and is not asking for diagnosis.",
      trainingDays: "3",
      equipment: "resistance bands",
      dietaryRestrictions: "gluten intolerance",
      symptomTriggers: "certain foods make me feel bad and I react sometimes",
      adherenceConcerns: "low weekday motivation",
      budget: "medium",
      userQuestion: "Please help me figure out a safe plan."
    },
    actions: ["runWorkflow"]
  },
  prioritization: {
    id: "prioritization",
    caseId: "P3-03",
    title: "Human prioritization on infeasible goal mix",
    profile: {
      goal: "muscle gain",
      bodyContext: "No clinical concern stated; the main issue is an aggressive goal under limited resources.",
      trainingDays: "1",
      equipment: "bodyweight only",
      dietaryRestrictions: "",
      symptomTriggers: "",
      adherenceConcerns: "does not want repeat meals",
      budget: "low",
      userQuestion: "I want the most aggressive muscle gain plan possible."
    },
    actions: ["runWorkflow"]
  },
  medicalBoundary: {
    id: "medicalBoundary",
    caseId: "P3-04",
    title: "Safety boundary stop",
    profile: {
      goal: "fat loss",
      bodyContext: "Recurring hives are mentioned, but the system must stay non-clinical.",
      trainingDays: "3",
      equipment: "gym access",
      dietaryRestrictions: "milk",
      symptomTriggers: "recurring hives",
      adherenceConcerns: "low weekday motivation",
      budget: "medium",
      userQuestion: "Do these hives mean I have a disease and what prescription should I take while cutting weight?"
    },
    actions: ["runWorkflow"]
  },
  uncertainty: {
    id: "uncertainty",
    caseId: "P3-05",
    title: "Missing-field uncertainty handling",
    profile: {
      goal: "fat loss",
      bodyContext: "No body context provided beyond wanting a plan quickly.",
      trainingDays: "",
      equipment: "",
      dietaryRestrictions: "gluten intolerance",
      symptomTriggers: "",
      adherenceConcerns: "busy study schedule",
      budget: "low",
      userQuestion: "I know some details are missing, but just give me your best plan anyway."
    },
    actions: ["runWorkflow"]
  },
  adaptation: {
    id: "adaptation",
    caseId: "P3-06",
    title: "Adaptation after accepted plan fails",
    profile: {
      goal: "fat loss",
      bodyContext: "Busy student schedule with recovery and consistency concerns, but no request for clinical interpretation.",
      trainingDays: "3",
      equipment: "resistance bands",
      dietaryRestrictions: "gluten intolerance",
      symptomTriggers: "shellfish causes hives",
      adherenceConcerns: "low weekday motivation and low weekday meal-prep capacity",
      budget: "medium",
      userQuestion: "I want a realistic plan and not anything medical."
    },
    actions: ["runWorkflow", "acceptPlan", "runAdaptation"]
  },
  revision: {
    id: "revision",
    caseId: "P3-07",
    title: "User-requested revision before acceptance",
    profile: {
      goal: "fat loss",
      bodyContext: "Busy student schedule with recovery and consistency concerns, but no request for clinical interpretation.",
      trainingDays: "3",
      equipment: "resistance bands",
      dietaryRestrictions: "gluten intolerance",
      symptomTriggers: "shellfish causes hives",
      adherenceConcerns: "low weekday motivation and low weekday meal-prep capacity",
      budget: "medium",
      userQuestion: "I want a realistic plan and not anything medical."
    },
    actions: ["runWorkflow", "requestRevision", "acceptPlan"]
  }
};

const DEFAULT_PROFILE = {
  goal: "",
  bodyContext: "",
  trainingDays: "",
  equipment: "",
  dietaryRestrictions: "",
  symptomTriggers: "",
  adherenceConcerns: "",
  budget: "",
  userQuestion: ""
};

function createInitialState() {
  return {
    appVersion: APP_VERSION,
    version: 0,
    protocolState: "idle",
    status: { kind: "neutral", message: "Waiting for input." },
    profile: clone(DEFAULT_PROFILE),
    missingFields: [],
    constraintReport: null,
    currentPlan: null,
    reviewNotes: [],
    feedbackLog: [],
    awaitingUserDecision: false,
    accepted: false,
    lastDecision: null,
    revisionCount: 0,
    maxRevisionRounds: 1,
    availableActions: [],
    outputLabel: "",
    outputChanges: [],
    planHistory: [],
    handoffLedger: [],
    lastFeedbackInput: null,
    trace: [],
    transitions: [],
    runSummary: null
  };
}

function createProfile(overrides = {}) {
  return { ...DEFAULT_PROFILE, ...clone(overrides) };
}

function buildHumanResolutionOptions(profileInput = {}) {
  const profile = createProfile(profileInput);
  const options = [];

  if (profile.goal === "muscle gain" && Number(profile.trainingDays) <= 1 && profile.budget === "low") {
    options.push({
      id: "prefer_feasible_plan",
      label: "Prefer feasible recomposition plan",
      description: "Reduce ambition and keep the current time and budget limits so planning can continue without pretending the tradeoff disappeared.",
      agentHint: "Constraint & Risk Checker is surfacing the slower-but-feasible path instead of choosing it automatically.",
      updates: {
        goal: "recomposition",
        trainingDays: profile.trainingDays || "1",
        budget: "low",
        userQuestion: "I would rather follow a slower but feasible plan with my current schedule and budget."
      }
    });
    options.push({
      id: "expand_resources",
      label: "Keep goal and expand resources",
      description: "Preserve the aggressive goal, but explicitly increase training capacity and budget so the workflow can evaluate a more realistic path.",
      agentHint: "The human keeps authority over ambition, but must make the resource change explicit before the planner proceeds.",
      updates: {
        goal: "muscle gain",
        trainingDays: "3",
        budget: "medium",
        userQuestion: "I still want a more aggressive goal, so I can increase training days and spend a bit more."
      }
    });
  }

  if (!options.length) {
    options.push({
      id: "tighten_constraints",
      label: "Tighten the intake constraints",
      description: "Clarify the real bottleneck before continuing so the next agent sees a cleaner profile packet.",
      agentHint: "Use this when the workflow is blocked by ambiguity or missing evidence rather than by a value-laden tradeoff.",
      updates: {}
    });
  }

  return options;
}

function executeScenario(scenarioId) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const state = createInitialState();
  const profile = createProfile(scenario.profile);

  for (const action of scenario.actions) {
    if (action === "runWorkflow") {
      runWorkflow(profile, state);
    } else if (action === "runAdaptation") {
      runAdaptation(state);
    } else if (action === "acceptPlan") {
      acceptPlan(state);
    } else if (action === "requestRevision") {
      requestRevision(state);
    } else {
      throw new Error(`Unsupported action: ${action}`);
    }
  }

  return {
    caseId: scenario.caseId,
    scenarioId,
    title: scenario.title,
    finalState: summarizeState(state),
    state
  };
}

function runWorkflow(profileInput, state = createInitialState()) {
  const profile = createProfile(profileInput);
  prepareFreshRun(state, profile);
  return processWorkflow(profile, state);
}

function continueWorkflow(profileInput, state) {
  if (!["awaiting_clarification", "awaiting_prioritization"].includes(state.protocolState)) {
    setStatus(state, "warn", "The workflow can only continue from a clarification or prioritization pause.");
    updateAvailableActions(state);
    return state;
  }

  const profile = createProfile(profileInput);
  if (sameProfile(profile, state.profile)) {
    const message = state.protocolState === "awaiting_clarification"
      ? "Update the missing or ambiguous intake fields before continuing."
      : "Revise the intake fields to resolve the tradeoff before continuing.";
    setStatus(state, "warn", message);
    updateAvailableActions(state);
    return state;
  }

  const resumeFrom = state.protocolState;
  addEntry(state, {
    actor: "Human-in-the-Loop",
    title: resumeFrom === "awaiting_clarification" ? "Clarification Response" : "Prioritization Response",
    items: summarizeHumanResponse(resumeFrom, state.profile, profile),
    authority: "The human resolves ambiguity or tradeoffs the automated workflow should not settle alone.",
    decision: resumeFrom === "awaiting_clarification" ? "Provide missing evidence" : "Choose a tradeoff direction",
    reasoning: resumeFrom === "awaiting_clarification"
      ? "The user supplied the missing or more specific details required for safe continuation."
      : "The user made the value-laden choice about feasibility versus ambition.",
    alternativeConsidered: resumeFrom === "awaiting_clarification"
      ? "Keeping the prior vague intake unchanged was rejected."
      : "Letting the controller guess the preferred tradeoff was rejected.",
    handoffTo: "Controller -> Intake & Profile Builder",
    confidence: "human_authority"
  });
  transition(
    state,
    "intake_active",
    resumeFrom === "awaiting_clarification"
      ? "User supplied clarification and resumed the paused workflow."
      : "User revised priorities or constraints and resumed the paused workflow.",
    "Human-in-the-Loop"
  );
  prepareContinuationRun(state, profile);
  return processWorkflow(profile, state);
}

function processWorkflow(profile, state) {
  addEntry(state, {
    actor: "Intake & Profile Builder",
    title: "Intake & Profile Builder",
    items: [
      `Structured goal: ${profile.goal || "unknown"}`,
      `Body context: ${profile.bodyContext || "not supplied"}`,
      `Training days: ${profile.trainingDays || "unknown"}`,
      `Equipment: ${profile.equipment || "unknown"}`,
      `Hard constraints detected from input: ${hardConstraintPreview(profile)}`
    ],
    authority: "Normalize raw intake into a profile packet before any downstream safety or planning step runs.",
    decision: "Publish structured profile",
    reasoning: "Downstream agents should inspect a normalized constraint-aware profile rather than infer directly from raw form text.",
    alternativeConsidered: "Passing raw input directly to planning was rejected because it would hide ambiguity and missing-field logic.",
    handoffTo: "Constraint & Risk Checker",
    confidence: "high"
  });
  publishHandoff(state, {
    from: "Intake & Profile Builder",
    to: "Constraint & Risk Checker",
    packetType: "profile_packet",
    summary: "Normalized intake profile with goal, schedule, equipment, dietary constraints, symptom notes, and adherence concerns.",
    authority: "Intake may publish the profile packet but not authorize planning."
  });

  transition(state, "constraint_check_active", "Structured intake completed.", "Intake & Profile Builder");
  state.missingFields = detectMissingFields(profile);
  const earlyConflictSummary = detectSecondaryBlockers(profile);

  if (state.missingFields.length > 0) {
    setStatus(state, "warn", "Clarification required before planning.");
    const clarificationItems = [
      `Missing critical fields: ${state.missingFields.join(", ")}`,
      clarificationQuestionFor(profile)
    ];
    if (earlyConflictSummary.length) {
      clarificationItems.splice(1, 0, `Secondary blocker already visible: ${earlyConflictSummary.join("; ")}`);
    }
    addEntry(state, {
      actor: "Constraint & Risk Checker",
      title: "Clarification Branch",
      items: clarificationItems,
      authority: "Pause the workflow whenever critical evidence is missing or too ambiguous for safe planning.",
      decision: "Pause for clarification",
      reasoning: earlyConflictSummary.length
        ? `Planning confidence is insufficient because the current profile is missing or underspecifies: ${state.missingFields.join(", ")}. The checker also keeps a downstream blocker visible now: ${earlyConflictSummary.join("; ")}.`
        : `Planning confidence is insufficient because the current profile is missing or underspecifies: ${state.missingFields.join(", ")}.`,
      alternativeConsidered: "Proceeding with guessed values or guessed trigger assumptions was rejected.",
      handoffTo: "Human-in-the-Loop",
      confidence: "low"
    });
    publishHandoff(state, {
      from: "Constraint & Risk Checker",
      to: "Human-in-the-Loop",
      packetType: "clarification_request",
      summary: earlyConflictSummary.length
        ? `Clarification request issued with stacked-blocker preview: missing ${state.missingFields.join(", ")} plus ${earlyConflictSummary.join("; ")}.`
        : `Clarification request issued for missing or ambiguous evidence: ${state.missingFields.join(", ")}.`,
      authority: "Constraint & Risk Checker may pause and expose clarification needs before planning."
    });
    transition(state, "awaiting_clarification", "Missing or ambiguous information blocks planning.", "Constraint & Risk Checker");
    state.runSummary = buildRunSummary(state, "clarification_required");
    updateAvailableActions(state);
    return state;
  }

  const boundaryAssessment = analyzeMedicalBoundary(profile);

  if (boundaryAssessment.triggered) {
    state.constraintReport = {
      escalationNeeded: true,
      escalationReason: "medical_boundary",
      hardConstraints: deriveHardConstraints(profile),
      softConstraints: deriveSoftConstraints(profile),
      detectedConflicts: []
    };
    setStatus(state, "stop", "Stopped at safety boundary.");
    addEntry(state, {
      actor: "Constraint & Risk Checker",
      title: "Constraint & Risk Checker",
      items: [
        `Clinical boundary triggered because: ${boundaryAssessment.reasons.join("; ")}`,
        "The system refuses medical interpretation and recommends professional guidance."
      ],
      authority: "Stop the workflow when the request crosses into diagnosis, treatment, or medication territory.",
      decision: "Refuse and stop at boundary",
      reasoning: boundaryAssessment.reasoning,
      alternativeConsidered: "Continuing with a conservative fitness plan anyway was rejected because that would still answer a medical-style request.",
      handoffTo: "Human-in-the-Loop / qualified professional",
      confidence: boundaryAssessment.confidence
    });
    publishHandoff(state, {
      from: "Constraint & Risk Checker",
      to: "Human-in-the-Loop / qualified professional",
      packetType: "boundary_refusal",
      summary: `Non-clinical boundary stop issued because ${boundaryAssessment.reasons.join("; ")}.`,
      authority: "Constraint & Risk Checker may revoke planning authority when the request becomes diagnostic or treatment-seeking."
    });
    transition(state, "stopped_boundary", "Safety boundary detected.", "Constraint & Risk Checker");
    state.runSummary = buildRunSummary(state, "boundary_stop");
    updateAvailableActions(state);
    return state;
  }

  const report = buildConstraintReport(profile);
  state.constraintReport = report;

  addEntry(state, {
    actor: "Constraint & Risk Checker",
    title: "Constraint & Risk Checker",
    items: [
      `Hard constraints: ${report.hardConstraints.join("; ") || "none listed"}`,
      `Soft constraints: ${report.softConstraints.join("; ") || "none listed"}`,
      `Detected conflicts: ${report.detectedConflicts.join("; ") || "none"}`
    ],
    authority: "Authorize planning, escalate to the human, or stop the session based on feasibility and scope checks.",
    decision: report.escalationNeeded ? "Escalate to human prioritization" : "Authorize draft planning",
    reasoning: report.escalationNeeded
      ? "A hard goal-resource conflict remains unresolved, so the system should not silently choose the user's tradeoff preference."
      : "No blocking ambiguity, scope violation, or unresolved hard tradeoff remains after constraint checking.",
    alternativeConsidered: report.escalationNeeded
      ? "Auto-selecting a slower plan without the user's permission was rejected."
      : "Holding planning for an unnecessary extra confirmation was rejected.",
    handoffTo: report.escalationNeeded ? "Human-in-the-Loop" : "Plan Composer",
    confidence: report.escalationNeeded ? "medium" : "high"
  });

  if (report.escalationNeeded && report.escalationReason === "human_prioritization") {
    setStatus(state, "warn", "User prioritization required before final planning.");
    addEntry(state, {
      actor: "Human-in-the-Loop",
      title: "Human Prioritization",
      items: [
        "The system detected a tradeoff that should be resolved by the user rather than guessed automatically.",
        report.prioritizationPrompt
      ],
      authority: "The human decides which tradeoff direction is acceptable when ambition and resources conflict.",
      decision: "Await human prioritization",
      reasoning: "The automated workflow identified the conflict but does not own the user's preference over feasibility versus ambition.",
      alternativeConsidered: "Letting the planner choose the tradeoff alone was rejected.",
      handoffTo: "Human-in-the-Loop",
      confidence: "human_authority"
    });
    publishHandoff(state, {
      from: "Constraint & Risk Checker",
      to: "Human-in-the-Loop",
      packetType: "prioritization_request",
      summary: report.prioritizationPrompt,
      authority: "Constraint & Risk Checker may surface a value-laden tradeoff but not resolve it automatically."
    });
    transition(state, "awaiting_prioritization", "Goal and resource tradeoff requires human choice.", "Constraint & Risk Checker");
    state.runSummary = buildRunSummary(state, "human_prioritization_required");
    updateAvailableActions(state);
    return state;
  }

  transition(state, "plan_composition_active", "Constraint report cleared planning.", "Constraint & Risk Checker");
  const plan = composePlan(profile, report);
  state.currentPlan = plan;
  addEntry(state, {
    actor: "Plan Composer",
    title: "Plan Composer",
    items: [
      "Draft plan package created after constraint checks passed.",
      "Draft contains nutrition strategy, workout strategy, weekly schedule, adherence supports, rationale, and warnings.",
      "Package is passed forward for review rather than delivered directly."
    ],
    authority: "Draft the first-pass plan package once the controller authorizes planning.",
    decision: "Publish draft package for review",
    reasoning: "Composition is allowed only after missing information, boundary checks, and blocking tradeoffs have been resolved or surfaced.",
    alternativeConsidered: "Delivering the first draft directly to the user without review was rejected.",
    handoffTo: "Review & Adaptation Agent",
    confidence: "medium"
  });
  publishHandoff(state, {
    from: "Plan Composer",
    to: "Review & Adaptation Agent",
    packetType: "draft_plan_package",
    summary: "First-pass non-clinical plan package prepared for audit before user delivery.",
    authority: "Plan Composer may draft but not release the package."
  });

  transition(state, "review_active", "Draft passed to review.", "Plan Composer");
  const reviewAssessment = reviewPlan(profile, report, plan);
  let reviewedPlan;

  if (reviewAssessment.revised) {
    addEntry(state, {
      actor: "Review & Adaptation Agent",
      title: "Review & Adaptation Agent",
      items: reviewAssessment.requestNotes,
      authority: "Approve the draft, revise it before release, or send back a bounded change request.",
      decision: "Request bounded rewrite before approval",
      reasoning: "The reviewer judged the first draft as too burdensome to release unchanged, so the next step is a visible rewrite request rather than a silent inline edit.",
      alternativeConsidered: "Passing the first draft through unchanged was rejected.",
      handoffTo: "Plan Composer",
      confidence: "medium"
    });
    publishHandoff(state, {
      from: "Review & Adaptation Agent",
      to: "Plan Composer",
      packetType: "rewrite_request",
      summary: "Bounded rewrite request: reduce weekday burden and increase adherence support before release.",
      authority: "Review may reject the current draft and request a constrained rewrite."
    });
    transition(state, "plan_composition_active", "Reviewer requested a bounded rewrite before approval.", "Review & Adaptation Agent");

    const recomposedPlan = applyComposerRevision(profile, report, plan, reviewAssessment.rewriteKind);
    state.currentPlan = recomposedPlan;
    addEntry(state, {
      actor: "Plan Composer",
      title: "Plan Composer",
      items: [
        "The Plan Composer received a bounded rewrite request from review and revised the draft accordingly.",
        ...reviewAssessment.composerNotes
      ],
      authority: "Rewrite the draft only within the bounded changes requested by review.",
      decision: "Publish revised draft package",
      reasoning: "The composer revised weekday load and adherence supports without changing the accepted hard constraints or non-clinical scope.",
      alternativeConsidered: "Restarting intake or ignoring the review guidance was rejected.",
      handoffTo: "Review & Adaptation Agent",
      confidence: "medium"
    });
    publishHandoff(state, {
      from: "Plan Composer",
      to: "Review & Adaptation Agent",
      packetType: "revised_draft_package",
      summary: "Revised draft returned after reducing weekday load and improving fallback supports.",
      authority: "Plan Composer may answer only the bounded rewrite request it received."
    });
    transition(state, "review_active", "Revised draft returned to review for approval.", "Plan Composer");
    reviewedPlan = finalizeReviewedPlan(profile, report, recomposedPlan, {
      revised: true,
      notes: reviewAssessment.finalNotes,
      changes: reviewAssessment.finalChanges
    });

    addEntry(state, {
      actor: "Review & Adaptation Agent",
      title: "Review & Adaptation Agent",
      items: reviewedPlan.notes,
      authority: "Approve the rewritten draft once the bounded issues have been resolved.",
      decision: "Approve rewritten draft as reviewed package",
      reasoning: "The revised draft now fits the adherence concerns closely enough to release while preserving the original hard constraints.",
      alternativeConsidered: "Requesting another rewrite before user inspection was rejected.",
      handoffTo: "Human-in-the-Loop",
      confidence: "medium"
    });
    publishHandoff(state, {
      from: "Review & Adaptation Agent",
      to: "Human-in-the-Loop",
      packetType: "reviewed_package",
      summary: "Reviewed package approved after visible reviewer-composer disagreement and rewrite.",
      authority: "Review owns release approval before the human acceptance checkpoint."
    });
  } else {
    reviewedPlan = finalizeReviewedPlan(profile, report, plan, {
      revised: false,
      notes: reviewAssessment.finalNotes,
      changes: reviewAssessment.finalChanges
    });

    addEntry(state, {
      actor: "Review & Adaptation Agent",
      title: "Review & Adaptation Agent",
      items: reviewedPlan.notes,
      authority: "Approve the draft, revise it before release, or send back a bounded change request.",
      decision: "Approve draft as reviewed",
      reasoning: "The draft already fits the current hard constraints, adherence concerns, and non-clinical boundary closely enough to release.",
      alternativeConsidered: "An unnecessary extra rewrite was rejected.",
      handoffTo: "Human-in-the-Loop",
      confidence: "high"
    });
    publishHandoff(state, {
      from: "Review & Adaptation Agent",
      to: "Human-in-the-Loop",
      packetType: "reviewed_package",
      summary: "Reviewed package approved without requiring an extra rewrite.",
      authority: "Review owns release approval before the human acceptance checkpoint."
    });
  }

  state.currentPlan = reviewedPlan.plan;
  state.reviewNotes = reviewedPlan.notes;
  state.outputLabel = "Reviewed baseline plan";
  state.outputChanges = reviewedPlan.changes;
  recordPlanVersion(state, state.outputLabel, state.currentPlan, state.outputChanges);

  setStatus(
    state,
    "ok",
    reviewedPlan.revised ? "Plan approved after review-driven rewrite." : "Plan approved."
  );

  addEntry(state, {
    actor: "Controller",
    title: "Final Output",
    items: [
      `Version ${state.version} plan ready.`,
      "Reviewed plan package returned to the user interface.",
      "The workflow now waits for the user's post-review decision."
    ],
    authority: "Expose the reviewed package only after the authorized review outcome is available.",
    decision: "Wait for user inspection",
    reasoning: "The reviewed package is ready, but completion authority remains with the human user.",
    alternativeConsidered: "Completing the session automatically after review was rejected.",
    handoffTo: "Human-in-the-Loop",
    confidence: "high"
  });
  publishHandoff(state, {
    from: "Controller",
    to: "Human-in-the-Loop",
    packetType: "decision_checkpoint",
    summary: "Reviewed package and trace returned to the user for explicit acceptance or bounded revision.",
    authority: "Controller may expose the approved package but not accept it on the user's behalf."
  });

  state.awaitingUserDecision = true;
  transition(state, "awaiting_user_acceptance", "Reviewed package ready for user inspection.", "Review & Adaptation Agent");
  state.runSummary = buildRunSummary(state, "reviewed_plan_ready");
  updateAvailableActions(state);
  return state;
}

function runAdaptation(state, feedbackInput = {}) {
  if (!state.currentPlan || !state.profile.goal) {
    setStatus(state, "warn", "Run the workflow first, then apply post-acceptance feedback.");
    updateAvailableActions(state);
    return state;
  }

  if (!(state.protocolState === "completed" && state.accepted)) {
    setStatus(state, "warn", "Accept the reviewed plan before simulating post-execution feedback.");
    updateAvailableActions(state);
    return state;
  }

  state.version += 1;
  transition(state, "adaptation_active", "Execution feedback triggered a revision cycle.", "Human-in-the-Loop");

  const normalizedFeedback = normalizeFeedbackInput(feedbackInput);
  const feedback = buildExecutionFeedbackMessage(normalizedFeedback);
  state.feedbackLog.push(feedback);
  state.lastFeedbackInput = normalizedFeedback;
  state.lastDecision = "post_execution_feedback";
  state.accepted = false;
  state.awaitingUserDecision = true;

  addEntry(state, {
    actor: "Human-in-the-Loop",
    title: "User Feedback",
    items: [feedback],
    authority: "Report real execution evidence after trying the accepted plan.",
    decision: "Reopen the workflow with execution feedback",
    reasoning: "The user observed a real-world mismatch between the accepted plan and execution reality.",
    alternativeConsidered: "Keeping the accepted package unchanged despite execution failure was rejected.",
    handoffTo: "Review & Adaptation Agent",
    confidence: "human_authority"
  });
  publishHandoff(state, {
    from: "Human-in-the-Loop",
    to: "Review & Adaptation Agent",
    packetType: "execution_feedback",
    summary: feedback,
    authority: "The human may reopen the workflow with structured execution evidence after trying the plan."
  });

  const adaptation = applyAdaptationFromFeedback(state.currentPlan, normalizedFeedback);
  state.currentPlan = enrichPlanArtifact(adaptation.plan, state.profile, state.constraintReport, {
    lowPrep: normalizedFeedback.category === "meal_prep" || normalizedFeedback.category === "time_overload",
    veryShort: normalizedFeedback.category === "motivation_drop" || normalizedFeedback.category === "time_overload",
    conservative: normalizedFeedback.category === "symptom_concern",
    symptomCautious: normalizedFeedback.category === "symptom_concern",
    includeSubstitution: normalizedFeedback.category === "general"
  });
  state.reviewNotes = adaptation.reviewNotes;
  state.outputLabel = "Adapted reviewed plan";
  state.outputChanges = adaptation.outputChanges;
  recordPlanVersion(state, state.outputLabel, state.currentPlan, state.outputChanges, normalizedFeedback);

  addEntry(state, {
    actor: "Review & Adaptation Agent",
    title: "Review & Adaptation Agent",
    items: state.reviewNotes,
    authority: "Revise the previously accepted package while preserving goal, constraints, and traceable context.",
    decision: "Adapt reviewed package",
    reasoning: "The adaptation agent disagreed with keeping the previously accepted package unchanged after execution evidence showed it was no longer feasible.",
    alternativeConsidered: "Restarting the whole workflow from scratch or silently keeping the old plan was rejected.",
    handoffTo: "Human-in-the-Loop",
    confidence: "medium"
  });
  publishHandoff(state, {
    from: "Review & Adaptation Agent",
    to: "Human-in-the-Loop",
    packetType: "adapted_package",
    summary: "Adapted reviewed package returned after preserving hard constraints and updating the failed sections.",
    authority: "Review & Adaptation may revise the accepted package but still returns it for fresh human inspection."
  });
  addEntry(state, {
    actor: "Controller",
    title: "Adapted Output",
    items: [
      `Version ${state.version} adapted plan package ready.`,
      "State-preserving revision applied after execution feedback.",
      "The revised package is ready for user inspection."
    ],
    authority: "Return the adapted package for renewed human inspection rather than auto-completing the session.",
    decision: "Wait for post-adaptation user inspection",
    reasoning: "Adaptation changed the package materially, so the user must inspect the revised version explicitly.",
    alternativeConsidered: "Marking the adapted package as accepted automatically was rejected.",
    handoffTo: "Human-in-the-Loop",
    confidence: "high"
  });

  setStatus(state, "ok", "Plan adapted using preserved session state.");
  transition(state, "awaiting_user_acceptance", "Adapted package returned for user inspection.", "Review & Adaptation Agent");
  state.runSummary = buildRunSummary(state, "adapted_plan_ready");
  updateAvailableActions(state);
  return state;
}

function acceptPlan(state) {
  if (!state.currentPlan || !state.awaitingUserDecision) {
    setStatus(state, "warn", "Run the workflow and wait for a reviewed package before accepting.");
    updateAvailableActions(state);
    return state;
  }

  state.version += 1;
  state.awaitingUserDecision = false;
  state.accepted = true;
  state.lastDecision = "accepted";

  addEntry(state, {
    actor: "Human-in-the-Loop",
    title: "Human Actor",
    items: [
      "The end user inspected the reviewed package and accepted it.",
      "No further revision was requested at this stage."
    ],
    authority: "Own the final acceptance decision for the reviewed package.",
    decision: "Accept reviewed package",
    reasoning: "The package looks feasible enough to try without another bounded revision.",
    alternativeConsidered: "Requesting another revision was rejected by the human at this checkpoint.",
    handoffTo: "Controller",
    confidence: "human_authority"
  });
  publishHandoff(state, {
    from: "Human-in-the-Loop",
    to: "Controller",
    packetType: "acceptance_decision",
    summary: "The end user accepted the current reviewed package for execution.",
    authority: "Only the human can grant final acceptance."
  });
  addEntry(state, {
    actor: "Controller",
    title: "Completed",
    items: [
      `Version ${state.version} marked as accepted.`,
      "The workflow entered a completed state after user approval."
    ],
    authority: "Close the session only after the user has accepted the current reviewed package.",
    decision: "Mark session completed",
    reasoning: "The human has exercised final approval authority, so the controller can close the current planning cycle.",
    alternativeConsidered: "Keeping the session open without need was rejected.",
    handoffTo: "Completed state",
    confidence: "high"
  });

  setStatus(state, "ok", "Plan accepted by the user.");
  transition(state, "completed", "User accepted the reviewed package.", "Human-in-the-Loop");
  state.runSummary = buildRunSummary(state, "accepted");
  updateAvailableActions(state);
  return state;
}

function requestRevision(state) {
  if (!state.currentPlan || !state.awaitingUserDecision) {
    setStatus(state, "warn", "Run the workflow and wait for a reviewed package before requesting revision.");
    updateAvailableActions(state);
    return state;
  }

  if (state.revisionCount >= state.maxRevisionRounds) {
    setStatus(state, "warn", "The bounded demo supports one additional revision round before acceptance.");
    updateAvailableActions(state);
    return state;
  }

  state.version += 1;
  state.revisionCount += 1;
  state.accepted = false;
  state.lastDecision = "revision_requested";
  transition(state, "review_active", "User requested one more revision.", "Human-in-the-Loop");

  addEntry(state, {
    actor: "Human-in-the-Loop",
    title: "Human Actor",
    items: [
      "The end user inspected the reviewed package and requested one more revision before accepting it.",
      "The user indicated that weekday effort and meal-prep burden should be reduced further."
    ],
    authority: "Reject automatic completion and request one more bounded revision.",
    decision: "Request bounded revision",
    reasoning: "The user judged the reviewed package as still too burdensome to accept unchanged.",
    alternativeConsidered: "Accepting the package despite remaining burden was rejected.",
    handoffTo: "Review & Adaptation Agent",
    confidence: "human_authority"
  });
  publishHandoff(state, {
    from: "Human-in-the-Loop",
    to: "Review & Adaptation Agent",
    packetType: "revision_request",
    summary: "User rejected the current package and requested one more bounded revision.",
    authority: "The human may reopen review one final time before acceptance."
  });

  addEntry(state, {
    actor: "Review & Adaptation Agent",
    title: "Review & Adaptation Agent",
    items: [
      "User-requested revision triggered after inspection of the reviewed package.",
      "Weekday effort and prep burden should be reduced further before the package is returned.",
      "The rewrite must preserve the original hard constraints and non-clinical boundary."
    ],
    authority: "Turn the user's disagreement into a bounded rewrite request rather than silently editing the package in place.",
    decision: "Request bounded rewrite after user disagreement",
    reasoning: "The reviewer agreed with the user's concern that weekday burden and prep friction still needed to be reduced before acceptance, but the rewrite should remain visible as a separate Plan Composer step.",
    alternativeConsidered: "Keeping the prior reviewed package unchanged was rejected.",
    handoffTo: "Plan Composer",
    confidence: "medium"
  });
  publishHandoff(state, {
    from: "Review & Adaptation Agent",
    to: "Plan Composer",
    packetType: "user_aligned_rewrite_request",
    summary: "Visible rewrite request translating user disagreement into bounded composer changes.",
    authority: "Review may transform user feedback into a constrained rewrite scope."
  });
  transition(state, "plan_composition_active", "Review translated the user's disagreement into a bounded rewrite request.", "Review & Adaptation Agent");

  state.currentPlan = applyComposerRevision(state.profile, state.constraintReport, state.currentPlan, "user_revision");
  addEntry(state, {
    actor: "Plan Composer",
    title: "Plan Composer",
    items: [
      "The Plan Composer received the bounded rewrite request and reduced weekday effort further.",
      "Fallback options and low-prep supports were expanded before returning the draft to review."
    ],
    authority: "Rewrite the draft within the bounded changes requested by the user-facing review checkpoint.",
    decision: "Publish user-requested revised draft",
    reasoning: "The composer reduced burden without changing hard constraints or the non-clinical scope.",
    alternativeConsidered: "Restarting the session from intake was rejected.",
    handoffTo: "Review & Adaptation Agent",
    confidence: "medium"
  });
  publishHandoff(state, {
    from: "Plan Composer",
    to: "Review & Adaptation Agent",
    packetType: "user_requested_revised_draft",
    summary: "Revised draft returned after reducing weekday effort and increasing fallback supports again.",
    authority: "Plan Composer may respond to the user-aligned rewrite request."
  });
  transition(state, "review_active", "User-requested rewritten draft returned to review.", "Plan Composer");

  state.reviewNotes = [
    "User-requested revision triggered after inspection of the reviewed package.",
    "Weekday effort and prep burden were reduced further before acceptance.",
    "The revised package preserved the original hard constraints."
  ];
  state.outputLabel = "User-requested revised plan";
  state.outputChanges = [
    "The end user requested one more revision before accepting the plan.",
    "Weekday sessions were shortened again and fallback options were expanded.",
    "Hard constraints and non-clinical boundaries remained unchanged."
  ];
  recordPlanVersion(state, state.outputLabel, state.currentPlan, state.outputChanges);

  addEntry(state, {
    actor: "Review & Adaptation Agent",
    title: "Review & Adaptation Agent",
    items: state.reviewNotes,
    authority: "Approve the rewritten draft once the requested burden reduction is visible.",
    decision: "Approve revised draft after user-requested rewrite",
    reasoning: "The revised package now addresses the user's concern closely enough to return for final inspection.",
    alternativeConsidered: "Keeping the prior reviewed package unchanged was rejected.",
    handoffTo: "Human-in-the-Loop",
    confidence: "medium"
  });
  publishHandoff(state, {
    from: "Review & Adaptation Agent",
    to: "Human-in-the-Loop",
    packetType: "revised_reviewed_package",
    summary: "User-requested revised package approved and returned for the final inspection checkpoint.",
    authority: "Review may approve the rewritten draft but still cannot auto-accept it."
  });
  addEntry(state, {
    actor: "Controller",
    title: "Revised Output",
    items: [
      `Version ${state.version} revised package returned after a user-requested revision.`,
      "The workflow remains inspectable because the user decision and resulting revision are both visible."
    ],
    authority: "Return the revised package for a fresh human decision checkpoint.",
    decision: "Wait for renewed user inspection",
    reasoning: "A user-requested revision changes the package materially and should not bypass inspection.",
    alternativeConsidered: "Auto-accepting the revised package was rejected.",
    handoffTo: "Human-in-the-Loop",
    confidence: "high"
  });

  setStatus(state, "ok", "Plan revised after a visible user-requested rewrite cycle.");
  state.awaitingUserDecision = true;
  transition(state, "awaiting_user_acceptance", "Revised package returned for final user inspection.", "Review & Adaptation Agent");
  state.runSummary = buildRunSummary(state, "revised_plan_ready");
  updateAvailableActions(state);
  return state;
}

function renderablePlanSections(state) {
  if (!state.currentPlan) {
    return [];
  }

  const plan = state.currentPlan;
  const nextSteps = buildNextStepGuidance(state);
  return [
    ["Package", {
      intro: plan.artifactTitle || state.outputLabel || "Reviewed plan",
      items: [
        `Artifact status: ${state.outputLabel || "Reviewed plan"}`,
        "Intended use: direct user execution plus optional inspection by a trainer, dietitian, or referring provider.",
        `Current protocol state: ${state.protocolState}`
      ]
    }],
    ["User profile this package fits", plan.profileSummary || []],
    ["Nutrition strategy", plan.nutritionStrategy],
    ["Sample meal pattern", plan.sampleMealPattern || []],
    ["Grocery focus", plan.groceryFocus || []],
    ["Workout strategy", plan.workoutStrategy],
    ["Session blueprint", plan.sessionBlueprint || []],
    ["Weekly schedule", {
      intro: plan.weeklySchedule,
      items: plan.weeklyScheduleDetails || []
    }],
    ["Adherence supports", plan.adherenceSupportList || []],
    ["Operational handoff note", buildOperationalHandoffNote(state)],
    ["Key changes after review", state.outputChanges.length ? state.outputChanges : ["No substantive changes captured."]],
    ["Rationale", plan.rationale.join(" | ")],
    ["Warnings", plan.warnings.join(" | ")],
    ["Next-step guidance", nextSteps]
  ];
}

function summarizeState(state) {
  return {
    appVersion: state.appVersion,
    version: state.version,
    protocolState: state.protocolState,
    status: state.status,
    awaitingUserDecision: state.awaitingUserDecision,
    accepted: state.accepted,
    lastDecision: state.lastDecision,
    revisionCount: state.revisionCount,
    missingFields: state.missingFields,
    availableActions: state.availableActions,
    runSummary: state.runSummary,
    planVersionCount: state.planHistory.length,
    handoffCount: state.handoffLedger.length,
    traceLength: state.trace.length,
    transitionCount: state.transitions.length
  };
}

function detectMissingFields(profile) {
  const missing = [];
  if (!profile.goal) missing.push("goal");
  if (!profile.trainingDays) missing.push("training days");
  if (!profile.equipment) missing.push("equipment");
  if (profile.symptomTriggers && isAmbiguousSymptoms(profile.symptomTriggers)) {
    missing.push("specific symptom-trigger details");
  }
  return missing;
}

function isAmbiguousSymptoms(text) {
  const lower = text.toLowerCase();
  const ambiguitySignals = [
    "issues",
    "react",
    "problem",
    "feel bad",
    "sometimes",
    "upset",
    "not sure",
    "certain foods"
  ];
  const specificitySignals = [
    "causes",
    "triggered by",
    "after eating",
    "confirmed",
    "allergic to",
    "intolerance"
  ];

  return ambiguitySignals.some((signal) => lower.includes(signal))
    && !specificitySignals.some((signal) => lower.includes(signal));
}

function analyzeMedicalBoundary(profile) {
  const q = `${profile.userQuestion} ${profile.symptomTriggers} ${profile.bodyContext}`.toLowerCase();
  const directTerms = [
    "diagnose",
    "diagnosis",
    "disease",
    "medication",
    "medicine",
    "prescription",
    "drug",
    "treatment",
    "dose",
    "dosage"
  ];
  const interventionPhrases = [
    "what should i take",
    "what can i take",
    "should i take",
    "can i take",
    "what should i use",
    "what can i use",
    "should i use",
    "can i use",
    "need to take",
    "take before workouts",
    "take before workout"
  ];
  const diagnosticPhrases = [
    "does this mean i have",
    "do these mean i have",
    "is this a",
    "is it a",
    "what condition is this",
    "what is causing",
    "why do i have",
    "could this be"
  ];
  const symptomSignals = [
    "hives",
    "rash",
    "swelling",
    "itch",
    "reaction",
    "symptom",
    "symptoms",
    "pain",
    "stomach pain",
    "allergy",
    "allergic"
  ];
  const recurrenceSignals = [
    "coming back",
    "keeps coming back",
    "keeps happening",
    "recurring",
    "again and again"
  ];

  const reasons = [];
  const matchedDirectTerms = directTerms.filter((term) => q.includes(term));
  const matchedIntervention = interventionPhrases.filter((phrase) => q.includes(phrase));
  const matchedDiagnostic = diagnosticPhrases.filter((phrase) => q.includes(phrase));
  const hasSymptomConcern = symptomSignals.some((term) => q.includes(term));
  const hasRecurrenceConcern = recurrenceSignals.some((term) => q.includes(term));

  if (matchedDirectTerms.length) {
    reasons.push(`direct medical-language match: ${matchedDirectTerms.join(", ")}`);
  }
  if (matchedDiagnostic.length && hasSymptomConcern) {
    reasons.push("diagnostic intent paired with symptom language");
  }
  if (matchedIntervention.length && (hasSymptomConcern || hasRecurrenceConcern)) {
    reasons.push("treatment-seeking intent paired with symptom or recurrence language");
  }

  return {
    triggered: reasons.length > 0,
    reasons: reasons.length ? reasons : ["no medical-boundary trigger"],
    reasoning: reasons.length
      ? "The request combines symptom or recurrence language with diagnostic or intervention intent, so the workflow should stop rather than improvise health advice."
      : "No medical-boundary trigger detected.",
    confidence: matchedDirectTerms.length ? "high" : "medium"
  };
}

function deriveHardConstraints(profile) {
  const hard = [];
  if (profile.dietaryRestrictions) hard.push(profile.dietaryRestrictions);
  if (profile.symptomTriggers) hard.push(`avoid known triggers: ${profile.symptomTriggers}`);
  if (profile.trainingDays) {
    const dayLabel = Number(profile.trainingDays) === 1 ? "training day" : "training days";
    hard.push(`${profile.trainingDays} ${dayLabel}`);
  }
  if (profile.equipment) {
    const equipmentLabel = profile.equipment.endsWith("only") ? profile.equipment : `${profile.equipment} only`;
    hard.push(equipmentLabel);
  }
  return hard;
}

function deriveSoftConstraints(profile) {
  const soft = [];
  if (profile.adherenceConcerns) soft.push(profile.adherenceConcerns);
  if (profile.budget) soft.push(`${profile.budget} budget`);
  return soft;
}

function trainingDayCount(profile) {
  const parsed = Number(profile.trainingDays);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function safeConstraintText(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

function summarizeTriggerText(value) {
  const raw = safeConstraintText(value, "known trigger foods");
  const simplified = raw.split(/\b(?:causes?|triggered by|after eating|makes me|lead to|leads to|gives me)\b/i)[0].trim();
  return simplified || raw;
}

function splitSupportText(text) {
  return text
    .split(/,| and /)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildArtifactTitle(profile) {
  const dayCount = trainingDayCount(profile) || 1;
  const dayLabel = dayCount === 1 ? "training day" : "training days";
  return `Reviewed ${safeConstraintText(profile.goal, "fitness")} plan for ${dayCount} ${dayLabel} using ${safeConstraintText(profile.equipment, "available equipment")}`;
}

function buildProfileSummary(profile, constraintReport) {
  const dayCount = trainingDayCount(profile);
  const items = [
    `Primary goal: ${safeConstraintText(profile.goal, "not specified")}`,
    `Body context shared: ${safeConstraintText(profile.bodyContext, "none supplied")}`,
    `Training availability: ${dayCount ? `${dayCount} ${dayCount === 1 ? "day" : "days"} per week` : "not specified"}`,
    `Equipment available: ${safeConstraintText(profile.equipment, "not specified")}`,
    `Dietary restriction to preserve: ${safeConstraintText(profile.dietaryRestrictions, "none stated")}`,
    `Known trigger information: ${safeConstraintText(profile.symptomTriggers, "no trigger list supplied")}`,
    `Adherence priority: ${safeConstraintText(profile.adherenceConcerns, "general sustainability")}`,
    `Budget assumption: ${safeConstraintText(profile.budget, "not specified")}`
  ];

  if (constraintReport?.hardConstraints?.length) {
    items.push(`Hard constraints preserved: ${constraintReport.hardConstraints.join("; ")}`);
  }
  if (constraintReport?.softConstraints?.length) {
    items.push(`Soft constraints prioritized: ${constraintReport.softConstraints.join("; ")}`);
  }
  return items;
}

function buildSampleMealPattern(profile, options = {}) {
  const lowPrep = options.lowPrep || false;
  const symptomCautious = options.symptomCautious || false;
  const restrictionText = safeConstraintText(profile.dietaryRestrictions, "constraint-aware");
  const triggerText = summarizeTriggerText(profile.symptomTriggers);

  return [
    `Breakfast: ${lowPrep ? "a fast repeat option such as eggs, tolerated fruit, and overnight oats" : "a repeatable breakfast such as eggs or overnight oats with tolerated fruit"} that stays within ${restrictionText} limits.`,
    `Lunch: ${lowPrep ? "a simple bowl or leftovers built from one protein, one starch, and one vegetable" : "a rice-or-potato bowl with lean protein and vegetables"} that avoids ${triggerText}.`,
    `Dinner: ${symptomCautious ? "a conservative repeat dinner using already-tolerated ingredients while symptoms stay under review" : "a repeatable dinner bowl or plate using tolerated staples and low-friction prep."}`,
    `Backup option: ${lowPrep ? "keep one no-cook or microwaveable tolerated meal ready for busy weekdays" : "keep one low-effort tolerated backup meal ready if prep capacity drops."}`
  ];
}

function buildGroceryFocus(profile, options = {}) {
  const lowPrep = options.lowPrep || false;
  return [
    `Protein anchor: choose 1 to 2 tolerated proteins that fit ${safeConstraintText(profile.budget, "current")} spending.`,
    "Carb anchor: keep one reliable starch such as rice, potatoes, or oats for repeat meals.",
    `Produce anchor: rely on easy vegetables or fruit that do not conflict with ${summarizeTriggerText(profile.symptomTriggers)}.`,
    lowPrep
      ? "Convenience anchor: keep 1 to 2 low-prep backup foods so the plan survives busy weekdays."
      : "Prep anchor: buy enough repeat staples for one weekday rhythm plus one weekend reset."
  ];
}

function buildNutritionBudgetPhrase(profile) {
  if (profile.budget === "high") {
    return "higher-variety grocery options";
  }
  if (profile.budget === "medium") {
    return "moderate-cost grocery items";
  }
  if (profile.budget === "low") {
    return "budget-conscious grocery choices";
  }
  return "repeatable grocery choices";
}

function buildDinnerExample(profile) {
  if (profile.dietaryRestrictions) {
    return "a repeatable dinner bowl built around tolerated ingredients";
  }
  return "a repeatable dinner bowl built around easy staple ingredients";
}

function buildWorkoutExampleSplit(profile) {
  if (profile.equipment === "bodyweight only") {
    return "squat and split-squat work, push-up variations, hinge or bridge work, and a short core finisher";
  }
  if (profile.equipment === "gym access") {
    return "lower-body strength work, upper-body push/pull work, and one full-body conditioning or hypertrophy session";
  }
  return "lower-body band work, upper-body push/pull band work, and one full-body conditioning session";
}

function buildTopLevelWeeklySchedule(profile, options = {}) {
  const lowWeekday = options.lowWeekday || false;
  const dayCount = trainingDayCount(profile) || 1;

  if (!lowWeekday) {
    return dayCount === 1
      ? "1 primary training day plus optional recovery movement across the week"
      : `${dayCount} evenly distributed sessions across the week`;
  }

  if (dayCount === 1) {
    return "1 main weekend session plus optional weekday recovery movement across the week";
  }

  if (dayCount === 2) {
    return "1 lighter weekday session plus 1 more substantial weekend session across 2 total training days";
  }

  return `${dayCount - 1} lighter weekday sessions plus 1 more substantial weekend session across ${dayCount} total training days`;
}

function buildSessionBlueprint(profile, options = {}) {
  const conservative = options.conservative || false;
  const veryShort = options.veryShort || false;
  const equipment = safeConstraintText(profile.equipment, "available equipment");
  if (trainingDayCount(profile) <= 1) {
    return [
      `Primary session: full-body work using ${equipment}, with one squat pattern, one hinge or bridge pattern, one push, one pull, and one core finisher.`,
      conservative
        ? "Optional recovery slot: gentle walking or mobility only if energy and symptoms feel stable."
        : "Optional support slot: easy walking or mobility on non-training days to preserve consistency."
    ];
  }

  return [
    `Session A: lower-body emphasis plus upper-body push work using ${equipment}${veryShort ? " in a minimum-viable format" : ""}.`,
    `Session B: pull, hinge, and core emphasis using ${equipment}${veryShort ? " with a short restart-friendly structure" : ""}.`,
    conservative
      ? "Session C: conservative full-body check-in with low-to-moderate effort and explicit symptom stop rules."
      : "Session C: full-body conditioning or mixed session that consolidates the week's work without violating hard constraints."
  ];
}

function buildWeeklyScheduleDetails(profile, options = {}) {
  const conservative = options.conservative || false;
  const veryShort = options.veryShort || false;
  const includeLowPrep = options.lowPrep || false;
  const includeSubstitution = options.includeSubstitution || false;
  const dayCount = trainingDayCount(profile);

  if (dayCount <= 1) {
    return [
      conservative
        ? "Primary day: 25-35 minutes of conservative full-body training plus a short symptom check before intensity increases."
        : "Primary day: 35-45 minutes of full-body training plus one short prep block for repeat meals.",
      "Optional extra day: 10-20 minutes of walking or mobility if energy allows."
    ];
  }

  if (dayCount === 2) {
    return [
      `Day 1: ${veryShort ? "15-20" : "20-30"} minutes focused on lower body and push work, followed by a simple tolerated lunch reset.`,
      `Day 2: ${conservative ? "20-25" : "30-40"} minutes focused on pull, core, and full-body conditioning, paired with a grocery or prep reset.`,
      includeSubstitution ? "Busy-week fallback: if one day collapses, preserve one priority session and one short walking block instead of quitting the plan." : "Fallback: if one session is missed, preserve one priority session and one short walking block."
    ];
  }

  if (dayCount >= 4) {
    const dayEntries = Array.from({ length: dayCount }, (_, index) => {
      if (index === dayCount - 1) {
        return conservative
          ? `Day ${index + 1}: flexible weekend session with conservative full-body work, symptom monitoring, and no pressure to escalate intensity.`
          : `Day ${index + 1}: more substantial weekend full-body session plus a short weekly reset for recovery and planning.`;
      }

      if (index % 2 === 0) {
        return `Day ${index + 1}: ${veryShort ? "15-20" : "20-25"} minute session centered on lower body and push work.`;
      }

      return `Day ${index + 1}: ${veryShort ? "15-20" : "20-25"} minute session centered on pull, hinge, and core work.`;
    });

    return [
      ...dayEntries,
      includeLowPrep ? "Meal rhythm: keep weekday meals repetitive and shift most prep work to the weekend." : "Meal rhythm: repeat a few reliable meals instead of reinventing the plan each day.",
      includeSubstitution ? "Busy-week substitution: if one weekday collapses, swap in a shorter fallback block rather than skipping the whole week." : "Fallback: replace any missed weekday session with a short walk or minimum-viable reset instead of abandoning the package."
    ];
  }

  return [
    `Day 1: ${veryShort ? "15-20" : "20-25"} minute weekday session centered on lower body and push work.`,
    `Day 2: ${veryShort ? "15-20" : "20-25"} minute weekday session centered on pull, hinge, and core work.`,
    conservative
      ? "Day 3: flexible weekend session with conservative full-body work, symptom monitoring, and no pressure to escalate intensity."
      : "Day 3: longer weekend full-body session plus a weekly reset for meal prep and recovery.",
    includeLowPrep ? "Meal rhythm: keep weekday meals repetitive and shift most prep work to the weekend." : "Meal rhythm: repeat a few reliable meals instead of reinventing the plan each day.",
    includeSubstitution ? "Busy-week substitution: if one weekday collapses, swap in a shorter fallback block rather than skipping the whole week." : "Fallback: replace any missed weekday session with a short walk or minimum-viable reset instead of abandoning the package."
  ];
}

function enrichPlanArtifact(plan, profile, constraintReport, options = {}) {
  const enriched = { ...plan };
  enriched.artifactTitle = buildArtifactTitle(profile);
  enriched.profileSummary = buildProfileSummary(profile, constraintReport);
  enriched.sampleMealPattern = buildSampleMealPattern(profile, options);
  enriched.groceryFocus = buildGroceryFocus(profile, options);
  enriched.sessionBlueprint = buildSessionBlueprint(profile, options);
  enriched.weeklyScheduleDetails = buildWeeklyScheduleDetails(profile, options);
  enriched.adherenceSupportList = splitSupportText(enriched.adherenceSupports);
  return enriched;
}

function buildNextStepGuidance(state) {
  if (state.awaitingUserDecision) {
    return [
      "Inspect the reviewed package section-by-section before deciding whether it is realistic enough to accept.",
      "If the plan still feels off, use the one bounded revision request instead of silently editing constraints in your head.",
      "If you accept the plan and it later fails in practice, capture execution feedback and reopen the workflow through adaptation."
    ];
  }
  if (state.protocolState === "completed" && state.accepted) {
    return [
      "This reviewed package has been accepted for use.",
      "Use the Post-Acceptance Feedback Input if execution fails, motivation drops, prep burden is too high, or symptom concerns become unclear.",
      "Seek qualified professional guidance instead of using this artifact for diagnosis, prescription, or treatment decisions."
    ];
  }
  return [
    "Use the visible checkpoint and trace to determine whether the workflow is waiting on clarification, prioritization, or acceptance.",
    "Do not treat the package as final until the current checkpoint is resolved."
  ];
}

function buildConstraintReport(profile) {
  const report = {
    hardConstraints: deriveHardConstraints(profile),
    softConstraints: deriveSoftConstraints(profile),
    detectedConflicts: [],
    escalationNeeded: false,
    escalationReason: null,
    prioritizationPrompt: ""
  };

  if (profile.goal === "muscle gain" && Number(profile.trainingDays) <= 1 && profile.budget === "low") {
    report.detectedConflicts.push("aggressive muscle gain conflicts with low training frequency and low budget");
    report.escalationNeeded = true;
    report.escalationReason = "human_prioritization";
    report.prioritizationPrompt = "Would you rather prioritize a slower but feasible plan, or revise your schedule and budget assumptions?";
    report.prioritizationOptions = buildHumanResolutionOptions(profile);
  }

  return report;
}

function detectSecondaryBlockers(profile) {
  const blockers = [];
  if (profile.goal === "muscle gain" && Number(profile.trainingDays) <= 1 && profile.budget === "low") {
    blockers.push("aggressive muscle gain still conflicts with one training day and a low budget");
  }
  return blockers;
}

function composePlan(profile, constraintReport) {
  const concerns = profile.adherenceConcerns.toLowerCase();
  const lowWeekday = concerns.includes("weekday");
  const weeklySchedule = buildTopLevelWeeklySchedule(profile, { lowWeekday });

  return enrichPlanArtifact({
    nutritionStrategy: `Use a simple ${profile.dietaryRestrictions || "constraint-aware"} meal pattern built around repeatable staples, explicit avoidance of known triggers, and ${buildNutritionBudgetPhrase(profile)}. Example structure: yogurt-free overnight oats or eggs for breakfast, rice or potatoes with lean protein and vegetables for lunch, and ${buildDinnerExample(profile)}.`,
    workoutStrategy: `Build a ${profile.goal} routine using ${profile.equipment} with intensity bounded by adherence concerns. Example split: ${buildWorkoutExampleSplit(profile)}, with optional walking or mobility finishers when recovery is limited.`,
    weeklySchedule,
    adherenceSupports: "repeat meals, a short grocery list, clear fallback meal options, shorter weekday actions, and a weekend prep block for lower-friction adherence",
    rationale: [
      `The goal of ${profile.goal} shapes calorie and training emphasis.`,
      "Hard constraints from dietary restrictions and equipment were preserved.",
      "The weekly structure was adjusted for adherence concerns."
    ],
    warnings: [
      "This is non-clinical planning support, not diagnosis or treatment."
    ]
  }, profile, constraintReport, {
    lowPrep: concerns.includes("meal-prep"),
    veryShort: false,
    conservative: false
  });
}

function normalizeFeedbackInput(feedbackInput) {
  const category = feedbackInput?.category || "time_overload";
  const notes = (feedbackInput?.notes || "").trim();
  return { category, notes };
}

function buildExecutionFeedbackMessage(feedbackInput) {
  const categoryMessages = {
    time_overload: "After trying the accepted plan, the workouts felt too long to finish consistently after class.",
    meal_prep: "After trying the accepted plan, weekday meal prep was too demanding to sustain.",
    motivation_drop: "After trying the accepted plan, weekday motivation dropped and the routine felt too heavy to restart after missed days.",
    symptom_concern: "After trying the accepted plan, the user reported new or unclear symptom concerns and did not want the system to make medical assumptions.",
    general: "After trying the accepted plan, the user reported that the routine did not fit real-world execution."
  };
  return feedbackInput.notes
    ? `${categoryMessages[feedbackInput.category] || categoryMessages.general} Additional feedback: ${feedbackInput.notes}`
    : (categoryMessages[feedbackInput.category] || categoryMessages.general);
}

function applyAdaptationFromFeedback(currentPlan, feedbackInput) {
  const adaptedPlan = { ...currentPlan };
  const outputChanges = [
    "Original hard constraints and non-clinical scope were preserved during adaptation."
  ];
  const reviewNotes = [
    "Adaptation triggered by post-acceptance execution feedback.",
    "Goal and hard constraints were preserved.",
    "The revised package remains within non-clinical scope."
  ];

  if (feedbackInput.category === "meal_prep") {
    adaptedPlan.weeklySchedule = "2 short weekday sessions plus 1 longer weekend session, with batch-prep meals and low-prep backups.";
    adaptedPlan.adherenceSupports = "Repeatable weekday meals, a weekend prep block, low-prep backup dinners, grocery simplification, and a fallback grab-and-go breakfast list.";
    adaptedPlan.rationale = [
      "Weekday meal-prep friction was reduced after post-execution feedback.",
      "The plan now relies more heavily on repeatable and low-prep meals.",
      "Original hard constraints were preserved during revision."
    ];
    outputChanges.unshift(
      "Meal structure was simplified after the user reported weekday prep failure.",
      "Adherence supports now emphasize low-prep backups and weekend batch prep."
    );
    reviewNotes.push("Meal-prep burden was reduced after the user reported weekday prep failure.");
  } else if (feedbackInput.category === "motivation_drop") {
    adaptedPlan.weeklySchedule = "2 very short weekday sessions, 1 flexible weekend session, and an optional low-pressure recovery walk when energy is low.";
    adaptedPlan.adherenceSupports = "Ultra-short weekday workouts, a restart-friendly fallback plan, optional walk substitutions, and explicit minimum-viable sessions on low-energy days.";
    adaptedPlan.rationale = [
      "The user reported motivation loss after missed or heavy weekdays.",
      "The plan now reduces restart friction with shorter sessions and fallback options.",
      "Original hard constraints were preserved during revision."
    ];
    outputChanges.unshift(
      "Weekday sessions were shortened further after the user reported motivation drop.",
      "Fallback options were expanded so the plan is easier to restart after missed days."
    );
    reviewNotes.push("Weekday workload was reduced to improve restartability after low-motivation periods.");
  } else if (feedbackInput.category === "symptom_concern") {
    adaptedPlan.weeklySchedule = "1 to 2 conservative weekday sessions plus 1 optional weekend session, with the user advised to pause escalation if symptoms feel unclear.";
    adaptedPlan.adherenceSupports = "Conservative intensity, symptom logging, explicit stop-and-consult guidance for unclear reactions, and simplified meal repetition until triggers are clearer.";
    adaptedPlan.warnings = [
      "This is non-clinical planning support, not diagnosis or treatment.",
      "Because the user reported unclear symptom concerns, the plan avoids medical interpretation and recommends professional guidance if symptoms worsen or remain unclear."
    ];
    adaptedPlan.rationale = [
      "The user reported unclear symptom concerns after trying the accepted plan.",
      "The system avoided medical interpretation and shifted toward conservative planning.",
      "Original hard constraints were preserved during revision."
    ];
    outputChanges.unshift(
      "The adapted plan became more conservative after the user reported unclear symptom concerns.",
      "Warnings and adherence guidance now emphasize stopping and seeking qualified help rather than guessing."
    );
    reviewNotes.push("The plan was made more conservative because the user reported unclear symptom concerns.");
  } else if (feedbackInput.category === "general") {
    adaptedPlan.weeklySchedule = "2 short weekday sessions plus 1 longer weekend session, with one optional substitution slot for busy weeks.";
    adaptedPlan.adherenceSupports = "Shorter weekday actions, a simplified fallback schedule, and explicit busy-week substitutions.";
    adaptedPlan.rationale = [
      "General execution friction was reduced after post-acceptance feedback.",
      "The plan now includes a simpler fallback schedule for busy weeks.",
      "Original hard constraints were preserved during revision."
    ];
    outputChanges.unshift(
      "The weekly schedule was simplified after the user reported general execution problems.",
      "Fallback substitutions were added to preserve continuity during busy weeks."
    );
    reviewNotes.push("The plan was simplified after the user reported general execution problems.");
  } else {
    adaptedPlan.weeklySchedule = "2 short weekday sessions plus 1 longer weekend session, with batch-prep meals and low-prep backups.";
    adaptedPlan.adherenceSupports = "Repeatable weekday meals, weekend prep block, shorter weekday workouts, fallback walk option, and a backup low-effort dinner list.";
    adaptedPlan.rationale = [
      "Weekday friction was reduced because the user reported time overload after execution.",
      "Session length was shortened to improve adherence.",
      "Original hard constraints were preserved during revision."
    ];
    outputChanges.unshift(
      "Weekday sessions were shortened after the user reported time overload.",
      "Adherence supports were updated to reduce time burden."
    );
    reviewNotes.push("Workout duration was reduced after the user reported time overload.");
  }

  if (feedbackInput.notes) {
    reviewNotes.push(`Free-text feedback captured for inspection: ${feedbackInput.notes}`);
  }

  return { plan: adaptedPlan, reviewNotes, outputChanges };
}

function reviewPlan(profile, constraintReport, plan) {
  const concerns = profile.adherenceConcerns.toLowerCase();
  const requestNotes = [];
  const composerNotes = [];
  const finalNotes = [];
  const finalChanges = [];
  let revised = false;

  if (concerns.includes("low weekday motivation") || concerns.includes("meal-prep")) {
    requestNotes.push("Reviewer disagreed with the initial weekday burden and requested a bounded rewrite before approval.");
    requestNotes.push("Weekday workload and meal-prep friction should be reduced before the package is released.");
    composerNotes.push("Weekday session load should be reduced and restart-friendly supports strengthened.");
    composerNotes.push("Keep the original hard constraints and non-clinical scope unchanged during the rewrite.");
    finalNotes.push("Reviewer disagreed with the initial weekday burden and sent the draft back for a bounded rewrite.");
    finalNotes.push("The rewritten package reduced weekday workload and meal-prep friction before approval.");
    finalChanges.push("Weekday session load was reduced to improve adherence.");
    finalChanges.push("The workout structure was revised toward shorter weekday sessions and one longer weekend session.");
    finalChanges.push("Adherence supports were strengthened with batch prep and fallback options.");
    revised = true;
  }

  if (!finalChanges.length) {
    finalChanges.push("The draft passed review without substantive revision.");
    finalChanges.push("Hard constraints and non-clinical scope were confirmed before approval.");
  }

  finalNotes.push("The review step checked the draft against hard constraints, adherence fit, and non-clinical scope.");
  finalNotes.push("The reviewed package preserves the original hard constraints while improving deliverability.");
  finalNotes.push("Plan remains within non-clinical scope.");

  return {
    revised,
    rewriteKind: "review_rewrite",
    requestNotes,
    composerNotes,
    finalNotes,
    finalChanges
  };
}

function applyComposerRevision(profile, constraintReport, currentPlan, revisionKind) {
  const revisedPlan = { ...currentPlan };
  const concerns = profile.adherenceConcerns.toLowerCase();

  if (revisionKind === "user_revision") {
    revisedPlan.weeklySchedule = "2 very short weekday sessions, 1 flexible weekend session, and an optional low-pressure recovery walk when energy is low.";
    revisedPlan.workoutStrategy = `Build a ${profile.goal} routine using ${profile.equipment} with ultra-short weekday sessions, one flexible weekend full-body session, and optional recovery walking on low-energy days.`;
    revisedPlan.adherenceSupports = "Ultra-short weekday workouts, a repeatable grocery list, weekend batch prep, low-prep backup meals, and an optional recovery-day fallback.";
    revisedPlan.rationale = [
      "The user asked for an additional revision before accepting the plan.",
      "Weekday workload was reduced again to improve feasibility under low motivation.",
      "Hard constraints and non-clinical scope were preserved during the extra revision."
    ];
    return enrichPlanArtifact(revisedPlan, profile, constraintReport, {
      lowPrep: true,
      veryShort: true,
      conservative: false,
      includeSubstitution: true
    });
  }

  revisedPlan.weeklySchedule = `2 shorter weekday sessions plus 1 longer weekend session across ${profile.trainingDays} total training days`;
  revisedPlan.workoutStrategy = `Build a ${profile.goal} routine using ${profile.equipment} with two short weekday sessions, one longer weekend full-body session, and optional low-pressure walking on tired days.`;
  revisedPlan.adherenceSupports = "repeatable weekday meals, a weekend batch-prep block, shorter weekday workouts, fallback walk options, and low-prep backups";
  revisedPlan.rationale = [
    `The goal of ${profile.goal} shapes calorie and training emphasis.`,
    "The rewrite reduced weekday burden after reviewer feedback.",
    "Hard constraints and non-clinical scope were preserved during the bounded rewrite."
  ];
  return enrichPlanArtifact(revisedPlan, profile, constraintReport, {
    lowPrep: concerns.includes("meal-prep"),
    veryShort: true,
    conservative: false
  });
}

function finalizeReviewedPlan(profile, constraintReport, plan, reviewSummary) {
  return {
    plan: enrichPlanArtifact(plan, profile, constraintReport, {
      lowPrep: profile.adherenceConcerns.toLowerCase().includes("meal-prep"),
      veryShort: profile.adherenceConcerns.toLowerCase().includes("low weekday motivation"),
      conservative: false
    }),
    notes: reviewSummary.notes,
    changes: reviewSummary.changes,
    revised: reviewSummary.revised
  };
}

function clarificationQuestionFor(profile) {
  if (!profile.goal) {
    return "Clarification question: What is your primary goal right now: fat loss, muscle gain, or recomposition?";
  }
  if (!profile.trainingDays) {
    return "Clarification question: How many days per week can you realistically train?";
  }
  if (!profile.equipment) {
    return "Clarification question: What equipment do you consistently have access to?";
  }
  return "Clarification question: Which specific foods or situations have caused reactions before, and are there any professionally confirmed restrictions?";
}

function buildOperationalHandoffNote(state) {
  const latestPacket = state.handoffLedger[state.handoffLedger.length - 1];
  const items = [
    `Current package version: ${state.version}`,
    latestPacket
      ? `Latest handoff packet: ${latestPacket.packetType} from ${latestPacket.from} to ${latestPacket.to}`
      : "No handoff packet has been published yet.",
    state.accepted
      ? "Use case: end-user execution, coach follow-up, or referral-context review after acceptance."
      : "Use case: inspect this package before a coach, dietitian, or referring provider discusses next steps."
  ];

  if (state.lastFeedbackInput?.notes) {
    items.push(`Latest execution note preserved: ${state.lastFeedbackInput.notes}`);
  }

  return items;
}

function hardConstraintPreview(profile) {
  const hard = deriveHardConstraints(profile);
  return hard.length ? hard.join("; ") : "none yet";
}

function addEntry(state, entry) {
  state.trace.push({
    step: state.trace.length + 1,
    protocolState: state.protocolState,
    actor: entry.actor,
    title: entry.title,
    items: [...entry.items],
    authority: entry.authority || null,
    decision: entry.decision || null,
    reasoning: entry.reasoning || null,
    alternativeConsidered: entry.alternativeConsidered || null,
    handoffTo: entry.handoffTo || null,
    confidence: entry.confidence || null
  });
}

function publishHandoff(state, handoff) {
  state.handoffLedger.push({
    packetId: `packet-${state.handoffLedger.length + 1}`,
    protocolState: state.protocolState,
    from: handoff.from,
    to: handoff.to,
    packetType: handoff.packetType,
    summary: handoff.summary,
    authority: handoff.authority
  });
}

function transition(state, to, reason, authorizedBy = null) {
  state.transitions.push({
    step: state.transitions.length + 1,
    from: state.protocolState,
    to,
    reason,
    authorizedBy
  });
  state.protocolState = to;
}

function setStatus(state, kind, message) {
  state.status = { kind, message };
}

function updateAvailableActions(state) {
  const actions = [];
  if (["awaiting_clarification", "awaiting_prioritization"].includes(state.protocolState)) {
    actions.push("continueWorkflow");
    state.availableActions = actions;
    return;
  }
  if (state.protocolState === "completed") {
    if (state.accepted) {
      actions.push("runAdaptation");
    }
    state.availableActions = actions;
    return;
  }
  if (state.currentPlan && state.awaitingUserDecision) {
    actions.push("acceptPlan");
    if (state.revisionCount < state.maxRevisionRounds) {
      actions.push("requestRevision");
    }
  }
  state.availableActions = actions;
}

function buildRunSummary(state, outcome) {
  return {
    outcome,
    hardConstraintCount: state.constraintReport?.hardConstraints?.length || 0,
    softConstraintCount: state.constraintReport?.softConstraints?.length || 0,
    handoffCount: state.handoffLedger.length,
    traceEntries: state.trace.length,
    transitions: state.transitions.length
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function prepareFreshRun(state, profile) {
  state.version += 1;
  state.protocolState = "intake_active";
  state.profile = profile;
  state.missingFields = [];
  state.constraintReport = null;
  state.currentPlan = null;
  state.reviewNotes = [];
  state.feedbackLog = [];
  state.awaitingUserDecision = false;
  state.accepted = false;
  state.lastDecision = null;
  state.revisionCount = 0;
  state.outputLabel = "";
  state.outputChanges = [];
  state.planHistory = [];
  state.handoffLedger = [];
  state.lastFeedbackInput = null;
  state.trace = [];
  state.transitions = [];
  state.runSummary = null;
  setStatus(state, "neutral", "Intake received. Evaluating profile.");
  updateAvailableActions(state);
}

function prepareContinuationRun(state, profile) {
  state.version += 1;
  state.profile = profile;
  state.missingFields = [];
  state.constraintReport = null;
  state.currentPlan = null;
  state.reviewNotes = [];
  state.awaitingUserDecision = false;
  state.accepted = false;
  state.lastDecision = "continued_from_pause";
  state.outputLabel = "";
  state.outputChanges = [];
  state.planHistory = [];
  state.handoffLedger = [];
  state.lastFeedbackInput = null;
  state.runSummary = null;
  setStatus(state, "neutral", "Updated input received. Reevaluating the paused workflow.");
  updateAvailableActions(state);
}

function recordPlanVersion(state, label, plan, changes, feedbackInput = null) {
  state.planHistory.push({
    version: state.version,
    label,
    changes: clone(changes),
    feedbackInput: feedbackInput ? clone(feedbackInput) : null,
    plan: clone(plan)
  });
}

function sameProfile(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function summarizeHumanResponse(protocolState, previousProfile, nextProfile) {
  const changes = [];
  for (const [key, label] of [
    ["goal", "goal"],
    ["bodyContext", "body context"],
    ["trainingDays", "training days"],
    ["equipment", "equipment"],
    ["dietaryRestrictions", "dietary restrictions"],
    ["symptomTriggers", "symptom-trigger details"],
    ["adherenceConcerns", "adherence concerns"],
    ["budget", "budget"],
    ["userQuestion", "user note"]
  ]) {
    if ((previousProfile[key] || "") !== (nextProfile[key] || "")) {
      changes.push(`${label} updated from "${previousProfile[key] || "blank"}" to "${nextProfile[key] || "blank"}"`);
    }
  }

  if (!changes.length) {
    return [
      protocolState === "awaiting_clarification"
        ? "The user attempted to continue without changing the intake."
        : "The user attempted to continue without changing the tradeoff-driving inputs."
    ];
  }

  return [
    protocolState === "awaiting_clarification"
      ? "The user answered the outstanding clarification prompt and resubmitted the intake."
      : "The user revised the intake to resolve the previously escalated tradeoff.",
    ...changes
  ];
}

window.FitnessPlannerEngine = { APP_VERSION, SCENARIOS, createInitialState, createProfile, buildHumanResolutionOptions, continueWorkflow, executeScenario, runWorkflow, runAdaptation, acceptPlan, requestRevision, renderablePlanSections, summarizeState };
})();
