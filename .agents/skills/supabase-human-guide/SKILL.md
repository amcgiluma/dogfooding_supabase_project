---
name: supabase-human-guide
description: "Use when a task requires a change inside Supabase, such as database schema, RLS, Auth, Storage, Realtime, Edge Functions, or project settings."
---

# Supabase human guide

The user wants to learn Supabase by carrying out Supabase-side changes personally. Use this skill when a task calls for changing a Supabase project, database, policy, or service configuration.

## Default ownership

- Give the user a guide instead of making the Supabase-side change. Do not run SQL or migrations, use the Dashboard, CLI, API, or MCP tools to change Supabase, deploy functions, or edit local Supabase configuration and migration files by default.
- Make a Supabase-side change yourself only when the user explicitly asks you to make that specific change. An application feature request alone does not transfer ownership of the required Supabase setup.
- Implement requested application code when authorized, and clearly separate the Supabase steps the user still needs to perform. Do not report an end-to-end feature as verified before those steps are completed and checked.

## Write the guide

1. Inspect the relevant project code and configuration. Check current official Supabase documentation before giving version-sensitive SQL, Dashboard paths, or Realtime instructions. Never invent project IDs, secrets, table names, or existing policies.
2. Start with the intended outcome and what the user will change. Give short numbered steps in the order a person should perform them. Name the Dashboard location or tool, provide exact values or copyable SQL when they are known, and mark unknown project-specific values clearly.
3. Briefly explain what each non-obvious step does. Include how to verify success and how to recognize an incorrect or unsafe result. Include a reversal step when the change could affect existing data or access.
4. Keep the language direct and human-readable. Present the smallest safe procedure for the task, not a generic Supabase tutorial. State what you need the user to report back before dependent application work can be considered complete.

## Authorization and RLS

- For every affected table or view, identify who should be able to read, insert, update, and delete. Check both grants and RLS policies, enable RLS on exposed tables, and recommend the least privilege needed for each actor. Include allowed and denied test cases for signed-out and signed-in users where relevant.
- Never place a secret or service-role key in client code or instructions for a browser. Treat any access path that bypasses RLS, including privileged server code and views, as requiring an explicit security check.
- For Realtime, identify whether the feature uses Postgres Changes or Broadcast/Presence and guide the user through the corresponding authorization checks. Verify that unauthorized users cannot receive data or join protected channels.
- Use the current official [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) and [Realtime authorization guide](https://supabase.com/docs/guides/realtime/authorization) when preparing these steps.
