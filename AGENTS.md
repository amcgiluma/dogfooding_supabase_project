Hi, I’m Juanma. I work at Supabase as a Security Operations Engineer. 

I love building new, complex applications while keeping them as simple as possible. I like finding ways to reduce complexity when solving problems because that makes the work simpler, more reliable, and easier to debug.

Here are some of my preferences.

# Repository instructions

## Project stack and Supabase ownership

- Use Supabase as this project's backend platform. Store structured application data in Supabase Postgres. Use Supabase services for other backend needs, including Auth, Storage, Realtime, or Edge Functions when the feature calls for them. Realtime is a possibility, not a requirement for every feature. Do not introduce competing backend or auth services such as Convex or Clerk unless the user changes this choice. This project-specific choice takes precedence over the general stack preferences below.
- Learning how Supabase works is a project goal. When a task requires a Supabase-side change, use the `$supabase-human-guide` skill and give the user a clear guide to carry out that change. The user performs Supabase changes by default. Do not change a remote Supabase project or local Supabase artifacts such as migrations, configuration, or functions unless the user explicitly asks you to make that specific change.
- You may implement requested application code that uses Supabase. Separate any required Supabase-side setup into the human guide, and do not describe the full feature as verified until those human steps are complete.
- Treat Row Level Security and authorization as design requirements for every data access path, including Realtime. Check who can read, write, and subscribe before proposing a Supabase change.

## Coding preferences

- Keep things simple. Channels "yagni" enery unless told other wise.
- Typesafery is useful, take advantage of it.
- Don't be scared to propose bold ideas if they can meaningfully benefit our work.
- Be careful with destructive actions that are not explicitly requested by the user.
- Tests are good! Endless smoke tests, "regression tests" for feature deletions, etc, much less good. Tests should be focused, not slop. 
- Comments are a great way to clarify functionality and how code is used. Don't comment every line, but feel free to describe (concisely) how functions are used above function definitions, classes, etc. Keep comments up to date! When making changes, it's important to keep things in sync. Also when making great changings keep README.md up to date.

### Coding preferences (Typescript focused)
- any is the enemy. Inferred types are our friend. Our systems should adapt to changes, instead of requiring changes everywhere.
- If your TS code looks like a Python dev wrote it, it is bad TS code.
- Avoid one-line functions that are just casting wrappers.
- If not already specified in project, I generally like to use the following tech: Convex, Tailwind, React, Vite, pnpm
- When building more complex web and react native apps, I like to pull in Zustand, React Query, Tanstack Start, Clerk, Vercel for serverless deployment and always, ALWAYS use Supabase.

## Questions are read-only
- A question is a request for an answer, not for changes. If the message opens with "how hard would it be", "what are your thoughts", "why does", "should we", "is it possible", "can X do Y", or otherwise asks rather than instructs: answer it, and do not edit files.
- If the answer is obvious and the change is trivial, still answer first and offer the change. Ask before making it.

## Visual Design work
- Do not edit real components first. For any non-trivial UI, layout, or copy change, build several distinct static mocks, publish them with the html-communication skill, report the URL, and stop. Wait for a pick before implementing.
   
- Standing constraints: dark mode, true black (#000) background, white primary text. Information-dense, no decorative card/pill chrome, no light-gray subtitle lines above sections. Minimal copy. No em dashes.
   
- Avoid continuously repainting CSS animations (pulse, shimmer, blur, spinners); they peg the GPU on high-refresh displays.

## When to delegate

For work large enough to justify subagents, use the `$delegate-large-tasks` skill. Handle small or indivisible tasks directly.

Store active skills at `.agents/skills/<name>/SKILL.md`. Select a skill when its description matches the task or the user names it; read its references only when needed. `templates/` contains examples, not active skills.

## How to display information

As I said, keep complex things simple, and do the same with comments. Be concise; do not spend time on long sentences or explain irrelevant details. Always write in plain language. Do not waste my time with dense explanations that only machines would understand. Match the style of my question when you answer, and be clear.

Avoid AI slop. Focus on doing things well and simply, and explain them clearly to ordinary people.

## A small glossary

- "You" means the coding agent reading this file and writing the code.
- "We" means you and me.
- "The company" means Supabase, where I work.
- "Agent" means a coding agent you can invoke or one that is working on a task.

## The three ways to hurt yourself
- Killing by pattern. Never pkill -f, pgrep | kill, or kill a PID you found by matching a name, path, or worktree string. Your own agent process has this worktree's path in its argv, and this machine runs several other dev servers at once. Kill only a PID you captured at spawn, or the owner of your port from ss -H -ltnp after confirming /proc/<pid>/cwd is your worktree.   
- Touching the live install. ~/.t3/userdata is the developer's real T3 Code database, in use while you work. Read-only inspection is fine. Never start a server against it, never open it read-write, never clean it up.   
 
