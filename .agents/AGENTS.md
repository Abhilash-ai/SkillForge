# Engineering Principles & Quality Assurance

SkillForge must be built as a real-world, production-grade software product. The application must solve actual user problems and be capable of supporting real users from day one.

## Non-Negotiable Development Rules
- **Never build placeholder pages.**
- **Never generate fake functionality.** (No hardcoded mock data in UI components).
- **Never leave buttons, forms, or actions non-functional.**
- **Never create UI elements without implementing their complete backend logic.**
- **Never prioritize aesthetics over usability.**
- **Never ship unfinished features.**

## Implementation Workflow
For every feature added:
1. First analyze requirements and dependencies.
2. Check whether the feature already exists.
3. Verify compatibility with existing architecture.
4. Identify possible conflicts before implementation.
5. Implement the feature completely (Full Stack).
6. Test the feature in isolation.
7. Test integration with all related modules.
8. Test responsiveness across devices.
9. Test edge cases and failure scenarios.
10. Only then merge into production.

## Pre-Implementation Checks
Before adding any new functionality, always perform:
- Scan the entire codebase.
- Understand existing architecture.
- Detect duplicate functionality, naming conflicts, and dependency conflicts.
- Verify database schema and API compatibility.
- Verify authentication and authorization requirements.

## Post-Implementation Testing
After implementation, automatically perform:
- Unit, Integration, End-to-End, and Regression testing.
- API, Form validation, Authentication, and Database testing.
- Performance, Accessibility, and Mobile responsiveness testing.

## Automated Quality Pipeline
Whenever code changes are introduced:
- Run linting and type checking automatically.
- Run all existing tests automatically.
- Detect broken imports, unused code, memory leaks, security vulnerabilities, performance regressions, broken routes, and broken state management.
- Fix errors automatically whenever possible.

## Architecture Requirements
- Follow clean architecture principles and SOLID principles.
- Use modular and scalable folder structures with reusable components.
- Avoid code duplication. Separate business logic from UI.
- Maintain strict TypeScript typing. Keep code self-documenting.

## Production Readiness Requirements
- Proper loading states everywhere and skeleton loaders.
- Graceful error boundaries and retry mechanisms.
- Input sanitization and rate limiting.
- Secure authentication, protected routes, and session management.
- Audit logs where necessary, proper logging and monitoring.
- SEO optimization, accessibility compliance, and high performance.

# Continuous Test -> Fix -> Retest Workflow

Adopt a strict 'Build -> Test -> Fix -> Retest -> Validate' development cycle throughout the entire project.

For every change, feature, refactor, UI update, API integration, or dependency update, always follow this workflow:

STEP 1: PRE-CHANGE ANALYSIS
STEP 2: IMPLEMENTATION
STEP 3: IMMEDIATE TESTING (Unit, Integration, E2E, API, Auth, Database, UI, a11y)
STEP 4: ERROR DETECTION
STEP 5: AUTOMATIC FIXING
STEP 6: RETEST
STEP 7: FINAL VALIDATION

GLOBAL RULE: Never stop after implementation. Always: BUILD -> TEST -> FIX -> RETEST -> VALIDATE -> DEPLOY.
