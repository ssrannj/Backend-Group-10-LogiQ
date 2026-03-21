# Dev 2 Review Note on Dev 1 Day 1 Frontend PR

- **Reviewer**: Dev 2
- **Review Date**: 2026-03-20
- **Source**: feature/frontend-shell-auth-start

## Summary of Completed Frontend Work
- **Authentication**: Implemented `Login.jsx`, `Register.jsx`, and `AuthContext` for session management.
- **Protected Routes**: Added `ProtectedRoute.jsx` to guard sensitive paths.
- **Product Catalog**: Created a functional `Catalog.jsx` with `ProductCard` components.
- **Shared API Service**: Established `api.js` for centralized Axios configuration.
- **Checkout Flow**: Integrated initial bank transfer receipt upload.

## Identified Issues
1. **API Fragility**: The API base URL is hardcoded as `http://localhost:8080/api` in `api.js`. This will break in production/staging environments.
2. **State Handling/Memory Leak**: `ProductCard.jsx` uses `setTimeout` to reset toast indicators without unmount cleanup.
3. **Route Guard Persistence**: While functional, `AuthContext` depends on reactive state that should be more robustly synchronized with local storage for persistence on refresh.
4. **Error Handling**: API failure reporting in pages like `Checkout.jsx` relies on `console.error`. User-facing feedback should be prioritized.

## Small Safe Improvement Applied
Refactored `api.js` to use an environment variable for the base URL if available, improving configuration flexibility.
