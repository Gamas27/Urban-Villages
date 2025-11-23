# Clean Architecture Refactoring Analysis

## Current State Assessment

### Architecture Overview
- **Frontend**: React/Next.js with ~88 components (15-20 main features)
- **State Management**: Zustand stores (blockchainStore, backendStore, userStore)
- **API Layer**: Thin API clients (`bottleApi`, `corkApi`, etc.) - mostly wrappers
- **Blockchain**: Direct SUI SDK calls scattered across codebase
- **Backend**: Next.js API routes (`/api/mint-purchase`, etc.)
- **Database**: Supabase (PostgreSQL)

### Current Issues
1. **Business Logic in Components**: Components like `Collection.tsx` contain data transformation logic
2. **No Service Layer**: API clients are thin wrappers, no business logic abstraction
3. **No Repository Pattern**: Direct blockchain calls (`getCorkBalance`, `getOwnedBottles`) in stores
4. **No Dependency Injection**: Hard-coded dependencies, difficult to test
5. **Mixed Concerns**: Stores contain both state and business logic
6. **Tight Coupling**: Components directly import blockchain functions and API clients

### Codebase Size
- **Components**: ~88 files (15-20 main features)
- **API Routes**: ~8 routes
- **Stores**: 3 main stores
- **API Clients**: ~5 clients
- **Blockchain Functions**: ~10 direct blockchain functions

---

## Refactoring Options

### Option 1: **Incremental Migration** (Recommended) ⭐
**Timeline**: 2-3 weeks (1 developer) or 1-2 weeks (2 developers)

**Approach**: Refactor one feature at a time, maintaining backward compatibility

**Steps**:
1. **Week 1**: Set up infrastructure
   - Create DI container (using `tsyringe` or custom)
   - Create base repository interfaces
   - Create service layer structure
   - Refactor one small feature (e.g., CORK balance) as proof of concept

2. **Week 2**: Migrate core features
   - Refactor blockchain layer (repositories)
   - Refactor NFT operations
   - Refactor purchase flow
   - Update stores to use services

3. **Week 3**: Complete migration
   - Refactor remaining features
   - Update all components
   - Add tests
   - Documentation

**Pros**:
- ✅ Low risk - can ship features during refactoring
- ✅ Gradual learning curve
- ✅ Can validate approach early
- ✅ Minimal disruption to active development

**Cons**:
- ⚠️ Temporary code duplication
- ⚠️ Requires discipline to maintain boundaries

**Estimated Effort**: 60-80 hours

---

### Option 2: **Big Bang Refactor**
**Timeline**: 1-2 weeks (2-3 developers)

**Approach**: Complete refactor in one go, feature freeze during refactoring

**Steps**:
1. Design complete architecture
2. Implement all layers simultaneously
3. Migrate all components at once
4. Comprehensive testing
5. Deploy

**Pros**:
- ✅ Clean slate, no technical debt
- ✅ Consistent architecture from day 1
- ✅ Faster overall (if done right)

**Cons**:
- ❌ High risk - everything breaks at once
- ❌ Feature freeze required
- ❌ Difficult to validate approach
- ❌ High cognitive load

**Estimated Effort**: 100-120 hours (with risk)

---

### Option 3: **Hybrid Approach** (Balanced)
**Timeline**: 2-3 weeks (1-2 developers)

**Approach**: Set up infrastructure first, then migrate features incrementally

**Steps**:
1. **Week 1**: Infrastructure + Core Layer
   - Set up DI container
   - Create all repository interfaces
   - Implement blockchain repository layer
   - Create service interfaces
   - Refactor stores to use services

2. **Week 2-3**: Feature Migration
   - Migrate features one by one
   - Update components as you go
   - Add tests incrementally

**Pros**:
- ✅ Good balance of speed and safety
- ✅ Infrastructure ready for all features
- ✅ Can parallelize feature migration

**Cons**:
- ⚠️ Some upfront investment before visible progress

**Estimated Effort**: 70-90 hours

---

## Proposed Clean Architecture Structure

```
app/
├── domain/                    # Domain entities and interfaces
│   ├── entities/
│   │   ├── BottleNFT.ts
│   │   ├── CorkToken.ts
│   │   └── User.ts
│   └── interfaces/
│       ├── repositories/
│       │   ├── IBottleRepository.ts
│       │   ├── ICorkRepository.ts
│       │   └── IUserRepository.ts
│       └── services/
│           ├── IPurchaseService.ts
│           └── ICollectionService.ts
│
├── infrastructure/             # External integrations
│   ├── blockchain/
│   │   ├── repositories/
│   │   │   ├── BottleRepository.ts
│   │   │   ├── CorkRepository.ts
│   │   │   └── SuiClientFactory.ts
│   │   └── services/
│   │       └── TransactionService.ts
│   ├── database/
│   │   └── repositories/
│   │       └── UserRepository.ts
│   └── storage/
│       └── WalrusRepository.ts
│
├── application/               # Business logic
│   ├── services/
│   │   ├── PurchaseService.ts
│   │   ├── CollectionService.ts
│   │   └── UserService.ts
│   └── use-cases/
│       ├── PurchaseBottleUseCase.ts
│       └── GetCollectionUseCase.ts
│
├── presentation/              # UI Layer (thin)
│   ├── components/           # Presentational components
│   ├── hooks/                 # Custom hooks (usePurchase, useCollection)
│   └── stores/               # State management (UI state only)
│
└── api/                      # API routes (thin controllers)
    └── routes/
        └── purchase/
            └── route.ts      # Just validates and calls service
```

