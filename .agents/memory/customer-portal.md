---
name: Customer portal features
description: What customer portal supports — review, note/extras, cancel, edit
---

Customer-facing booking actions (all require Bearer token from `/api/customer/login`):
- Cancel: `PUT /customer/bookings/:id/cancel` — only pending/confirmed + upcoming
- Edit date/time/notes: `PUT /customer/bookings/:id/edit` — only pending + upcoming
- Add note/extras: `PUT /customer/bookings/:id/note` — pending/confirmed + upcoming; appends `[Customer note] <text>` to notes, preserving existing notes
- Leave review: `POST /customer/bookings/:id/review` — only `done` status + `hasReview === false`

`bookingsTable` has a `hasReview` boolean column (default false). Set to true when review submitted.

Reviews go into `reviewsTable` (public reviews page). CustomerDashboard shows a gold star "Leave a review" button on done bookings, purple "Add note / extras" button on pending/confirmed.

**Why:** hasReview prevents duplicate reviews per booking. [Customer note] tag allows server to distinguish customer additions from original booking notes.
