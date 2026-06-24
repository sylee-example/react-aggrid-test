# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


```
order-app/
├── package.json                    # @company/ui, @company/api-client 등 의존성
├── tsconfig.json                   # @company/config extends
├── .eslintrc.cjs                   # @company/config extends
├── vite.config.ts                  # path alias (@/ → src/)
│
└── src/
    │
    ├── app/                        # ── 앱 초기화 레이어 ──
    │   ├── App.tsx                 # 최상위 컴포넌트
    │   ├── providers/
    │   │   ├── index.tsx           # 모든 provider 조합
    │   │   ├── QueryProvider.tsx   # QueryClientProvider + 기본 옵션
    │   │   ├── StoreProvider.tsx   # redux Provider
    │   │   └── AntdProvider.tsx    # ConfigProvider + @company/ui 테마
    │   ├── router/
    │   │   ├── index.tsx           # createBrowserRouter, 라우트 정의
    │   │   └── ProtectedRoute.tsx  # 인증 가드
    │   ├── store/
    │   │   ├── index.ts            # configureStore + sagaMiddleware
    │   │   ├── rootReducer.ts      # feature별 slice 결합
    │   │   └── rootSaga.ts         # feature별 saga 결합
    │   └── main.tsx                # 진입점 (ReactDOM.render)
    │
    ├── pages/                      # ── 페이지(라우트) 레이어 ──
    │   ├── OrderListPage.tsx       # feature 조합만 담당
    │   ├── OrderDetailPage.tsx
    │   └── OrderCreatePage.tsx
    │
    ├── features/                   # ── 핵심 도메인 기능 레이어 ──
    │   │
    │   ├── order-list/
    │   │   ├── api/
    │   │   │   ├── useOrderList.ts      # react-query useQuery 훅
    │   │   │   └── queryKeys.ts         # 이 기능 쿼리 키
    │   │   ├── model/
    │   │   │   ├── slice.ts             # 필터/페이지 등 클라이언트 상태
    │   │   │   ├── saga.ts              # 비동기/사이드이펙트
    │   │   │   ├── selectors.ts
    │   │   │   └── types.ts             # Order, OrderFilter 등
    │   │   ├── ui/
    │   │   │   ├── OrderGrid.tsx        # ag-grid 테이블 (@company/ui 래퍼)
    │   │   │   ├── orderColumns.ts      # ag-grid 컬럼 정의 (colDef)
    │   │   │   ├── OrderFilterBar.tsx   # antd Form 필터
    │   │   │   └── cellRenderers/       # 이 그리드 전용 셀 렌더러
    │   │   └── index.ts                 # public API ★
    │   │
    │   ├── order-detail/
    │   │   ├── api/
    │   │   │   └── useOrderDetail.ts
    │   │   ├── model/
    │   │   │   └── types.ts
    │   │   ├── ui/
    │   │   │   ├── OrderSummary.tsx
    │   │   │   └── OrderItemTable.tsx
    │   │   └── index.ts
    │   │
    │   └── order-create/
    │       ├── api/
    │       │   └── useCreateOrder.ts   # react-query useMutation
    │       ├── model/
    │       │   ├── schema.ts           # 폼 유효성 스키마
    │       │   └── types.ts
    │       ├── ui/
    │       │   └── OrderForm.tsx        # antd Form
    │       └── index.ts
    │
    └── shared/                     # ── 앱 내 공용 레이어 ──
        ├── ui/                     # 이 앱에서만 쓰는 공통 컴포넌트
        │   ├── PageHeader.tsx
        │   └── EmptyState.tsx
        ├── lib/                    # 헬퍼, 포맷터, 커스텀 훅
        │   ├── formatDate.ts
        │   └── useDebounce.ts
        ├── config/                # 앱 내 상수, enum, 라우트 경로
        │   └── routes.ts
        └── types/                 # 이 앱 전반에서 쓰는 타입
            └── common.ts
```
