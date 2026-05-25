import { eventChannel } from 'redux-saga'
import {
  take,
  put,
  call,
  fork,
  cancel,
  cancelled,
  takeLatest,
} from 'redux-saga/effects'
import {
  connectWebSocket,
  disconnectWebSocket,
  setConnected,
  receiveInitialData,
  receiveStatusChange,
  receiveDataUpdate,
  receiveMetricUpdate,
  receiveNotification,
  addEventLog,
  sendMessage,
} from './socketSlice'

const WS_URL = 'ws://localhost:4000'

// WebSocket eventChannel 생성
function createWebSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        emit(data)
      } catch (err) {
        console.error('[Saga] 메시지 파싱 오류:', err)
      }
    }

    socket.onerror = (event) => {
      console.error('[Saga] WebSocket 에러:', event)
    }

    socket.onclose = () => {
      console.log('[Saga] WebSocket 연결 종료')
    }

    // unsubscribe 함수 반환
    return () => {
      socket.close()
    }
  })
}

// 서버 이벤트를 수신하고 적절한 action으로 디스패치
function* handleServerEvent(event) {
  // 이벤트 로그에 기록
  yield put(addEventLog(event))

  switch (event.type) {
    case 'INITIAL_DATA': {
      const employees = event.payload.employees
      yield put(receiveInitialData(employees))
      break
    }
    case 'STATUS_CHANGED': {
      const { id, field, newValue } = event.payload
      yield put(receiveStatusChange({ id, field, newValue }))
      break
    }
    case 'DATA_UPDATED': {
      const { id, field, value } = event.payload
      yield put(receiveDataUpdate({ id, field, value }))
      break
    }
    case 'METRIC_UPDATED': {
      const { id, name, metrics } = event.payload
      yield put(receiveMetricUpdate({ id, name, metrics, timestamp: event.timestamp }))
      break
    }
    case 'NOTIFICATION': {
      const { message, level } = event.payload
      yield put(
        receiveNotification({
          id: `${Date.now()}-${Math.random()}`,
          message,
          level,
          timestamp: event.timestamp,
        }),
      )
      break
    }
    default:
      console.log('[Saga] 알 수 없는 이벤트:', event.type)
  }
}

// WebSocket 연결 및 메시지 수신 saga
let socketInstance = null

function* watchWebSocket() {
  try {
    // WebSocket 연결
    const socket = yield call(() => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL)
        ws.onopen = () => resolve(ws)
        ws.onerror = (err) => reject(err)
      })
    })

    socketInstance = socket
    yield put(setConnected(true))
    console.log('[Saga] WebSocket 연결 성공')

    // eventChannel 생성
    const channel = yield call(createWebSocketChannel, socket)

    // 채널에서 이벤트 수신 루프
    while (true) {
      const event = yield take(channel)
      yield fork(handleServerEvent, event)
    }
  } catch (err) {
    console.error('[Saga] WebSocket 연결 실패:', err)
    yield put(setConnected(false))
  } finally {
    const isCancelled = yield cancelled()
    if (isCancelled) {
      if (socketInstance) socketInstance.close()
      socketInstance = null
      yield put(setConnected(false))
      console.log('[Saga] WebSocket 연결 해제')
    }
  }
}

// 서버에 메시지 전송
function* handleSendMessage(action) {
  if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
    socketInstance.send(JSON.stringify(action.payload))
  }
}

// 연결/해제 관리 saga
function* manageConnection() {
  while (true) {
    yield take(connectWebSocket.type)
    const task = yield fork(watchWebSocket)

    yield take(disconnectWebSocket.type)
    yield cancel(task)
  }
}

export default function* socketSaga() {
  yield fork(manageConnection)
  yield takeLatest(sendMessage.type, handleSendMessage)
}
