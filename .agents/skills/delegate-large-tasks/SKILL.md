---
name: delegate-large-tasks
description: "Use when a project task is large or complex enough to justify subagent delegation."
---

# Delegate substantial project work

Use subagents only when a task is large and heavy enough that their extra token and time cost is justified. Good candidates have meaningful subtasks, dependencies, or substantial verification. Handle small changes, simple questions, and work that cannot usefully be divided directly. Respect the user's requested scope; if they ask only for a plan, stop before implementation.

## Plan and assign

1. As the primary agent, use GPT-6.1 Sol to understand the goal, define acceptance criteria, and create `.agents/plans/<task>/overview.md` from `templates/plans/overview.md`. Choose a short identifier for `<task>` and do not overwrite plans from earlier work.
2. Divide the work into implementation tasks `T01`, `T02`, and so on, and verification tasks `V01`, `V02`, and so on. For each task, state its dependencies, expected result, and required evidence. Include concrete verification tasks in the overview from the start.
3. Spawn a subagent with `model=gpt-6.1-sol` and `reasoning_effort=high` to turn each task into a detailed plan at `.agents/plans/<task>/tasks/<id>.md`, using `templates/plans/task.md`. The planning subagent must make the steps, relevant interfaces or files, edge cases, checks, and expected results precise enough that the executor does not need to redesign the solution. The planning subagent does not implement the task.
4. Once the detailed plan is ready and its dependencies are met, spawn a subagent with `model=gpt-6-luna` and `reasoning_effort=high` to execute it. Luna writes `.agents/plans/<task>/reports/<id>.md` from `templates/plans/report.md`, recording changes, commands, results, and issues. Verification tasks follow the same Sol → Luna sequence; Luna does not modify the product during verification unless the primary agent opens a correction task.
5. Run tasks in parallel only when they are independent and write to separate areas. Wait for their reports before starting dependent tasks. The primary agent compares each report with its acceptance criteria, inspects the evidence, and updates the status in `overview.md`.
6. If execution or verification fails, the primary agent decides whether Luna can correct it using the existing plan or the planning subagent must revise the plan. Then schedule and check a new verification task. Close the work only when the overall acceptance criteria and verifications are satisfied; report the results and any real limitations to the user.

When selecting an explicit model with `spawn_agent`, use `fork_turns="none"` and include the overview path, task ID, and requested result in the message. The overview must contain all context and constraints the subagent needs because it will not inherit the conversation history.
