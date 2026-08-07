# Save Notebook Implementation

## Current

Cloudflare Worker can:

- authenticate GitHub user
- create commits
- create .ipynb files

## Missing

Cloudflare Worker cannot yet receive
the notebook currently open in JupyterLite.

## Target

Notebook
    ↓
JSON
    ↓
POST /save-notebook
    ↓
content/notebooks/<filename>.ipynb
    ↓
feature/github-sync

## Success Criteria

- save current notebook
- overwrite existing notebook
- create commit
- Git history stores versions
