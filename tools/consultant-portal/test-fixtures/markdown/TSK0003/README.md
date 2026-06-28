# TSK0003 Markdown Test Fixtures

These files are sample Markdown documents used for manual integration testing
and future regression coverage of the structured Markdown form editor.

They are not production documents and should not be loaded by the application
unless explicitly used in a test or demo workflow.

## Suggested checks

- Preview rendering for supported Markdown blocks.
- Structured editing for paragraphs and table cells.
- Readonly rendering for code blocks and unsupported Markdown.
- Save/reload round-trip through the existing document update endpoint.
- Edit footer append behavior.
- Regression check for raw HTML safety.
