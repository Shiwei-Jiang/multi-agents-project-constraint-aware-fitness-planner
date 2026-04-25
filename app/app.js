const engine = window.FitnessPlannerEngine;

if (!engine) {
  throw new Error("FitnessPlannerEngine failed to load.");
}

const {
  SCENARIOS,
  createInitialState,
  createProfile,
  continueWorkflow,
  executeScenario,
  runWorkflow,
  runAdaptation,
  acceptPlan,
  requestRevision,
  buildHumanResolutionOptions,
  renderablePlanSections
} = engine;

const fields = {
  goal: document.getElementById("goal"),
  bodyContext: document.getElementById("bodyContext"),
  trainingDays: document.getElementById("trainingDays"),
  equipment: document.getElementById("equipment"),
  dietaryRestrictions: document.getElementById("dietaryRestrictions"),
  symptomTriggers: document.getElementById("symptomTriggers"),
  adherenceConcerns: document.getElementById("adherenceConcerns"),
  budget: document.getElementById("budget"),
  userQuestion: document.getElementById("userQuestion")
};
const feedbackFields = {
  category: document.getElementById("feedbackCategory"),
  notes: document.getElementById("feedbackNotes")
};

const scenarioSelect = document.getElementById("scenarioSelect");
const statusCard = document.getElementById("statusCard");
const draftFeedback = document.getElementById("draftFeedback");
const intakePrompt = document.getElementById("intakePrompt");
const checkpointCard = document.getElementById("checkpointCard");
const planSummary = document.getElementById("planSummary");
const changeComparison = document.getElementById("changeComparison");
const workflowLog = document.getElementById("workflowLog");
const stateView = document.getElementById("stateView");
const handoffLedger = document.getElementById("handoffLedger");
const transitionList = document.getElementById("transitionList");
const availableActions = document.getElementById("availableActions");
const stateBadge = document.getElementById("stateBadge");
const resolutionHint = document.getElementById("resolutionHint");
const chooseFeasiblePlanButton = document.getElementById("chooseFeasiblePlan");
const expandResourcesButton = document.getElementById("expandResources");
const buttons = {
  runWorkflow: document.getElementById("runWorkflow"),
  continueWorkflow: document.getElementById("continueWorkflow"),
  runAdaptation: document.getElementById("runAdaptation"),
  acceptPlan: document.getElementById("acceptPlan"),
  requestRevision: document.getElementById("requestRevision"),
  exportTrace: document.getElementById("exportTrace"),
  exportPlan: document.getElementById("exportPlan")
};

const ACTION_LABELS = {
  acceptPlan: "Accept current reviewed package",
  continueWorkflow: "Continue paused workflow after updating the intake",
  runAdaptation: "Use the feedback input and reopen adaptation",
  requestRevision: "Request one bounded revision"
};

let sessionState = createInitialState();

Object.values(fields).forEach((field) => {
  field.addEventListener("input", handleDraftChange);
  field.addEventListener("change", handleDraftChange);
});

document.getElementById("loadScenario").addEventListener("click", () => {
  loadScenario(scenarioSelect.value);
});
document.getElementById("runWorkflow").addEventListener("click", () => {
  sessionState = runWorkflow(buildProfile(), sessionState);
  render();
});
document.getElementById("continueWorkflow").addEventListener("click", () => {
  sessionState = continueWorkflow(buildProfile(), sessionState);
  render();
});
document.getElementById("runAdaptation").addEventListener("click", () => {
  sessionState = runAdaptation(sessionState, buildAdaptationFeedback());
  render();
});
document.getElementById("acceptPlan").addEventListener("click", () => {
  sessionState = acceptPlan(sessionState);
  render();
});
document.getElementById("requestRevision").addEventListener("click", () => {
  sessionState = requestRevision(sessionState);
  render();
});
document.getElementById("exportTrace").addEventListener("click", exportCurrentTrace);
document.getElementById("exportPlan").addEventListener("click", exportPlanSummary);
chooseFeasiblePlanButton.addEventListener("click", applyFeasiblePlanShortcut);
expandResourcesButton.addEventListener("click", applyExpandedResourcesShortcut);

initializeView();

