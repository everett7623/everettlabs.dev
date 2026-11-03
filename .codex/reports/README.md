# Maintenance reports

Generated candidate discovery reports land here as
`project-candidates-YYYY-MM-DD.md` and `project-candidates-latest.md`.

These files are local and CI artifacts. They are gitignored so monthly automation
never commits speculative project recommendations. Editorial MDX and
`src/utils/approved-repositories.ts` remain the only sources of truth for what
the public site lists.
