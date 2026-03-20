# Dev 2 Day 1 Pull Request Log

- **PR Title**: [Sprint 2][Day 1] Backend auth, catalog, wishlist, upload and admin verification starter
- **Source Branch**: `feature/backend-shell-catalog-start`
- **Target Branch**: `develop`
- **Date**: 2026-03-20

## Summary of PR
The following backend and frontend foundations were established:

### Backend Implementation
- **AuthController**: JWT-based authentication shell and role-based access.
- **ProductController**: Catalog management and listing foundation.
- **WishlistController**: CRUD service logic for user wishlist persistence.
- **CheckoutController**: Bank transfer proof upload with local storage persistence and database state mapping.
- **AdminController**: Verification endpoints for administrative order approval.

### Frontend Integration
- **Shared API Service**: Refactored to support environment-based configuration.
- **Service Layering**: Established `authService.js` and `trackingService.js` for clean separation of concerns.

### Known Limitations
- Backend URL requires setting VITE_API_BASE_URL for non-local environments.
- Sourcing and warehouse data currently utilize placeholder fields.
- Minimal MVP tracking displays only mocked milestone data.