function loadScenario(scenarioId) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return;
  scenarioSelect.value = scenarioId;
  sessionState = createInitialState();
  sessionState.status = {
    kind: "neutral",
    message: `Scenario "${scenario.title}" loaded. Run the workflow to generate fresh evidence.`
  };

  const profile = createProfile(scenario.profile);
  fields.goal.value = profile.goal;
  fields.bodyContext.value = profile.bodyContext;
  fields.trainingDays.value = profile.trainingDays;
  fields.equipment.value = profile.equipment;
  fields.dietaryRestrictions.value = profile.dietaryRestrictions;
  fields.symptomTriggers.value = profile.symptomTriggers;
  fields.adherenceConcerns.value = profile.adherenceConcerns;
  fields.budget.value = profile.budget;
  fields.userQuestion.value = profile.userQuestion;
  applyFeedbackPreset(scenarioId);
  render();
}

function initializeView() {
  const params = new URLSearchParams(window.location.search);
  const initialScenario = params.get("scenario") || "baseline";
  const autorun = params.get("autorun") || "";

  loadScenario(initialScenario);

  if (autorun === "scenario" && SCENARIOS[initialScenario]) {
    sessionState = executeScenario(initialScenario).state;
  } else if (autorun === "workflow" && SCENARIOS[initialScenario]) {
    sessionState = runWorkflow(createProfile(SCENARIOS[initialScenario].profile), createInitialState());
  }

  render();
}

function buildProfile() {
  return createProfile({
    goal: fields.goal.value.trim(),
    bodyContext: fields.bodyContext.value.trim(),
    trainingDays: fields.trainingDays.value.trim(),
    equipment: fields.equipment.value.trim(),
    dietaryRestrictions: fields.dietaryRestrictions.value.trim(),
    symptomTriggers: fields.symptomTriggers.value.trim(),
    adherenceConcerns: fields.adherenceConcerns.value.trim(),
    budget: fields.budget.value.trim(),
    userQuestion: fields.userQuestion.value.trim()
  });
}

function render() {
  const draftAnalysis = analyzeDraft(buildProfile(), sessionState);
  const visibleStatus = deriveVisibleStatus(draftAnalysis);
  statusCard.className = `status ${visibleStatus.kind}`;
  statusCard.textContent = visibleStatus.message;
  renderDraftFeedback(draftAnalysis);
  renderIntakePrompt(draftAnalysis);
  renderCheckpointCard();
  stateBadge.textContent = sessionState.protocolState;
  renderWorkflowLog();
  renderPlanSummary();
  renderChangeComparison();
  renderResolutionOptions(draftAnalysis);
  renderHandoffLedger();
  renderTransitions();
  renderAvailableActions();
  renderActionButtons();
  stateView.textContent = JSON.stringify(sessionState, null, 2);
}

function renderWorkflowLog() {
  workflowLog.innerHTML = "";
  if (!sessionState.trace.length) {
    workflowLog.innerHTML = "<section class='entry'><div class='entry-header'><h3>Workflow trace not started</h3><span class='entry-meta'>interactive preview</span></div><ul><li>Edit the intake fields and watch the live feedback above update immediately.</li><li>Click Run Workflow to convert the current draft into a formal trace and reviewed plan package.</li></ul></section>";
    return;
  }
  sessionState.trace.forEach((entry) => {
    const card = document.createElement("section");
    card.className = "entry";

    const header = document.createElement("div");
    header.className = "entry-header";

    const heading = document.createElement("h3");
    heading.textContent = `${entry.step}. ${entry.title}`;

    const meta = document.createElement("span");
    meta.className = "entry-meta";
    meta.textContent = `${entry.actor} · ${entry.protocolState}`;

    header.appendChild(heading);
    header.appendChild(meta);

    const list = document.createElement("ul");
    entry.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    const details = [];
    if (entry.authority) details.push(`Authority: ${entry.authority}`);
    if (entry.decision) details.push(`Decision: ${entry.decision}`);
    if (entry.reasoning) details.push(`Reasoning: ${entry.reasoning}`);
    if (entry.alternativeConsidered) details.push(`Alternative rejected: ${entry.alternativeConsidered}`);
    if (entry.handoffTo) details.push(`Handoff to: ${entry.handoffTo}`);
    if (entry.confidence) details.push(`Confidence: ${entry.confidence}`);

    card.appendChild(header);
    card.appendChild(list);
    if (details.length) {
      const detailBlock = document.createElement("div");
      detailBlock.className = "entry-details";
      detailBlock.innerHTML = details
        .map((item) => `<p>${escapeHtml(item)}</p>`)
        .join("");
      card.appendChild(detailBlock);
    }
    workflowLog.appendChild(card);
  });
}

