# Save Notebook Design

## Goal

Allow authenticated repository owners to save JupyterLite notebooks directly to GitHub.

## Flow

```text
Notebook
   ↓
Save
   ↓
POST /save-notebook
   ↓
Cloudflare Worker
   ↓
GitHub Repository
```

## Storage Location

```text
content/notebooks/
```

## Authentication

Required:

```text
github_user=raulcontreraso-bit
```

## Branch

```text
feature/github-sync
```

## Strategy

Overwrite existing notebook.

Example:

```text
content/notebooks/my-notebook_1.ipynb
```

Git tracks version history automatically.

## Future Improvements

- notebook autosave
- save status indicator
- commit messages based on notebook name
- notebook restore from Git history