---

## Dependency Injection Setup

### Using `tsyringe` (Recommended)

```typescript
// app/infrastructure/di/container.ts
import { container } from 'tsyringe';
import { SuiClient } from '@mysten/sui/client';
import { BottleRepository } from '../blockchain/repositories/BottleRepository';
import { PurchaseService } from '../../application/services/PurchaseService';

// Register repositories
container.registerSingleton('IBottleRepository', BottleRepository);
container.registerSingleton('ICorkRepository', CorkRepository);

// Register services
container.registerSingleton('IPurchaseService', PurchaseService);

// Register infrastructure
container.registerInstance('SuiClient', new SuiClient({...}));
```

### Usage in Components

```typescript
// app/presentation/hooks/usePurchase.ts
import { container } from 'tsyringe';
import { IPurchaseService } from '@/application/interfaces/services/IPurchaseService';

export function usePurchase() {
  const purchaseService = container.resolve<IPurchaseService>('IPurchaseService');
  // ... hook logic
}
```

---

## Migration Strategy (Incremental)

### Phase 1: Infrastructure (Days 1-3)
- [ ] Set up DI container
- [ ] Create domain interfaces
- [ ] Create repository interfaces
- [ ] Set up folder structure

### Phase 2: Blockchain Layer (Days 4-6)
- [ ] Implement `BottleRepository`
- [ ] Implement `CorkRepository`
- [ ] Implement `TransactionRepository`
- [ ] Create `SuiClientFactory`

### Phase 3: Service Layer (Days 7-9)
- [ ] Implement `PurchaseService`
- [ ] Implement `CollectionService`
- [ ] Implement `UserService`
- [ ] Update stores to use services

### Phase 4: Component Migration (Days 10-14)
- [ ] Refactor `PurchaseModal` → use `PurchaseService`
- [ ] Refactor `Collection` → use `CollectionService`
- [ ] Refactor `Shop` → use services
- [ ] Update remaining components

### Phase 5: Testing & Cleanup (Days 15-17)
- [ ] Add unit tests for services
- [ ] Add integration tests
- [ ] Remove old code
- [ ] Documentation

---

## Key Benefits After Refactoring

1. **Testability**: Services and repositories can be easily mocked
2. **Maintainability**: Clear separation of concerns
3. **Scalability**: Easy to add new features
4. **Flexibility**: Can swap implementations (e.g., different blockchain)
5. **Team Collaboration**: Clear boundaries for parallel work
6. **Type Safety**: Interfaces ensure contracts are maintained

---

## Risk Assessment

### Low Risk ✅
- Incremental migration
- Feature-by-feature approach
- Maintain backward compatibility

### Medium Risk ⚠️
- Big bang approach
- Changing multiple features at once

### High Risk ❌
- Refactoring during active feature development
- No testing strategy
- Changing core infrastructure without validation

---

## Recommendation

**Go with Option 1 (Incremental Migration)** because:

1. **Low Risk**: Can continue shipping features
2. **Validated Approach**: Test architecture on one feature first
3. **Team Friendly**: Easier to review and understand
4. **Flexible**: Can adjust approach based on learnings
5. **Realistic Timeline**: 2-3 weeks is achievable

### Next Steps if Approved

1. Create detailed technical design document
2. Set up infrastructure (DI, folder structure)
3. Refactor one small feature as POC
4. Review and iterate
5. Continue with full migration

---

## Questions to Consider

1. **Timeline**: Can you afford 2-3 weeks of refactoring?
2. **Team Size**: How many developers can work on this?
3. **Active Development**: Are there urgent features that need shipping?
4. **Testing**: Do you have time/budget for comprehensive tests?
5. **Priority**: Is this refactoring urgent or can it wait?

---

## Alternative: Lightweight Refactoring

If full clean architecture is too much, consider a **lightweight refactoring**:

1. Extract business logic from components to services (no DI)
2. Create repository pattern for blockchain (no interfaces)
3. Keep stores but move logic to services
4. **Timeline**: 1 week
5. **Benefit**: 70% of the value, 30% of the effort

---

## Conclusion

**Full clean architecture refactoring is feasible** and will significantly improve code quality, but it's a **2-3 week investment**. 

The **incremental approach** is recommended to minimize risk while maximizing learning and validation.

Would you like me to:
1. Start with the infrastructure setup?
2. Create a detailed technical design?
3. Begin with a POC on one feature?
4. Discuss the lightweight alternative?


