# AR Eyewear App - Prompt Library

A reusable prompt library for building the complete AR Eyewear e-commerce application with any coding agent (Claude, GPT, Cursor, Windsurf, etc.).

## 📋 Quick Start

1. **Always start** with `00-master-project.md` to establish global context
2. Then pick the relevant sub-prompt based on what you're building
3. For feature modules, use the template and fill in the feature details

## 📁 Prompt Organization

```
prompts/
├── README.md                          # This file
├── 00-master-project.md               # Global context (USE FIRST)
│
├── frontend/                          # Flutter prompts
│   ├── 01-architecture.md             # Full Flutter scaffold
│   ├── 02-shared-ui.md                # Design system & widgets
│   ├── 03-feature-template.md         # Per-feature template
│   ├── 04-ar-tryon.md                 # AR-specific frontend
│   └── features/                      # Pre-filled feature prompts (12 total)
│       ├── 01-onboarding.md
│       ├── 02-auth.md
│       ├── 03-home.md
│       ├── 04-catalog.md
│       ├── 05-product-details.md
│       ├── 06-ar-tryon.md
│       ├── 07-cart.md
│       ├── 08-checkout.md
│       ├── 09-profile.md
│       ├── 10-orders.md
│       ├── 11-feedback.md
│       └── 12-settings.md
│
├── backend/                           # FastAPI prompts
│   ├── 01-architecture.md             # Full backend scaffold
│   ├── 02-database-schema.md          # Supabase/Postgres schema
│   ├── 03-domain-template.md          # Per-domain API template
│   └── domains/                       # Pre-filled domain prompts (7 total)
│       ├── 01-auth-users.md
│       ├── 02-products.md
│       ├── 03-ar-assets.md
│       ├── 04-cart.md
│       ├── 05-checkout.md
│       ├── 06-orders.md
│       └── 07-reviews.md
│
├── ar/                                # AR integration
│   └── 01-ar-integration.md           # AR backend & native bridge
│
├── security/                          # Security & payments
│   ├── 01-auth-security.md            # Auth, JWT, RLS
│   └── 02-payments-checkout.md        # Payment gateway integration
│
└── infra/                             # DevOps & documentation
    ├── 01-deployment.md               # Docker, CI/CD, cloud
    └── 02-api-docs.md                 # API documentation structure
```

## 🎯 Usage Workflow

### Building the Frontend

```
1. 00-master-project.md          → Establish context
2. frontend/01-architecture.md   → Generate Flutter scaffold
3. frontend/02-shared-ui.md      → Build design system
4. frontend/03-feature-template.md (per feature) → Build each feature
5. frontend/04-ar-tryon.md       → AR-specific integration
```

### Building the Backend

```
1. 00-master-project.md          → Establish context
2. backend/01-architecture.md    → Generate FastAPI scaffold
3. backend/02-database-schema.md → Design Supabase schema
4. backend/03-domain-template.md (per domain) → Build each API domain
```

### Security & Infra

```
1. security/01-auth-security.md     → Auth flows & security
2. security/02-payments-checkout.md → Payment integration
3. infra/01-deployment.md           → Docker & CI/CD
4. infra/02-api-docs.md             → Documentation structure
```

## 💡 Tips for Best Results

- **Be specific**: When using templates, fill in all placeholders with detailed descriptions
- **One prompt at a time**: Don't combine multiple prompts; run them sequentially
- **Reference outputs**: Tell the agent to reference previous outputs when building on them
- **Request structure first**: Ask for file/folder structure before implementation details
- **Iterate**: If output is too high-level, ask for more detail on specific sections

## 🔗 Cross-References

When building features, these prompts often work together:

| Frontend Feature | Backend Domain | AR Component |
|------------------|----------------|--------------|
| `auth` | `auth-users` | - |
| `catalog` | `products` | - |
| `product_details` | `products`, `ar-assets` | - |
| `ar_tryon` | `ar-assets` | `ar-integration` |
| `cart` | `cart` | - |
| `checkout` | `checkout` | - |
| `orders` | `orders` | - |
| `profile` | `users` | - |
| `reviews` (in product_details) | `reviews` | - |

## 📝 Version

- **Library Version**: 1.0.0
- **Target Stack**: Flutter 3+ / FastAPI / Supabase / ARKit/ARCore
- **Last Updated**: 2024
