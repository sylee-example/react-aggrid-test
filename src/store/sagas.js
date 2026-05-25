import { put, takeLatest, delay, fork } from 'redux-saga/effects'
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from './gridSlice'
import socketSaga from './socketSaga'

// 샘플 데이터 로드 saga
function* fetchDataSaga() {
  try {
    yield delay(500) // API 호출 시뮬레이션

    const sampleData = [
      {
        id: 1,
        name: '홍길동',
        email: 'hong@example.com',
        department: 'engineering',
        skills: ['react', 'typescript'],
        status: 'active',
        note: '프론트엔드 개발자',
      },
      {
        id: 2,
        name: '김철수',
        email: 'kim@example.com',
        department: 'design',
        skills: ['figma', 'photoshop'],
        status: 'active',
        note: 'UI/UX 디자이너',
      },
      {
        id: 3,
        name: '이영희',
        email: 'lee@example.com',
        department: 'marketing',
        skills: ['seo', 'analytics'],
        status: 'inactive',
        note: '마케팅 매니저',
      },
      {
        id: 4,
        name: '박민수',
        email: 'park@example.com',
        department: 'engineering',
        skills: ['java', 'spring', 'kubernetes'],
        status: 'active',
        note: '백엔드 개발자',
      },
      {
        id: 5,
        name: '정수진',
        email: 'jung@example.com',
        department: 'hr',
        skills: ['recruitment'],
        status: 'active',
        note: '인사 담당자',
      },
    ]

    yield put(fetchDataSuccess(sampleData))
  } catch (error) {
    const message = error instanceof Error ? error.message : '데이터 로드 실패'
    yield put(fetchDataFailure(message))
  }
}

export default function* rootSaga() {
  yield takeLatest(fetchDataRequest.type, fetchDataSaga)
  yield fork(socketSaga)
}
