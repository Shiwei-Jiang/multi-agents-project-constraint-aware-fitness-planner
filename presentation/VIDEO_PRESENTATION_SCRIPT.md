# 5-Minute Video Presentation Script with Recording Cues

Project: **Constraint-Aware Fitness Planner**

Use with: `presentation/VIDEO_PRESENTATION.pptx`

录制建议：这份稿子是“PPT + app/repo 录屏”的提词器。中文提示告诉你什么时候切屏、鼠标放哪里、哪里需要 scroll；英文是你可以直接讲的话。

---

## Slide 1 — Problem + Target User

**Time: 0:00-0:35**

【画面停在 PPT Slide 1，鼠标指向标题 `Constraint-Aware Fitness Planner`。】

Hi everyone. My project is Constraint-Aware Fitness Planner, a non-clinical multi-agent planning system for users who want realistic diet and workout guidance under real-world constraints.

【鼠标移到左侧 `Target user` 区域，慢慢扫过 food restrictions / symptom-trigger / schedule / budget 这些关键词。】

The target user is someone who may have food restrictions, symptom-trigger history, schedule limits, budget limits, limited equipment, or adherence challenges.

【鼠标移到右侧 `Core problem` 区域，指向 `ask / stop / escalate / revise` 四个标签。】

I chose a multi-agent system because this task is not one decision. The system needs to normalize intake, check constraints, detect safety boundaries, compose a plan, review it, and route unresolved tradeoffs back to the human. A single agent might generate a plan, but it is harder to make these decisions explicit and auditable.

【鼠标指向底部 contribution 句子。】

So the main goal is to coordinate specialized agents so the system can clarify, stop, escalate, revise, and adapt before delivering a final plan.








---

## Slide 2 — Architecture

**Time: 0:35-1:10**

【切到 PPT Slide 2。建议把 Slide 2 的图换成 `FINAL_DECK.pptx` 里的清晰 architecture 图。鼠标先指向左侧 `Human Actor`。】

The architecture uses four internal agents plus a human-in-the-loop actor.

【鼠标从 `Human Actor` 移到 `Intake & Profile`。】

The **Intake and Profile Builder** structures the raw user request into a profile packet.

【鼠标移到中间橙色 `Constraint & Risk Checker`，然后指向 `clarification required`, `prioritization required`, `medical boundary` 三条分支。】

The **Constraint and Risk Checker** is the main gatekeeper: it checks missing information, conflicting constraints, unrealistic goals, and medical or treatment boundaries before planning happens.

【鼠标移到绿色 `Plan Composer`，再移到蓝色 `Review & Adaptation Agent`。】

Only after the request is safe and feasible does the **Plan Composer** draft the diet and workout plan. Then the **Review and Adaptation Agent** checks the draft, revises it, or adapts it after user feedback.

【鼠标指向右侧或底部 `Shared Session State`，再轻轻回到 `Human Actor`。】

The human actor is part of the workflow because the system should not guess missing information or resolve personal tradeoffs automatically. Shared session state preserves profile data, constraint reports, plan versions, review notes, and feedback history.

---

## Slide 3 — Main Workflow / Actual Artifact

**Time: 1:10-2:05**

【先停在 PPT Slide 3，鼠标指向页面标题。讲完这一句后立刻切到实际 app 页面。】

Now I’ll show the main workflow in the actual artifact.

【切到浏览器里的 `app/index.html`。选择或确认 scenario 是 `Baseline constrained planning`。鼠标放在左侧 `1. Intake` 面板顶部。】

In the baseline scenario, the user provides a bounded profile: goal, training days, body-context notes, equipment, dietary restrictions, symptom triggers, adherence concerns, and budget.

【鼠标向下扫左侧 intake 表单：Goal、Training days、Body context、Dietary restrictions、Symptom triggers、Budget。不要逐项读，扫一下即可。】

These fields are important because the planner needs structured constraints before it is allowed to generate a plan.

【鼠标移到左侧橙色 `Run Workflow` 按钮，点击。】

When I run the workflow, the system first structures the profile, then checks constraints, then composes a plan, and finally reviews the plan before showing it to the user.

【鼠标移到中间 `2. Workflow Output` 顶部，看 workflow completed / reviewed package / current checkpoint。】

The important part is that the final output is not just a raw LLM-style response.

【在中间 output 区域慢慢 scroll down 一点，停在 reviewed plan sections，比如 profile-fit summary / meal pattern / training plan / weekly schedule 附近。】

It is a reviewed package with a profile-fit summary, meal pattern, workout structure, weekly schedule, warnings, and next-step guidance.

【继续轻微 scroll，让观众看到 plan 是很长的 structured output，但不要滑太快。然后鼠标移到右侧 `3. State and Coordination Evidence`。】

On the right side, the artifact also exposes the trace, state transitions, handoff ledger, and raw JSON evidence.

【鼠标依次指向右侧 `Allowed Next Actions`, `Agent Handoff Ledger`, `Protocol Transitions`, `Raw Trace JSON`。】

This makes the workflow inspectable instead of hidden.

---

## Slide 4 — Coordination / Branching Evidence

**Time: 2:05-2:45**

【切回 PPT Slide 4，停 2-3 秒，让观众看到这页是 coordination evidence。】

This slide shows the evidence that the system is actually coordinating agents rather than running one generic prompt.

