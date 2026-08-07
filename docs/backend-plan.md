# Backend Plan

## Purpose

Provide secure access between JupyterLite and GitHub.

## Endpoints

### GET /auth/login

Start GitHub authentication.

### GET /auth/callback

Receive GitHub OAuth response.

### GET /whoami

Return authenticated user information.

### POST /save

Save notebook to repository.

## Security

- No GitHub tokens in JupyterLite
- Repository owner may write
- Public users are read-only