function renderPlanSummary() {
  const sections = renderablePlanSections(sessionState);
  if (!sections.length) {
    planSummary.className = "plan-summary empty";
    planSummary.textContent = "Run a scenario to generate a reviewed plan package.";
    return;
  }

  planSummary.className = "plan-summary plan-artifact";
  planSummary.innerHTML = sections
    .map(([label, value], index) => `
      <section class="${index === 0 ? "artifact-hero" : ""}">
        <h4>${escapeHtml(label)}</h4>
        ${renderPlanSectionContent(value)}
      </section>
    `)
    .join("");
}

function renderCheckpointCard() {
  const checkpoint = deriveCheckpointView();
  checkpointCard.className = "plan-summary";
  checkpointCard.innerHTML = `
    <section>
      <h4>${escapeHtml(checkpoint.title)}</h4>
      <p>${escapeHtml(checkpoint.summary)}</p>
      <ul>${checkpoint.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderChangeComparison() {
  const history = sessionState.planHistory || [];
  if (!history.length) {
    changeComparison.className = "plan-summary empty";
    changeComparison.textContent = "Generate a reviewed package, then request a revision or adaptation to compare versions.";
    return;
  }

  if (history.length === 1) {
    const current = history[0];
    changeComparison.className = "plan-summary";
    changeComparison.innerHTML = `
      <section>
        <h4>${escapeHtml(current.label)}</h4>
        <p>This is the first reviewed package in the current session, so there is no earlier version to compare yet.</p>
        <ul>${current.changes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    `;
    return;
  }

  const previous = history[history.length - 2];
  const current = history[history.length - 1];
  const changedSections = comparePlanSections(previous.plan, current.plan);
  changeComparison.className = "plan-summary";
  changeComparison.innerHTML = `
    <section class="comparison-grid">
      <div class="comparison-column">
        <h4>${escapeHtml(previous.label)}</h4>
        <p>${escapeHtml(previous.plan.weeklySchedule)}</p>
        <ul>${previous.changes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="comparison-column">
        <h4>${escapeHtml(current.label)}</h4>
        <p>${escapeHtml(current.plan.weeklySchedule)}</p>
        <ul>${current.changes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </section>
    <section>
      <h4>Sections that changed</h4>
      <ul>${changedSections.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderTransitions() {
  transitionList.innerHTML = "";
  if (!sessionState.transitions.length) {
    transitionList.innerHTML = "<p class='empty-note'>No transitions yet.</p>";
    return;
  }

  sessionState.transitions.forEach((transition) => {
    const block = document.createElement("div");
    block.className = "transition";
    block.innerHTML = `
      <strong>${escapeHtml(transition.from)}</strong>
      <span class="arrow">→</span>
      <strong>${escapeHtml(transition.to)}</strong>
      <p>${escapeHtml(transition.reason)}</p>
      ${transition.authorizedBy ? `<p class="transition-authority">Authorized by: ${escapeHtml(transition.authorizedBy)}</p>` : ""}
    `;
    transitionList.appendChild(block);
  });
}

function renderHandoffLedger() {
  handoffLedger.innerHTML = "";
  if (!sessionState.handoffLedger.length) {
    handoffLedger.innerHTML = "<p class='empty-note'>No published agent packets yet.</p>";
    return;
  }

  [...sessionState.handoffLedger].reverse().forEach((packet) => {
    const block = document.createElement("div");
    block.className = "transition";
    block.innerHTML = `
      <strong>${escapeHtml(packet.packetType)}</strong>
      <p>${escapeHtml(packet.summary)}</p>
      <p class="transition-authority">${escapeHtml(packet.from)} → ${escapeHtml(packet.to)}</p>
      ${packet.authority ? `<p class="transition-authority">Authority: ${escapeHtml(packet.authority)}</p>` : ""}
    `;
    handoffLedger.appendChild(block);
  });
}

function renderResolutionOptions(draftAnalysis) {
  const options = buildHumanResolutionOptions(buildProfile());
  const prioritizationActive = sessionState.protocolState === "awaiting_prioritization" || draftAnalysis.prioritizationConflict;

  if (!prioritizationActive) {
    resolutionHint.textContent = "These option cards wake up when the workflow detects a real tradeoff. Until then, edit the intake normally and let the agents decide whether human resolution is actually needed.";
    chooseFeasiblePlanButton.textContent = "Prefer feasible plan";
    chooseFeasiblePlanButton.disabled = true;
    chooseFeasiblePlanButton.dataset.optionId = "";
    expandResourcesButton.textContent = "Keep goal, expand resources";
    expandResourcesButton.disabled = true;
    expandResourcesButton.dataset.optionId = "";
    return;
  }

  const firstOption = options[0];
  const secondOption = options[1];
  resolutionHint.textContent = options
    .map((option) => `${option.label}: ${option.description}`)
    .join(" ");

  chooseFeasiblePlanButton.textContent = firstOption?.label || "Apply option";
  chooseFeasiblePlanButton.disabled = !firstOption?.updates;
  chooseFeasiblePlanButton.dataset.optionId = firstOption?.id || "";

  expandResourcesButton.textContent = secondOption?.label || "No second option";
  expandResourcesButton.disabled = !secondOption?.updates;
  expandResourcesButton.dataset.optionId = secondOption?.id || "";
}

function renderAvailableActions() {
  availableActions.innerHTML = "";
  if (!sessionState.availableActions.length) {
    availableActions.innerHTML = "<li class='chip muted'>No state-specific actions available in this state</li>";
    return;
  }

  sessionState.availableActions.forEach((action) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = ACTION_LABELS[action] || action;
    availableActions.appendChild(li);
  });
}

function renderActionButtons() {
  const allowed = new Set(sessionState.availableActions);
  buttons.runWorkflow.disabled = false;
  buttons.continueWorkflow.disabled = !allowed.has("continueWorkflow");
  buttons.runAdaptation.disabled = !allowed.has("runAdaptation");
  buttons.acceptPlan.disabled = !allowed.has("acceptPlan");
  buttons.requestRevision.disabled = !allowed.has("requestRevision");
  buttons.exportTrace.disabled = sessionState.trace.length === 0;
  buttons.exportPlan.disabled = !sessionState.currentPlan;
}

function buildAdaptationFeedback() {
  return {
    category: feedbackFields.category.value,
    notes: feedbackFields.notes.value.trim()
  };
}

function exportCurrentTrace() {
  const payload = {
    exportedAt: new Date().toISOString(),
    currentSession: sessionState
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "constraint_aware_fitness_trace.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportPlanSummary() {
  if (!sessionState.currentPlan) {
    return;
  }

  const lines = [];
  renderablePlanSections(sessionState).forEach(([label, value]) => {
    lines.push(`# ${label}`);
    if (Array.isArray(value)) {
      value.forEach((item) => lines.push(`- ${item}`));
    } else if (value && typeof value === "object") {
      if (value.intro) lines.push(value.intro);
      if (Array.isArray(value.items)) {
        value.items.forEach((item) => lines.push(`- ${item}`));
      }
    } else {
      lines.push(String(value));
    }
    lines.push("");
  });

  const payload = lines.join("\n").trim();
  const blob = new Blob([payload], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugify(sessionState.currentPlan.artifactTitle || "constraint_aware_fitness_plan")}_summary.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  const safe = value == null ? "" : String(value);
  return safe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderPlanSectionContent(value) {
  if (Array.isArray(value)) {
    return `<ul>${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  if (value && typeof value === "object") {
    const intro = value.intro ? `<p class="artifact-intro">${escapeHtml(value.intro)}</p>` : "";
    const items = Array.isArray(value.items) && value.items.length
      ? `<ul>${value.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";
    return `${intro}${items}`;
  }

  return `<p>${escapeHtml(value)}</p>`;
}

function handleDraftChange() {
  render();
}

function applyFeasiblePlanShortcut() {
  applyResolutionOption(chooseFeasiblePlanButton.dataset.optionId);
}

function applyExpandedResourcesShortcut() {
  applyResolutionOption(expandResourcesButton.dataset.optionId);
}

function applyFeedbackPreset(scenarioId) {
  const presets = {
    adaptation: {
      category: "time_overload",
      notes: "Weekday workouts felt too long after class and I skipped meal prep twice."
    },
    revision: {
      category: "motivation_drop",
      notes: "If I miss one weekday session, it is hard to restart the plan."
    }
  };
  const preset = presets[scenarioId] || { category: "time_overload", notes: "" };
  feedbackFields.category.value = preset.category;
  feedbackFields.notes.value = preset.notes;
}

function analyzeDraft(profile, state) {
  const missing = [];
  if (!profile.goal) missing.push("goal");
  if (!profile.trainingDays) missing.push("training days");
  if (!profile.equipment) missing.push("equipment");
  if (profile.symptomTriggers && isAmbiguousSymptoms(profile.symptomTriggers)) {
    missing.push("specific symptom-trigger details");
  }

  const boundaryAssessment = analyzeMedicalBoundaryDraft(profile);
  const boundaryTriggered = boundaryAssessment.triggered;
  const prioritizationConflict = profile.goal === "muscle gain"
    && Number(profile.trainingDays) <= 1
    && profile.budget === "low";
  const secondaryBlockers = [];
  if (missing.length && prioritizationConflict) {
    secondaryBlockers.push("aggressive muscle gain still conflicts with one training day and a low budget");
  }
  const draftChanged = JSON.stringify(profile) !== JSON.stringify(state.profile);

  let readiness = "ready";
  let summary = "Draft looks complete and ready to run.";
  if (boundaryTriggered) {
    readiness = "stop";
    summary = "Current draft would stop at the safety boundary.";
  } else if (missing.length) {
    readiness = "warn";
    summary = "Current draft needs clarification before planning can proceed.";
  } else if (prioritizationConflict) {
    readiness = "warn";
    summary = "Current draft still contains an infeasible tradeoff that requires human prioritization.";
  }

  if (state.trace.length && draftChanged && readiness === "ready") {
    summary = "Inputs changed after the last run. Rerun the workflow to refresh the plan and trace.";
  } else if (state.trace.length && draftChanged && readiness !== "ready") {
    summary = "Inputs changed after the last run and the new draft is not ready for planning yet.";
  }

  const bullets = [
    `Goal: ${profile.goal || "missing"}`,
    `Body context: ${profile.bodyContext || "not supplied"}`,
    `Training days: ${profile.trainingDays || "missing"}`,
    `Equipment: ${profile.equipment || "missing"}`,
    `Current hard-constraint preview: ${hardConstraintPreview(profile)}`
  ];

  if (missing.length) {
    bullets.push(`Missing or ambiguous items: ${missing.join(", ")}`);
  }
  if (secondaryBlockers.length) {
    bullets.push(`Secondary blocker preview: ${secondaryBlockers.join("; ")}`);
  }
  if (boundaryTriggered) {
    bullets.push(`Boundary trigger detected: ${boundaryAssessment.reasons.join("; ")}`);
  }
  if (prioritizationConflict) {
    bullets.push("Tradeoff trigger detected: aggressive muscle gain conflicts with one training day and a low budget.");
  }
  if (state.trace.length && draftChanged) {
    bullets.push("There are uncommitted input edits relative to the last formal workflow run.");
  }

  return {
    readiness,
    summary,
    missing,
    secondaryBlockers,
    prioritizationConflict,
    bullets,
    draftChanged,
    hasTrace: state.trace.length > 0
  };
}

function analyzeMedicalBoundaryDraft(profile) {
  const profileText = `${profile.userQuestion} ${profile.symptomTriggers} ${profile.bodyContext}`.toLowerCase();
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
  const matchedDirectTerms = directTerms.filter((term) => profileText.includes(term));
  const matchedIntervention = interventionPhrases.filter((phrase) => profileText.includes(phrase));
  const matchedDiagnostic = diagnosticPhrases.filter((phrase) => profileText.includes(phrase));
  const hasSymptomConcern = symptomSignals.some((term) => profileText.includes(term));
  const hasRecurrenceConcern = recurrenceSignals.some((term) => profileText.includes(term));

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
    reasons: reasons.length ? reasons : ["no medical-boundary trigger"]
  };
}

function deriveCheckpointView() {
  const latestEntry = sessionState.trace[sessionState.trace.length - 1];

  if (sessionState.protocolState === "awaiting_clarification") {
    return {
      title: "Clarification required",
      summary: "The system is paused because the current evidence is not specific enough to support safe planning.",
      items: latestEntry?.items || [
        "Complete the missing or ambiguous intake fields.",
        "The workflow will only resume after the user provides clearer evidence."
      ]
    };
  }

  if (sessionState.protocolState === "awaiting_prioritization") {
    return {
      title: "Human prioritization required",
      summary: "The system found a conflict it should not silently resolve on the user’s behalf.",
      items: latestEntry?.items || [
        "Use the human-resolution options or revise the intake fields directly.",
        "Then click Continue After Update to resume the paused workflow."
      ]
    };
  }

  if (sessionState.protocolState === "stopped_boundary") {
    return {
      title: "Non-clinical safety boundary",
      summary: "The request crossed into diagnosis, prescription, dosage, medication, or treatment territory, so the workflow stopped before planning.",
      items: [
        "What the artifact can still do: plan non-clinical diet and workout structure once the request is reframed.",
        "What it will not do: diagnose conditions, recommend medication, or interpret treatment.",
        "Recommended next step: seek qualified professional guidance for medical questions."
      ]
    };
  }

  if (sessionState.protocolState === "awaiting_user_acceptance") {
    return {
      title: "User inspection checkpoint",
      summary: sessionState.runSummary?.outcome === "adapted_plan_ready"
        ? "The workflow is waiting for the user to inspect an adapted package created from execution feedback."
        : "The workflow is waiting for the user to inspect the reviewed package before completion.",
      items: [
        "Inspect the reviewed package and the version-to-version change view.",
        "Accept the package if it looks feasible, or request one bounded revision.",
        sessionState.lastFeedbackInput
          ? `Latest adaptation category: ${sessionState.lastFeedbackInput.category.replaceAll("_", " ")}.`
          : "No post-acceptance adaptation has been triggered in this session."
      ]
    };
  }

  if (sessionState.protocolState === "completed") {
    return {
      title: "Completed baseline package",
      summary: "The current reviewed package has been accepted. You can now enter post-acceptance feedback to demonstrate adaptation without restarting from zero.",
      items: [
        "Choose a feedback category and optionally add a free-text note.",
        "Click the adaptation button to reopen the workflow with preserved state.",
        "The version comparison view will show what changed after adaptation."
      ]
    };
  }

  if (!sessionState.trace.length) {
    return {
      title: "Ready to start",
      summary: "The artifact has not generated a formal workflow trace yet.",
      items: [
        "Load a scenario or enter a custom intake profile.",
        "Run the workflow to create inspectable state transitions and a reviewed plan package."
      ]
    };
  }

  return {
    title: "Workflow in progress",
    summary: "The current trace shows how the controller is moving between coordination states.",
    items: latestEntry?.items || ["Inspect the trace, transitions, and visible state on the right."]
  };
}

function comparePlanSections(previousPlan, currentPlan) {
  const labels = {
    artifactTitle: "Plan title changed",
    sampleMealPattern: "Sample meal pattern changed",
    groceryFocus: "Grocery focus changed",
    nutritionStrategy: "Nutrition strategy changed",
    workoutStrategy: "Workout strategy changed",
    sessionBlueprint: "Session blueprint changed",
    weeklySchedule: "Weekly schedule changed",
    weeklyScheduleDetails: "Detailed weekly schedule changed",
    adherenceSupports: "Adherence supports changed",
    rationale: "Rationale changed",
    warnings: "Warnings changed"
  };

  const changed = Object.entries(labels)
    .filter(([key]) => JSON.stringify(previousPlan[key]) !== JSON.stringify(currentPlan[key]))
    .map(([, label]) => label);

  return changed.length ? changed : ["No material content sections changed between these two reviewed versions."];
}

function deriveVisibleStatus(draftAnalysis) {
  if (sessionState.protocolState === "awaiting_clarification") {
    if (draftAnalysis.missing.length) {
      return { kind: "warn", message: "Clarification is still incomplete. Update the missing details, then continue." };
    }
    if (draftAnalysis.draftChanged) {
      return { kind: "neutral", message: "Clarification update detected. Click Continue After Update to resume the paused workflow." };
    }
    return { kind: "warn", message: "Workflow is paused for clarification. Update the intake fields, then continue." };
  }

  if (sessionState.protocolState === "awaiting_prioritization") {
    if (draftAnalysis.prioritizationConflict) {
      return { kind: "warn", message: "The tradeoff is still unresolved. Revise the intake fields, then continue." };
    }
    if (draftAnalysis.draftChanged) {
      return { kind: "neutral", message: "Updated priorities detected. Click Continue After Update to resume the paused workflow." };
    }
    return { kind: "warn", message: "Workflow is paused for prioritization. Revise the intake fields, then continue." };
  }

  if (!draftAnalysis.hasTrace) {
    if (draftAnalysis.readiness === "stop") {
      return { kind: "stop", message: "Draft intake would stop at the safety boundary if you run it." };
    }
    if (draftAnalysis.readiness === "warn") {
      return { kind: "warn", message: "Draft intake is incomplete or ambiguous. Workflow will branch to clarification." };
    }
    return { kind: "neutral", message: "Draft intake is ready. Click Run Workflow to generate the trace and reviewed plan." };
  }

  if (draftAnalysis.draftChanged) {
    if (draftAnalysis.readiness === "stop") {
      return { kind: "stop", message: "Inputs changed. If rerun now, the workflow would stop at the safety boundary." };
    }
    if (draftAnalysis.readiness === "warn") {
      return { kind: "warn", message: "Inputs changed. If rerun now, the workflow would branch to clarification." };
    }
    return { kind: "warn", message: "Inputs changed since the last run. Rerun the workflow to refresh the output." };
  }

  return sessionState.status;
}

function renderDraftFeedback(draftAnalysis) {
  draftFeedback.className = "plan-summary";
  draftFeedback.innerHTML = `
    <section>
      <h4>${escapeHtml(draftAnalysis.summary)}</h4>
      <ul>${draftAnalysis.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      ${draftAnalysis.prioritizationConflict ? `<p class="artifact-intro">The conflict is visible now because the agent packet is asking the human to choose between explicit resolution paths instead of hiding the tradeoff behind one fixed controller branch.</p>` : ""}
    </section>
  `;
}

function renderIntakePrompt(draftAnalysis) {
  intakePrompt.className = `actions-note ${draftAnalysis.readiness}`;

  if (sessionState.protocolState === "awaiting_clarification") {
    if (draftAnalysis.missing.length) {
      intakePrompt.textContent = `Please complete the missing required information, then click Continue After Update: ${draftAnalysis.missing.join(", ")}.`;
      return;
    }
    intakePrompt.textContent = "Clarification information looks sufficient now. Click Continue After Update to resume the paused workflow.";
    return;
  }

  if (sessionState.protocolState === "awaiting_prioritization") {
    if (draftAnalysis.prioritizationConflict) {
      intakePrompt.textContent = "This goal / schedule / budget mix still requires human prioritization. Revise the intake fields, then click Continue After Update.";
      return;
    }
    intakePrompt.textContent = "The tradeoff appears resolved in the updated intake. Click Continue After Update to resume the paused workflow.";
    return;
  }

  if (draftAnalysis.readiness === "stop") {
    intakePrompt.textContent = "This input includes medical or prescription-style language. The workflow will stop at the safety boundary instead of producing a plan.";
    return;
  }

  if (draftAnalysis.missing.length) {
    intakePrompt.textContent = `Please complete the missing required information before expecting a full plan: ${draftAnalysis.missing.join(", ")}.`;
    return;
  }

  if (draftAnalysis.prioritizationConflict) {
    intakePrompt.textContent = "This input will escalate to a human prioritization pause because the requested goal, training days, and budget are in conflict. Use the resolution options below if you want to test a concrete next move.";
    return;
  }

  if (draftAnalysis.draftChanged && draftAnalysis.hasTrace) {
    intakePrompt.textContent = "You changed the intake after the last run. Run the workflow again to refresh the output with your latest input.";
    return;
  }

  intakePrompt.textContent = "Fill in the intake fields, then run the workflow to generate a formal plan trace.";
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

function hardConstraintPreview(profile) {
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
  return hard.length ? hard.join("; ") : "none yet";
}

function applyResolutionOption(optionId) {
  const option = buildHumanResolutionOptions(buildProfile()).find((item) => item.id === optionId);
  if (!option || !option.updates) {
    return;
  }

  Object.entries(option.updates).forEach(([key, value]) => {
    if (fields[key]) {
      fields[key].value = value;
    }
  });
  render();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "constraint_aware_fitness_plan";
}
