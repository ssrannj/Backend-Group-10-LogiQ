# QA Bug Log - Sprint 2

| Bug ID | Module | Summary | Steps to Reproduce | Expected | Actual | Severity | Status | Assigned To |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| BUG-001 | Checkout-Upload | No file extension validation | Upload an .exe or .zip as receipt | System blocks invalid formats | All extensions accepted | High | **Fixed** | Dev 2 |
| BUG-002 | Email-Flow | Hardcoded recipient email | Trigger any admin verification | Send to actual user | Hardcoded to customer@example.com | Medium | **Fixed** | Dev 1 |
| BUG-003 | Checkout-Upload | Missing file size limit | Upload a very large file | Error message for size limit | No check, possible server crash | Medium | **Fixed** | Dev 2 |
| BUG-004 | Warranty | Guest can access warranty form | Guest should be redirected to login | Form accessible to all | High | **Pending** | Dev 1 |
| BUG-005 | Tracking | 500 Error on invalid/empty search | System should show 'Order not found' | Generic 500 error page | Low | **Pending** | Dev 1 |

### Status Summary
**Date:** 2026-03-21 (Morning)
**Current State:** Testing warranty and tracking features.
**Result:** Found 2 new bugs (BUG-004, BUG-005). BUG-002 is still pending. 2 previous bugs remain fixed.

---
*Please use the `qa/bug-template.md` for detailed reports if new bugs are discovered during testing.*
