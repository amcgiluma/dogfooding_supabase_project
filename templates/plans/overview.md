# Overview: <task>

## Goal and acceptance

- Request: <faithful summary of the request>
- Expected outcome: <observable behavior or deliverable>
- Overall acceptance criteria: <verifiable conditions>
- Constraints and scope: <only what affects this work>

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | <result> | — | `tasks/T01.md` | `reports/T01.md` | Pending |
| V01 | Verification | <required evidence> | T01 | `tasks/V01.md` | `reports/V01.md` | Pending |

The planning subagent (GPT-6.1 Sol) plans each row, and Luna executes it. The primary agent (GPT-6.1 Sol) decides which tasks are independent, assigns verification tasks, and updates each status to `Pending`, `In progress`, `Blocked`, or `Completed` based on the evidence.

## Completion

- Evidence reviewed by the primary agent: <reports, checks, and results>
- Unmet criteria or limitations: <if any>
- Final result reported to the user: <summary>
