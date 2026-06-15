---
name: Twilio SMS integration
description: How Twilio SMS is integrated — config storage, sending pattern, cache invalidation
---

Twilio credentials are stored in `settingsTable` (same pattern as Brevo):
- `twilioAccountSid` (text, nullable)
- `twilioAuthToken` (text, nullable)
- `twilioFromNumber` (text, nullable)

SMS sending is in `artifacts/api-server/src/lib/sms.ts`. Uses Twilio REST API directly via `fetch` (no SDK), same approach as Brevo email. Auth is Basic base64(AccountSid:AuthToken).

The lib has a lazy cached config getter (60s TTL) and `invalidateSmsConfigCache()` called from settings PUT route.

Phone normalisation: strips spaces, converts 07xxx → +447xxx automatically.

**Why:** No Twilio SDK installed; fetch approach keeps bundle lean and matches existing Brevo pattern.

**How to apply:** Call `sendBookingReceivedSms`, `sendBookingConfirmationSms`, or `sendCarReadySms` from bookings route. Always `.catch()` to avoid failing the main request. Admin settings page has Account SID, Auth Token (masked), From Number fields + Test SMS button (`POST /api/settings/test-sms`).
