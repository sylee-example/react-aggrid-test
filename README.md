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
레이어 규칙
의존성 방향 (단방향)
상위 레이어는 하위 레이어만 의존할 수 있습니다. 역방향은 금지합니다.
Text
features는 다른 features를 직접 import 하지 않습니다.
두 개 이상의 feature가 공유하는 코드는 shared로 내리거나, 다른 앱도 쓴다면 @company/* 패키지로 승격합니다.
Public API 규칙
외부에서는 feature 내부 경로로 직접 접근하지 않고, 반드시 index.ts를 통해서만 가져옵니다.
Text
eslint-plugin-boundaries로 위 두 규칙을 강제하는 것을 권장합니다.
feature 내부 3분할 (api / model / ui)
모든 feature는 동일한 3분할을 따릅니다. 어느 앱 어느 기능을 열어도 같은 자리에서 같은 종류의 파일을 찾게 하기 위함입니다.
폴더
역할
관련 스택
api
서버 상태 (조회/변경)
react-query, axios
model
클라이언트 상태 + 타입
redux-saga, slice
ui
컴포넌트
antd, ag-grid
상태 관리 경계 (react-query vs redux-saga)
종류
위치
예시
서버 상태
api/ (react-query)
주문 목록, 주문 상세
클라이언트 상태
model/ (redux-saga)
선택된 필터, 모달 열림, 다단계 폼 진행
같은 데이터를 양쪽에서 중복 관리하지 않도록 경계를 명확히 합니다.
ag-grid 컨벤션
공통 설정(defaultColDef, 로케일, 페이지네이션)은 @company/ui의 그리드 래퍼에 둡니다.
각 feature는 컬럼 정의(orderColumns.ts)만 분리해서 주입합니다.
셀 렌더러는 재사용 범위로 위치를 결정합니다.
이 그리드 전용 → feature 내부 ui/cellRenderers/
여러 앱 공유 → @company/ui로 승격
공통 패키지 (사내 private registry)
패키지
내용
@company/ui
antd 테마, 공통 컴포넌트, ag-grid 래퍼
@company/api-client
axios 인스턴스 (인터셉터, 에러 핸들링, 인증)
@company/types
여러 앱이 공유하는 공통 타입 (백엔드 계약 등)
@company/config
eslint-config, tsconfig, prettier
@company/store-utils
redux-saga 공통 유틸, 미들웨어
확장 가이드
시작은 app / pages / features / shared 4레이어로 충분합니다.
여러 feature가 공유하는 도메인 모델이 생기면 그때 entities/ 레이어를 추가합니다.
shared/에 쌓인 코드가 다른 앱에서도 필요해지면 @company/* 패키지로 승격합니다.
새 단위 앱은 이 구조를 스타터 템플릿에서 복제해 도메인 이름만 교체하여 시작합니다.
