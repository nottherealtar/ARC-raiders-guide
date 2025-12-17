# Architecture Documentation

## Feature-Layered Architecture

This application follows a **feature-layered architecture** pattern, organizing code by features rather than technical layers.

### Structure

```
app/
├── features/          # Feature modules
│   ├── [feature-name]/
│   │   ├── components/    # Feature-specific UI components
│   │   ├── hooks/         # Feature-specific React hooks
│   │   ├── services/      # Business logic and API calls
│   │   ├── types/         # TypeScript types and interfaces
│   │   ├── utils/         # Feature-specific utilities
│   │   └── index.ts       # Public API exports
│   └── ...
├── components/        # Shared/common components
├── lib/              # Shared utilities and configurations
└── ...
```

### Principles

1. **Feature Cohesion**: Each feature contains all its related code (components, logic, types, etc.)
2. **Clear Boundaries**: Features expose only what's necessary through their `index.ts` files
3. **Shared Resources**: Common components and utilities live in `components/` and `lib/`
4. **Scalability**: New features can be added without affecting existing ones

### Benefits

- **Easier Navigation**: Related code is co-located
- **Better Maintainability**: Changes are isolated to feature boundaries
- **Improved Collaboration**: Teams can work on different features independently
- **Clear Dependencies**: Import paths show feature relationships

### Example Feature Structure

```typescript
// app/features/user-profile/index.ts
export { UserProfile } from './components/UserProfile'
export { useUserProfile } from './hooks/useUserProfile'
export type { UserProfileData } from './types'
```

### Guidelines

- Keep features independent when possible
- Use the shared `components/` folder for truly reusable UI elements
- Place cross-cutting concerns (auth, routing, etc.) in `lib/`
- Each feature should have a clear, single responsibility