【切到 app 的 revision scenario，或者直接打开/展示 `screenshots/07_state_and_transitions.png`。如果用 app，选择 revision/state scenario 后运行 workflow。鼠标放在右侧 `Allowed Next Actions`。】

The allowed-next-actions panel shows that the controller is state-based.

【鼠标移到右侧 `Agent Handoff Ledger`，必要时在右侧 panel 轻微 scroll 到 ledger 区域。】

The handoff ledger records which agent produced which artifact and which agent receives it next.

【鼠标在 handoff ledger 里依次指 Intake -> Constraint Checker、Constraint Checker -> Plan Composer、Plan Composer -> Review Agent。如果页面需要，下滑一点找这些条目。】

This is where the project makes agent interaction visible: the output is passed through explicit handoffs instead of one opaque generation step.

【继续在右侧或中间 trace 区域 scroll，找到 `Review -> Plan Composer -> Review` 或 revision notes / rewrite path。鼠标停在这个 loop 附近。】

In the revision case, the trace shows a visible **Review to Plan Composer to Review** loop, so the review agent can send revision notes back before the plan is delivered.

【鼠标移到 `Protocol Transitions` 区域。】

This is the main agentic contribution: role separation plus explicit routing. The system has decision authority at each stage, and those decisions are visible in the trace.

---

## Slide 5 — Boundary / Failure Behavior

**Time: 2:45-3:25**

【切到 PPT Slide 5。鼠标指向标题 `Boundary Behavior`。】

This is the required failure or boundary behavior example.

【切到 app，选择 `Safety boundary stop` scenario。鼠标先指向左侧用户输入里的 medical/treatment wording，比如 question/note 字段。】

When the request moves into diagnosis, prescription, treatment, or medical interpretation, the workflow stops before planning.

【鼠标移到 `Run Workflow`，点击。】

In this case, the protocol state becomes `stopped_boundary`, and the system gives a non-clinical warning instead of generating a fitness plan.

【鼠标移到中间 `Workflow Output` 顶部，指向 `Stopped at safety boundary` 或 `Non-clinical safety boundary`。】

This behavior is intentional. The project is not trying to be a medical advisor.

【鼠标指向中间解释卡片里的 warning / refusal 内容，然后移到右侧 handoff ledger 或 protocol transition。】

It is showing bounded autonomy: the system should know when not to continue.

【如果右侧看得到 transition，就指向 `constraint_check_active -> stopped_boundary`；如果看不到，轻微 scroll 右侧 panel。】

One limitation is that this governance logic is still policy-bounded and internally tested. It is not external clinical validation.

---

## Slide 6 — Evidence Layer

**Time: 3:25-4:25**

【切到 PPT Slide 6，鼠标指向 `14 / 14`, `traces`, `regression` 标签。】

For the evidence layer, the final package includes generated evaluation outputs, saved traces, regression checks, and a failure log.

【切到浏览器打开 `docs/evaluation_evidence_view.html`。鼠标指向 summary 区域，尤其是 `14 / 14` current-version pass summary。】

The evaluation summary reports fourteen current-version formal cases passing within the bounded internal evaluation scope.

【鼠标指向 evidence page 里 core scenarios / adversarial / persona / regression sections。】

These include seven core workflow cases, two adversarial cases, three persona-variation cases, and two regression checks.

【切到 Finder 或 editor，打开 `eval/evaluation_results.csv`。鼠标指向表格文件名或表格行，不需要读具体每行。】

The evidence is not just pass/fail. The current-version evaluation table records the formal scenario outcomes.

【切到 `outputs/exported_artifacts/` 文件夹，鼠标指向 `automatic_evaluation_snapshot.json`, `extended_evaluation_snapshot.json`, `stability_check.json`, `clarification_resume_demo.json`, `prioritization_resume_demo.json`。】

The saved artifacts include traces, stability checks, continuation demos, and extended evaluation snapshots.

【切到 `eval/failure_log.md`，鼠标指向 top paragraph 和一个 fixed failure，比如 F-001 或 F-003。】

The failure log also keeps historical issues visible, including cases that were fixed and then promoted into regression evidence.

【切到 `eval/evaluation_scope_note.md`，鼠标指向 `What This Evaluation Is Not`。】

I also explicitly document the evaluation scope: this is structured internal scenario evaluation, not an external user study.

---

## Slide 7 — Final Output + Contribution

**Time: 4:25-5:00**

【切到 PPT Slide 7。鼠标指向左侧 artifact screenshot，再指向中间 `Final deliverables` list。】

The final deliverable is a runnable browser artifact plus a reproducible evidence package.

【鼠标指向 `reviewed plan package` 和 `saved scenario traces`。】

The user-facing output is a reviewed fitness plan, but the project’s deeper contribution is the workflow around that output: clarification, safe stopping, human prioritization, bounded revision, adaptation, and state preservation.

【鼠标指向右上角 `Remaining limitation`。】

The main limitation is that adaptation and governance are still driven by hand-authored policy logic and internal scenario testing.

【鼠标指向右下角 `Key contribution`。】

But compared with a single-agent planner, this system makes the planning process more inspectable and safer because every major decision is attached to a role, a state, and an evidence artifact.

【最后切到 repo Finder 或 VS Code 文件树，鼠标依次指向 `app`, `outputs`, `eval`, `docs`, `presentation` 文件夹。】

So my key contribution is a constraint-aware, human-in-the-loop multi-agent planning system where the final answer is supported by visible coordination evidence, not just generated text.
