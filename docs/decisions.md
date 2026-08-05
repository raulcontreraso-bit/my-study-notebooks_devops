# Architectural Decisions

## Decision 1

Repository Owner:
Raul

Only repository owner may write to the main repository.

## Decision 2

Public users may:

- Read notebooks
- Execute notebooks
- Fork repository

Public users may not:

- Commit to main repository
- Modify repository contents

## Decision 3

Persistence must be GitHub-backed.

Browser storage is considered temporary.

## Decision 4

No Personal Access Tokens stored in JupyterLite.

Authentication must use a secure mechanism.
