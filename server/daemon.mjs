/**
 * 데몬 서버 (WebSocket)
 * - 주기적으로 직원 상태 변경 이벤트를 클라이언트에 푸시
 * - 실행: node server/daemon.mjs
 */
import { WebSocketServer } from 'ws'

const PORT = 4000
const wss = new WebSocketServer({ port: PORT })

// 샘플 직원 데이터
const employees = [
  { id: 1, name: '홍길동', department: 'engineering', status: 'active', cpu: 45 },
  { id: 2, name: '김철수', department: 'design', status: 'active', cpu: 30 },
  { id: 3, name: '이영희', department: 'marketing', status: 'inactive', cpu: 0 },
  { id: 4, name: '박민수', department: 'engineering', status: 'active', cpu: 72 },
  { id: 5, name: '정수진', department: 'hr', status: 'active', cpu: 15 },
]

// 랜덤 이벤트 생성기
function generateRandomEvent() {
  const eventTypes = [
    'STATUS_CHANGED',       // 직원 상태 변경
    'DATA_UPDATED',         // 데이터 업데이트
    'METRIC_UPDATED',       // 메트릭(CPU, 메모리 등) 업데이트
    'NOTIFICATION',         // 알림 메시지
  ]

  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
  const employee = employees[Math.floor(Math.random() * employees.length)]
  const timestamp = new Date().toISOString()

  switch (type) {
    case 'STATUS_CHANGED': {
      const newStatus = employee.status === 'active' ? 'inactive' : 'active'
      employee.status = newStatus
      return {
        type,
        payload: {
          id: employee.id,
          name: employee.name,
          field: 'status',
          oldValue: newStatus === 'active' ? 'inactive' : 'active',
          newValue: newStatus,
        },
        timestamp,
      }
    }
    case 'DATA_UPDATED': {
      const fields = ['department', 'name']
      const field = fields[Math.floor(Math.random() * fields.length)]
      const departments = ['engineering', 'design', 'marketing', 'hr', 'sales']
      const newValue = field === 'department'
        ? departments[Math.floor(Math.random() * departments.length)]
        : `${employee.name} (수정됨)`
      return {
        type,
        payload: {
          id: employee.id,
          field,
          value: newValue,
        },
        timestamp,
      }
    }
    case 'METRIC_UPDATED': {
      const newCpu = Math.floor(Math.random() * 100)
      const memory = Math.floor(Math.random() * 8192)
      employee.cpu = newCpu
      return {
        type,
        payload: {
          id: employee.id,
          name: employee.name,
          metrics: {
            cpu: newCpu,
            memory,
            activeConnections: Math.floor(Math.random() * 50),
          },
        },
        timestamp,
      }
    }
    case 'NOTIFICATION': {
      const messages = [
        `${employee.name}님이 로그인했습니다.`,
        `${employee.name}님의 작업이 완료되었습니다.`,
        `시스템 점검이 예정되어 있습니다.`,
        `새로운 배포가 시작되었습니다.`,
        `${employee.name}님이 파일을 업로드했습니다.`,
      ]
      return {
        type,
        payload: {
          message: messages[Math.floor(Math.random() * messages.length)],
          level: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)],
        },
        timestamp,
      }
    }
    default:
      return { type: 'UNKNOWN', payload: {}, timestamp }
  }
}

// 클라이언트 연결 관리
wss.on('connection', (ws) => {
  console.log('[데몬] 클라이언트 연결됨. 현재 접속 수:', wss.clients.size)

  // 연결 시 초기 데이터 전송
  ws.send(JSON.stringify({
    type: 'INITIAL_DATA',
    payload: { employees: [...employees] },
    timestamp: new Date().toISOString(),
  }))

  // 3초마다 랜덤 이벤트 전송
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const event = generateRandomEvent()
      ws.send(JSON.stringify(event))
      console.log(`[데몬] 이벤트 전송: ${event.type}`, JSON.stringify(event.payload))
    }
  }, 3000)

  // 클라이언트 메시지 수신 (요청-응답 패턴도 지원)
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      console.log('[데몬] 클라이언트 메시지 수신:', data)

      // FETCH_ALL 요청 시 전체 데이터 반환
      if (data.type === 'FETCH_ALL') {
        ws.send(JSON.stringify({
          type: 'INITIAL_DATA',
          payload: { employees: [...employees] },
          timestamp: new Date().toISOString(),
        }))
      }
    } catch (err) {
      console.error('[데몬] 메시지 파싱 오류:', err)
    }
  })

  ws.on('close', () => {
    clearInterval(interval)
    console.log('[데몬] 클라이언트 연결 종료. 현재 접속 수:', wss.clients.size)
  })

  ws.on('error', (err) => {
    clearInterval(interval)
    console.error('[데몬] WebSocket 에러:', err)
  })
})

console.log(`[데몬] WebSocket 서버가 ws://localhost:${PORT} 에서 실행 중...`)
console.log('[데몬] 3초마다 랜덤 이벤트를 클라이언트에 전송합니다.')
