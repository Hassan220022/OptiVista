# API Documentation Prompt

> **Usage**: Use this prompt to design the API documentation structure.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are responsible for API documentation.

## Goal

Design the documentation structure for all backend APIs.

---

## Task 1: Documentation Tooling

### Primary: FastAPI Auto-Generated

FastAPI automatically generates:
- **OpenAPI 3.0 spec** at `/openapi.json`
- **Swagger UI** at `/docs`
- **ReDoc** at `/redoc`

### Secondary: Human-Readable Markdown

For guides, examples, and context not captured in OpenAPI.

**Location**: `docs/api/`

---

## Task 2: Markdown Documentation Structure

```
docs/api/
├── README.md              # API overview, getting started
├── authentication.md      # Auth guide
├── errors.md              # Error handling guide
├── pagination.md          # Pagination patterns
├── rate-limiting.md       # Rate limits info
│
├── endpoints/
│   ├── auth.md            # Auth endpoints
│   ├── users.md           # User endpoints
│   ├── products.md        # Product endpoints
│   ├── ar-assets.md       # AR asset endpoints
│   ├── cart.md            # Cart endpoints
│   ├── checkout.md        # Checkout endpoints
│   ├── orders.md          # Order endpoints
│   └── reviews.md         # Review endpoints
│
└── examples/
    ├── flutter-integration.md   # Flutter code examples
    └── common-flows.md          # End-to-end flow examples
```

---

## Task 3: Document Content Specifications

### `README.md` - API Overview

**Sections**:
1. **Introduction**: What this API does
2. **Base URL**: Production and staging URLs
3. **Versioning**: How versions work (/api/v1)
4. **Authentication**: Quick overview, link to auth.md
5. **Request Format**: JSON, headers
6. **Response Format**: Standard response structure
7. **Quick Start**: 3-step example to make first call

---

### `authentication.md` - Auth Guide

**Sections**:
1. **Overview**: Supabase Auth + JWT
2. **Getting a Token**: How to authenticate
3. **Using the Token**: Authorization header format
4. **Token Refresh**: How to handle expiration
5. **Permissions**: Role-based access overview
6. **Code Examples**: Flutter examples

---

### `errors.md` - Error Handling

**Sections**:
1. **Error Response Format**:
   ```
   {
     "error": {
       "code": "ERROR_CODE",
       "message": "Human readable message",
       "details": { ... }
     }
   }
   ```
2. **HTTP Status Codes**: When each is used
3. **Error Codes**: Complete list with descriptions
4. **Handling Errors**: Best practices for clients

---

### `pagination.md` - Pagination Patterns

**Sections**:
1. **Query Parameters**: page, limit
2. **Response Format**: items, total, page, has_more
3. **Defaults and Limits**: Default page size, max limit
4. **Examples**: Request and response

---

### Endpoint Documentation Template

Each `endpoints/*.md` file should contain:

1. **Overview**: What this domain does
2. **Endpoints Table**: Quick reference
   | Method | Path | Description | Auth |
   |--------|------|-------------|------|
3. **Endpoint Details** (for each):
   - Description
   - Authentication requirement
   - Path parameters
   - Query parameters
   - Request body (with field descriptions)
   - Response body (with field descriptions)
   - Error responses
   - Example request
   - Example response

---

## Task 4: Keeping Docs in Sync

### OpenAPI as Source of Truth

1. Define endpoints with Pydantic schemas
2. Add docstrings to endpoint functions
3. Use `response_model` for response typing
4. FastAPI generates accurate OpenAPI spec

### Markdown Supplements OpenAPI

- Conceptual explanations
- Flow diagrams
- Code examples for specific SDKs
- Troubleshooting guides

### Sync Process

1. **On API change**: Update endpoint and schema docstrings
2. **On major change**: Update relevant markdown docs
3. **Before release**: Review OpenAPI spec, update examples
4. **Automated**: CI check that OpenAPI spec is valid

---

## Task 5: Example Documentation Sections

### Products Endpoint Doc Example

```markdown
# Products API

Endpoints for browsing and searching the product catalog.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/products | List products | Optional |
| GET | /api/v1/products/{id} | Get product details | Optional |
| GET | /api/v1/products/{id}/variants | Get variants | Optional |
| POST | /api/v1/products | Create product | Admin |
| PUT | /api/v1/products/{id} | Update product | Admin |
| DELETE | /api/v1/products/{id} | Delete product | Admin |

## GET /api/v1/products

List products with optional filters and pagination.

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20, max: 100) |
| category | string | No | Filter by category slug |
| brand | string | No | Filter by brand name |
| min_price | decimal | No | Minimum price |
| max_price | decimal | No | Maximum price |
| ar_enabled | boolean | No | Only AR-capable products |
| search | string | No | Search in name/description |

### Response

(describe response fields)

### Example

(show request and response)
```

---

## Task 6: Documentation Hosting

### Options

| Option | Pros | Cons |
|--------|------|------|
| **GitHub Pages** | Free, versioned with code | Manual setup |
| **Swagger Hub** | OpenAPI-native | Separate service |
| **ReadMe.io** | Beautiful, interactive | Paid |
| **Self-hosted** | Full control | Maintenance |

### Recommended: Embedded + GitHub Pages

1. OpenAPI UI at `/docs` (embedded in API)
2. Markdown docs on GitHub Pages (auto-deploy from `docs/`)
3. Link between them

---

## Expected Output

1. **Documentation structure** - folder and file organization
2. **Content specifications** - what each doc should contain
3. **Sync strategy** - keeping docs accurate
4. **Hosting recommendation** - where to publish
5. **No actual Markdown content** - just specifications
