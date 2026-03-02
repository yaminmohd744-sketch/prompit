# Prompit

A production-ready multi-model AI web application platform. Send prompts to 40+ AI models across text, image, video, audio, 3D, code, and agent modalities.

## Stack

- **Frontend**: Next.js 14 (App Router) · TypeScript · TailwindCSS · ShadCN/UI · Zustand
- **Backend**: Fastify · Node.js · TypeScript · Prisma · BullMQ
- **Database**: PostgreSQL · Redis · Pinecone (vector)
- **Storage**: Cloudflare R2 · CDN
- **Deploy**: Vercel (frontend) · Railway (backend + workers)

## Monorepo Structure

```
prompit/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Fastify API gateway
├── packages/
│   ├── mal/        # Model Abstraction Layer
│   ├── db/         # Prisma schema + client
│   ├── types/      # Shared TypeScript types
│   └── config/     # Shared config + env validation
└── workers/
    ├── image-worker/
    ├── video-worker/
    └── audio-worker/
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Build Phases

- **Phase 1** (MVP): Text + Image models, auth, billing
- **Phase 2**: Video + Audio + real-time streaming
- **Phase 3**: 3D + Enterprise SSO + RAG
- **Phase 4**: Public API + SDKs
- **Phase 5**: AI Agents + Marketplace
