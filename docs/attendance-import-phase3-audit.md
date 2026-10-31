# Attendance Import Phase 3 — Frontend Audit

Date: 2026-10-24

## Contract found in this checkout

| Area | Current evidence | Finding |
|---|---|---|
| Import dialog | `src/modules/attendance-sync/ImportSyncDialog.vue` | File selection and DAT parse are local. The explicit **Lưu vào database** action invokes the import service. |
| GraphQL client | `src/services/graphql/apollo.ts` | Reuse the existing Apollo client, session refresh/auth link, and configured URI (`VITE_API_URL` or `/graphql`). |
| Existing mutation | `src/services/modules/attendance-import.service.ts`, also documented in `src/modules/attendance-sync/README.md` | `ghiNhanMayChamCongTheoLo(rows: [AttendanceFrontendRowInput!]!)`; the selected response fields are the existing `AttendanceInsertResult` wrapper and `trangThai/tongBanGhi/soBanGhiMoi/soBanGhiTrung/soBanGhiLoi/soBanGhiChuaMapping/loi`. |
| Existing input DTO | `src/modules/attendance-sync/sync.types.ts` and user-supplied DTO | `line`, `machineNo`, `user`, `time`, `eventType`, `rawStatus`, `raw`, `status`, `message`. Keep field names/types as this existing mutation expects. |
| Local duplicate rule | `src/modules/attendance-sync/sync.utils.ts` | Machine number + machine user code + local timestamp + event type; duplicates and invalid lines are tagged before save. |
| Backend schema/runtime | No backend project, GraphQL schema, introspection output, or deployment endpoint is present in the available workspace. | Cannot verify deployed version, server-side max, timezone scalar behavior, auth policy, or SQL transaction behavior from this checkout. |

## Difference from the Phase 2 reference

The Phase 2/3 documents show an indicative `importAttendanceBatch(input: ...)` contract with `importSessionId`, `batchId`, and normalized `records`. That operation and its schema are not present in this frontend checkout. The existing operation above is the only concrete import contract found here, so this frontend change retains it and does not invent new GraphQL fields or claim that the proposed Phase 2 contract is deployed.

## Changes in this frontend pass

- Keep local parse/preview separate from persistence; selecting or parsing a file does not invoke GraphQL.
- Filter `status === 'VALID'` both in the dialog and service boundary. Local duplicates and invalid rows are excluded from GraphQL variables.
- Retain sequential batches capped at 2,000 rows per request and Apollo's current auth/error path.
- Preserve acknowledged partial counts on an uncertain later batch; stop on the first uncertain batch and never retry it automatically.
- No REST upload/status polling, backend, database, schema, or GraphQL contract changes.

## Idempotency and remaining gate

The current input contract has no session/batch identifiers or durable idempotency key. Therefore an uncertain timeout is not safe to auto-retry; the UI keeps the file in an uncertain state. To adopt the Phase 2 `importAttendanceBatch` operation and stable retry IDs, provide or expose its actual deployed schema/introspection and backend contract first. Network behavior against the live backend was not available for verification in this workspace.
