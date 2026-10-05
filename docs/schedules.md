# Module xếp ca

Entry: /schedules. Five routes: calendar (default), assign, templates, swaps, reports.

The v2 schedule adapter is a localStorage demo behind privateApi, not an implementation of the proposed REST endpoints. The catalog is provided by src/mock/data/schedule.ts through scheduleService.load; views never define shift names. Existing mock assignments are migrated on first use. New records use separate hotel-shift-scheduling-v2 storage and do not overwrite legacy records.

Assignments are committed as one local write after duplicate/day/leave/overnight overlap validation. Preview is required before every commit. Existing assignments are edited explicitly using their ID and revision. No override operation is supplied. Templates can be stopped, copied and applied; deletion and Excel export are omitted because backend capabilities have not been defined.

Swap approvals check source revisions, reject already processed requests, check overlap and update both assignments with the request in one write. Rejection does not change assignments. The existing module/action permission store is used; proposed SHIFT_* permission names and employee ownership rules must be mapped once backend contracts are available. The demo adapter does not establish production authorization or cross-tab concurrency guarantees.

Reports count scheduled dates/assignments and OFF dates, not attendance, OT, paid hours, salary or staffing gaps. LEAVE is displayed separately from OFF in the calendar. Templates support 7-day weeks and variable cycles starting at the selected assignment start date.

For backend integration replace scheduleService with typed operations for catalog, range queries, server-side preview, atomic bulk writes, revision-checked swap decisions, audit history and aggregate reports. Reuse the current UI states and contextual errors. The legacy generic ScheduleDetailView was removed; existing /schedules/:id links redirect to the calendar. Other HR modules remain intact as requested.

Assignment entry defaults to a month calendar for individual and bulk modes. Select employees, then click dates to configure each date's shift, note and fullTime checkbox. The checkbox defaults to true; false denotes a half shift. Legacy records with no fullTime are treated as full shifts. Preview, detail and calendar display this choice. Exact half-shift clock intervals are not inferred; overlap checks continue to use the configured shift window until the backend defines those intervals. Bulk interval/template/cycle methods remain available as alternative entry modes.

The assignment calendar now uses employee rows with sticky Employee and Department columns. Department is an optional filter: blank shows all employees. Each draft is keyed by employeeId plus date; changing department/search only filters visible rows and retains drafts for preview. Click an employee/date cell to configure that employee's shift and fullTime. The separate employee picker is retained only for interval/template/cycle entry modes.
