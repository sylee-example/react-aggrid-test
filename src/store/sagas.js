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
      {
        id: 6,
        name: '최지훈',
        email: 'choi@example.com',
        department: 'engineering',
        skills: ['react', 'java', 'spring'],
        status: 'active',
        note: '풀스택 개발자',
      },
      {
        id: 7,
        name: '강민지',
        email: 'kang@example.com',
        department: 'design',
        skills: ['figma'],
        status: 'inactive',
        note: '그래픽 디자이너',
      },
      {
        id: 8,
        name: '윤성호',
        email: 'yoon@example.com',
        department: 'sales',
        skills: ['analytics'],
        status: 'active',
        note: '영업 담당자',
      },
      {
        id: 9,
        name: '임혜린',
        email: 'lim@example.com',
        department: 'marketing',
        skills: ['seo', 'analytics'],
        status: 'active',
        note: '콘텐츠 마케터',
      },
      {
        id: 10,
        name: '오준석',
        email: 'oh@example.com',
        department: 'engineering',
        skills: ['java', 'spring', 'kubernetes'],
        status: 'active',
        note: '데브옵스 엔지니어',
      },
      {
        id: 11,
        name: '신예은',
        email: 'shin@example.com',
        department: 'hr',
        skills: ['recruitment'],
        status: 'inactive',
        note: '채용 담당자',
      },
      {
        id: 12,
        name: '배성준',
        email: 'bae@example.com',
        department: 'engineering',
        skills: ['typescript', 'react'],
        status: 'active',
        note: '프론트엔드 개발자',
      },
      {
        id: 13,
        name: '조하늘',
        email: 'jo@example.com',
        department: 'sales',
        skills: ['analytics'],
        status: 'active',
        note: '세일즈 매니저',
      },
      {
        id: 14,
        name: '한지수',
        email: 'han@example.com',
        department: 'design',
        skills: ['figma', 'photoshop'],
        status: 'active',
        note: '브랜드 디자이너',
      },
      {
        id: 15,
        name: '문태양',
        email: 'moon@example.com',
        department: 'engineering',
        skills: ['java', 'spring'],
        status: 'inactive',
        note: '백엔드 개발자',
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
