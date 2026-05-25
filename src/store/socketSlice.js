import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  connected: false,
  // 서버에서 수신한 실시간 직원 데이터
  realtimeData: [],
  // 최근 이벤트 로그
  eventLog: [],
  // 알림 목록
  notifications: [],
  // 메트릭 데이터 (id별)
  metrics: {},
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // WebSocket 연결 요청
    connectWebSocket() {
      // saga에서 처리
    },
    // WebSocket 연결 해제 요청
    disconnectWebSocket() {
      // saga에서 처리
    },
    // 연결 상태 변경
    setConnected(state, action) {
      state.connected = action.payload
    },
    // 초기 데이터 수신
    receiveInitialData(state, action) {
      state.realtimeData = action.payload
    },
    // 상태 변경 이벤트 수신 (특정 행의 필드 업데이트)
    receiveStatusChange(state, action) {
      const { id, field, newValue } = action.payload
      const row = state.realtimeData.find((r) => r.id === id)
      if (row) {
        row[field] = newValue
      }
    },
    // 데이터 업데이트 이벤트 수신
    receiveDataUpdate(state, action) {
      const { id, field, value } = action.payload
      const row = state.realtimeData.find((r) => r.id === id)
      if (row) {
        row[field] = value
      }
    },
    // 메트릭 업데이트 수신
    receiveMetricUpdate(state, action) {
      state.metrics[action.payload.id] = action.payload
    },
    // 알림 수신
    receiveNotification(state, action) {
      state.notifications.unshift(action.payload)
      // 최대 20개만 유지
      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(0, 20)
      }
    },
    // 이벤트 로그 추가
    addEventLog(state, action) {
      state.eventLog.unshift(action.payload)
      // 최대 50개만 유지
      if (state.eventLog.length > 50) {
        state.eventLog = state.eventLog.slice(0, 50)
      }
    },
    // 알림 삭제
    clearNotifications(state) {
      state.notifications = []
    },
    // 서버에 메시지 전송 요청
    sendMessage() {
      // saga에서 처리
    },
  },
})

export const {
  connectWebSocket,
  disconnectWebSocket,
  setConnected,
  receiveInitialData,
  receiveStatusChange,
  receiveDataUpdate,
  receiveMetricUpdate,
  receiveNotification,
  addEventLog,
  clearNotifications,
  sendMessage,
} = socketSlice.actions

export default socketSlice.reducer
