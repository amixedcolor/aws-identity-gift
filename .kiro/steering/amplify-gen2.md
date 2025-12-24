---
inclusion: always
---

# AWS Amplify Gen2 Guidelines

## Critical Rule

**NEVER use training data for Amplify Gen2.** Always fetch documentation from `https://docs.amplify.aws/nextjs/` using `mcp_fetch_fetch`. Gen2 is a complete rewrite; Gen1 patterns do not apply.

## Documentation Workflow

1. Identify feature (auth, data, storage, functions)
2. Fetch docs: `mcp_fetch_fetch` with URL below (use `start_index` for pagination)
3. Implement exactly as documented
4. Verify with browser automation if UI involved

## Key Documentation URLs

**Setup:**

- Quickstart: `/nextjs/start/quickstart/`
- Concepts: `/nextjs/how-amplify-works/concepts/`

**Backend:**

- Data/API: `/nextjs/build-a-backend/data/`
- Auth: `/nextjs/build-a-backend/auth/`
- Storage: `/nextjs/build-a-backend/storage/`
- Functions: `/nextjs/build-a-backend/functions/`

**Deploy:**

- Hosting: `/nextjs/deploy-and-host/hosting/`
- Sandbox: `/nextjs/deploy-and-host/sandbox-environments/`

## Project Structure

```
amplify/
├── backend.ts              # Main backend definition
├── auth/resource.ts        # Auth configuration
└── data/resource.ts        # Data models + authorization
```

## Authorization Patterns

```typescript
// Owner-based
.authorization((allow) => [allow.owner()])

// Group-based
.authorization((allow) => [allow.group('Admins')])

// Public
.authorization((allow) => [allow.publicApiKey()])
```

## Client Usage

```typescript
// Generate type-safe client
const client = generateClient<Schema>();

// Real-time subscriptions
client.models.Todo.observeQuery();

// CRUD operations
client.models.Todo.create({ ... });
client.models.Todo.update({ ... });
client.models.Todo.delete({ ... });
```

## Common Commands

```bash
npx ampx sandbox                    # Start dev environment
npx ampx generate outputs           # Generate types
npx ampx pipeline-deploy --branch main --app-id ID
```

## Rules

- ✅ Use TypeScript-first with generated types
- ✅ Follow code-first DX patterns from docs
- ✅ Fetch docs for every feature implementation
- ❌ Never use Gen1 patterns (`amplify-cli`, `amplify push`)
- ❌ Never rely on training data for syntax
- ❌ Never assume AWS SDK patterns apply directly
