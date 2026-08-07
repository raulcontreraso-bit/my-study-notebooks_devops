# Cloudflare Worker Architecture

## Purpose

This Cloudflare Worker acts as the secure backend for JupyterLite.

┌───────────────────┐
│     Browser       │
│   (JupyterLite)   │
└─────────┬─────────┘
          │
          │ HTTPS
          ▼
┌───────────────────┐
│ Cloudflare Worker │
│ jupyterlite-sync  │
└─────────┬─────────┘
          │
          ├─────────────────────┐
          │                     │
          ▼                     ▼
┌────────────────┐    ┌────────────────┐
│ GitHub OAuth   │    │   GitHub API   │
│ Authentication │    │ Repository API │
└────────────────┘    └────────────────┘
                                 │
                                 ▼
                    ┌────────────────────┐
                    │ my-study-notebooks │
                    │ _devops            │
                    └────────────────────┘



Responsibilities:

- Authenticate users with GitHub OAuth
- Maintain user sessions
- Verify repository ownership
- Write files to GitHub
- Protect repository updates

---

# Architecture

```text
JupyterLite
    ↓
Cloudflare Worker
    ↓
GitHub OAuth
    ↓
GitHub API
    ↓
Repository
```

---

# Endpoints

## GET /

Returns service information.

Example:

```json
{
  "service": "jupyterlite-sync",
  "status": "online",
  "version": "0.2.0"
}
```

Purpose:

- Service identification
- Basic diagnostics

---

## GET /health

Health check endpoint.

Example:

```json
{
  "healthy": true
}
```

Purpose:

- Monitoring
- Availability checks

---

## GET /info

Returns project configuration.

Example:

```json
{
  "service": "jupyterlite-sync",
  "owner": "raulcontreraso-bit",
  "repository": "my-study-notebooks_devops",
  "oauthConfigured": true
}
```

Purpose:

- Environment diagnostics
- Configuration validation

---

## GET /auth/login

Starts GitHub OAuth authentication.

Flow:

```text
User
  ↓
/auth/login
  ↓
GitHub OAuth
```

Purpose:

- User authentication

---

## GET /callback

OAuth callback endpoint.

Responsibilities:

1. Receive authorization code
2. Exchange code for access token
3. Retrieve GitHub user
4. Create session cookie

Purpose:

- Complete OAuth authentication

---

## GET /whoami

Returns authenticated user information.

Example:

```json
{
  "authenticated": true,
  "login": "raulcontreraso-bit"
}
```

Purpose:

- Session validation
- User identification

Safety rules:

Reject:

```text
undefined
null
empty values
```

Example:

```json
{
  "authenticated": false
}
```

---

## GET /logout

Clears authentication cookie.

Purpose:

- Manual session reset
- Recovery from corrupted cookies

---

## GET /save

Protected endpoint.

Requirements:

```text
github_user=raulcontreraso-bit
```

Process:

```text
Verify user
   ↓
Generate unique filename
   ↓
Commit file to GitHub
```

Purpose:

- Repository updates
- Future notebook persistence

---

# Cookie Strategy

Cookie Name:

```text
github_user
```

Example:

```text
github_user=raulcontreraso-bit
```

Security:

- HttpOnly
- Secure
- SameSite=Lax

Purpose:

- Session persistence
- Lightweight authentication

---

# Failure Protection

## Problem

A corrupted cookie may contain:

```text
github_user=undefined
```

Example result:

```json
{
  "authenticated": true,
  "login": "undefined"
}
```

## Solution

Validate before accepting:

```javascript
if (
  !login ||
  login === "undefined" ||
  login === "null"
)
```

Result:

```json
{
  "authenticated": false
}
```

---

# GitHub Integration

Uses:

```text
GITHUB_REPO_TOKEN
```

Permissions:

```text
Contents: Read and Write
```

Stored as:

```text
Cloudflare Secret
```

Never exposed to:

- Browser
- JupyterLite
- Public repository

---

# Current Milestones

Completed:

- GitHub Pages
- JupyterLite
- OAuth Authentication
- Session Cookies
- User Verification
- GitHub Repository Writes
- Automated Commit Creation

Next:

- Save notebook content
- Commit .ipynb files
- JupyterLite Save button integration
- Notebook versioning
