# QA Bug Log - Sprint 2

| Bug ID | Module | Summary | Steps to Reproduce | Expected | Actual | Severity | Status | Assigned To |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| BUG-001 | Checkout-Upload | No file extension validation | Upload an .exe or .zip as receipt | System blocks invalid formats | All extensions accepted | High | Open | Dev 2 |
| BUG-002 | Email-Flow | Hardcoded recipient email | Trigger any admin verification | Send to actual user | Hardcoded to customer@example.com | Medium | Open | Dev 1 |
| BUG-003 | Checkout-Upload | Missing file size limit | Upload a very large file | Error message for size limit | No check, possible server crash | Medium | Open | Dev 2 |

### Status Summary
**Date:** 2026-03-20 (Afternoon)
**Current State:** Audited developer branches for Checkout, Wishlist, Admin Verify, and Email.
**Result:** 3 bugs found in Checkout and Email flows. Wishlist and Admin UI are stable.


---
*Please use the `qa/bug-template.md` for detailed reports if new bugs are discovered during testing.*
