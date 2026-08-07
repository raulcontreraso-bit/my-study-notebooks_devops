JupyterLite (browser)
        |
        | POST notebook JSON
        v
Cloudflare Worker
        |
        | GitHub API
        v
GitHub Repository




# Architecture

## Current

GitHub Repository
    ↓
GitHub Pages
    ↓
JupyterLite
    ↓
Browser Storage

## Target

GitHub Repository
    ↑
GitHub API
    ↑
Backend Service
    ↑
GitHub Authentication
    ↑
JupyterLite

## Rules

- Repository owner can write
- Public users can read
- Public users can run notebooks
- Public users cannot modify repository
- Public users may fork repository
