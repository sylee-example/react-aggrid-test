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
    │   │   ├── index.tsx           # 모든 provider 조합 (한 곳에서 export)
    │   │   ├── QueryProvider.tsx   # QueryClientProvider + 기본 옵션
    │   │   ├── StoreProvider.tsx   # redux Provider
    │   │   └── AntdProvider.tsx    # ConfigProvider + @company/ui 테마 주입
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
    │   ├── OrderListPage.tsx       # features/order-list 조합만 담당
    │   ├── OrderDetailPage.tsx     # features/order-detail 조합
    │   └── OrderCreatePage.tsx     # features/order-create 조합
    │
    ├── features/                   # ── 핵심 도메인 기능 레이어 ──
    │   │
    │   ├── order-list/
    │   │   ├── api/
    │   │   │   ├── useOrderList.ts      # react-query useQuery 훅
    │   │   │   └── queryKeys.ts         # 이 기능 쿼리 키
    │   │   ├── model/
    │   │   │   ├── slice.ts             # 필터/페이지 등 클라이언트 상태
    │   │   │   ├── saga.ts              # 복잡한 비동기/사이드이펙트
    │   │   │   ├── selectors.ts
    │   │   │   └── types.ts             # Order, OrderFilter 등
    │   │   ├── ui/
    │   │   │   ├── OrderGrid.tsx        # ag-grid 테이블 (@company/ui 래퍼 사용)
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
            핵심 설계 포인트 몇 가지만 짚으면:
features/[domain]/ 내부는 항상 api / model / ui 3분할. api는 서버 상태(react-query 훅), model은 클라이언트 상태(redux-saga slice·saga·selectors)와 타입, ui는 컴포넌트. 이 3분할을 모든 feature가 동일하게 따르면 어느 앱 어느 기능을 열어도 같은 자리에서 같은 종류의 파일을 찾게 됩니다. 멀티레포 일관성의 핵심입니다.
ag-grid는 컬럼 정의(orderColumns.ts)를 컴포넌트에서 분리. 그리드 컴포넌트(OrderGrid.tsx)는 @company/ui의 공통 래퍼(defaultColDef·로케일·페이지네이션이 박힌)를 가져와 쓰고, 이 앱 고유의 컬럼 정의만 주입합니다. 셀 렌더러는 재사용 범위에 따라 위치가 갈리는데, 이 그리드 전용이면 feature 안에, 여러 앱이 공유하면 @company/ui로 승격합니다.
index.ts public API가 FSD의 정체성. 외부(pages 등)에서는 features/order-list/ui/OrderGrid 같은 내부 경로로 직접 import하지 않고, 반드시 features/order-list(즉 index.ts)에서만 가져옵니다. 내부 구조를 자유롭게 리팩터링해도 바깥에 영향이 없어집니다. eslint-plugin-boundaries로 강제하면 규율이 무너지지 않습니다.
react-query와 redux-saga의 경계. 서버에서 받아오는 데이터(주문 목록·상세)는 전부 api/의 react-query로, 화면 전용 상태(선택된 필터, 모달 열림, 다단계 폼 진행 상태)나 여러 화면이 공유하는 복잡한 동기화만 model/의 redux-saga로. 이 경계가 흐려지면 같은 데이터를 두 곳에서 관리하게 되니 주의하세요.
shared/는 "대기실" 개념. 이 앱에서만 쓰는 공용은 여기 두되, 다른 단위 앱도 쓸 것 같으면 @company/* 패키지로 승격시키는 통로로 활용합니다. 앞서 말한 "중복 방어선"이 실제로 작동하는 지점입니다.
이 골격을 그대로 스타터 템플릿 레포로 만들어두면, 새 단위 앱은 도메인 이름만 바꿔 시작할 수 있습니다. feature가 더 늘거나 여러 feature가 공유하는 도메인 모델이 생기면 그때 entities/ 레이어를 추가하는 식으로 점진 확장하면 됩니다.
이 구조를 README 형태의 컨벤션 문서로 정리해드릴까요? 템플릿 레포에 같이 넣어두면 팀 전체가 같은 규칙을 따르기 좋습니다.
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
