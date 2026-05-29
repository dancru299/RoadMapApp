# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build + TypeScript check
pnpm lint         # ESLint

pnpm db:migrate   # Create & apply a new Prisma migration
pnpm db:seed      # Re-seed the database (destructive — clears all data first)
pnpm db:studio    # Open Prisma Studio UI
pnpm db:reset     # Drop all tables, re-migrate, re-seed
```

**Database prerequisite:** Docker Desktop must be running before any `db:*` command.

```bash
docker compose up -d    # Start PostgreSQL 17 container (roadmap_db, port 5432)
docker compose down     # Stop container
```

## Architecture

### Request flow

```
Browser → Next.js App Router
  /             → redirects to /galaxy
  /galaxy       → (game)/galaxy/page.tsx        [client component]
  /mission/:id  → (game)/mission/[nodeId]/page.tsx [client component]

  /api/roadmap          → returns full roadmap (chapters + nodes + missions)
  /api/nodes/[nodeId]   → returns a single node + its mission
```

### State split: server data vs. client progress

Roadmap content (chapters, nodes, missions) lives in **PostgreSQL** and is read-only from the browser via API routes. User progress is **MVP Guest Mode only** — stored in `localStorage` under the key `roadmap_guest_v1` as a `GuestProgress` object. There is no authentication; a UUID is generated client-side on first visit. The `User` and `UserProgress` DB tables exist for future use but are not written to by the current UI.

### Node status computation

`GalaxyMap.tsx` contains `computeStatusMap()` which derives a `Map<nodeId, NodeStatus>` on every render by walking nodes in `orderIndex` order:

1. If `progress[nodeId].status === "completed"` → `completed`
2. Else if `prerequisiteNodeId` is null → `active` (the first node)
3. Else if the prerequisite's computed status is `"completed"` → `active`
4. Otherwise → `locked`

This is a pure function of `chapters` + `progress`. No server call is needed.

### Galaxy Map rendering layers

The viewport div handles mouse pan/zoom via `useGalaxyMap`. Inside it, a single world `div` (1500×1150 px) is transformed with CSS `translate + scale`. Three layers stack inside the world div:

1. `NebulaCluster` — absolutely positioned blurred radial-gradient divs (one per chapter, z-index lowest)
2. `<svg>` — `NodeConnector` lines drawn between prerequisite pairs
3. `StarNode` buttons — absolutely positioned at `(posX, posY)`, centered via `translate(-50%,-50%)`

### Mission screen

`/mission/[nodeId]/page.tsx` fetches node data from `/api/nodes/[nodeId]`, then renders `MissionScreen` which is a split pane: left 42% is `MissionContent` (custom markdown renderer), right is `CodeTerminal` (Monaco Editor, SSR-disabled via `dynamic()`). On submit, `CodeTerminal` tests code against `mission.validationPattern` (a JS regex string). On pass, `SelfEvalModal` appears; the chosen confidence level is passed to `useGuestProgress.completeNode()` which writes to localStorage, then navigates back to `/galaxy`.

## Key technical details

### Prisma 7 configuration

The datasource URL is in `prisma.config.ts` (not `schema.prisma`). The generator is `prisma-client` (not the legacy `prisma-client-js`), outputting to `src/generated/prisma/`. Always run `pnpm prisma generate` after schema changes. The client requires the `pg` driver adapter — import from `@/lib/prisma` which holds the singleton with `Pool` + `PrismaPg`.

### pnpm build approvals

`pnpm-workspace.yaml` contains an `allowBuilds` section. When adding a new dependency that has native build scripts, pnpm 11 will error with `ERR_PNPM_IGNORED_BUILDS` — add the package name with `true` to that file, then re-run install.

### Tailwind CSS v4

Config is CSS-first. Custom variables and keyframes are declared in `src/app/globals.css` (not a `tailwind.config.js`). Three keyframes are defined there: `node-pulse`, `orbit-spin`, `completion-burst`.

### Monaco Editor

`CodeTerminal.tsx` uses `dynamic(() => import("@monaco-editor/react"), { ssr: false })` — it cannot be rendered server-side. Any parent that imports `CodeTerminal` must also be a client component.
