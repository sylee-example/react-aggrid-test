import { useEffect, useMemo } from 'react'
import {
  Button,
  Tag,
  Badge,
  Card,
  List,
  Progress,
  Statistic,
  Alert,
  Space,
} from 'antd'
import {
  LinkOutlined,
  DisconnectOutlined,
  ClearOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { DataGrid } from '../components/grid'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  connectWebSocket,
  disconnectWebSocket,
  clearNotifications,
  sendMessage,
} from '../store/socketSlice'

// 부서명 매핑
const departmentMap = {
  engineering: '개발',
  design: '디자인',
  marketing: '마케팅',
  hr: '인사',
  sales: '영업',
}

// 상태 셀 렌더러
const StatusCellRenderer = (params) => {
  const color = params.value === 'active' ? 'green' : 'red'
  const text = params.value === 'active' ? '활성' : '비활성'
  return <Tag color={color}>{text}</Tag>
}

// 알림 레벨 색상
const levelColorMap = {
  info: 'blue',
  warning: 'orange',
  success: 'green',
  error: 'red',
}

const RealtimeDemoPage = () => {
  const dispatch = useAppDispatch()
  const { connected, realtimeData, eventLog, notifications, metrics } =
    useAppSelector((state) => state.socket)

  // 페이지 진입 시 자동 연결, 이탈 시 해제
  useEffect(() => {
    dispatch(connectWebSocket())
    return () => {
      dispatch(disconnectWebSocket())
    }
  }, [dispatch])

  // 실시간 그리드 컬럼 정의
  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        maxWidth: 70,
        flex: 0,
      },
      {
        field: 'name',
        headerName: '이름',
        minWidth: 120,
      },
      {
        field: 'department',
        headerName: '부서',
        valueFormatter: (params) =>
          departmentMap[params.value] ?? params.value,
      },
      {
        field: 'status',
        headerName: '상태',
        maxWidth: 100,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'cpu',
        headerName: 'CPU',
        maxWidth: 100,
        valueFormatter: (params) =>
          params.value != null ? `${params.value}%` : '-',
      },
    ],
    [],
  )

  // 메트릭 목록
  const metricList = Object.values(metrics)

  return (
    <div>
      {/* 상단: 연결 상태 + 컨트롤 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold m-0">실시간 데몬 서버 연동</h2>
          <Badge
            status={connected ? 'success' : 'error'}
            text={connected ? '연결됨' : '연결 끊김'}
          />
        </div>
        <Space>
          {!connected ? (
            <Button
              type="primary"
              icon={<LinkOutlined />}
              onClick={() => dispatch(connectWebSocket())}
            >
              연결
            </Button>
          ) : (
            <Button
              danger
              icon={<DisconnectOutlined />}
              onClick={() => dispatch(disconnectWebSocket())}
            >
              연결 해제
            </Button>
          )}
          <Button
            icon={<SyncOutlined />}
            onClick={() => dispatch(sendMessage({ type: 'FETCH_ALL' }))}
            disabled={!connected}
          >
            전체 데이터 요청
          </Button>
        </Space>
      </div>

      {!connected && (
        <Alert
          type="warning"
          message="데몬 서버에 연결되지 않았습니다."
          description="node server/daemon.mjs 명령어로 서버를 먼저 실행하세요."
          showIcon
          className="mb-4"
        />
      )}

      {/* 실시간 그리드 */}
      <Card title="실시간 직원 데이터 (서버에서 자동 업데이트)" className="mb-4">
        <DataGrid
          rowData={realtimeData}
          columnDefs={columnDefs}
          height={300}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 메트릭 카드 */}
        <Card title="서버 메트릭 (실시간)">
          {metricList.length === 0 ? (
            <p className="text-gray-400">메트릭 대기 중...</p>
          ) : (
            <div className="space-y-4">
              {metricList.map((m) => (
                <div key={m.id} className="border-b pb-3 last:border-b-0">
                  <div className="font-semibold mb-1">{m.name}</div>
                  <div className="flex gap-4">
                    <Statistic
                      title="CPU"
                      value={m.metrics.cpu}
                      suffix="%"
                      valueStyle={{ fontSize: 14 }}
                    />
                    <Statistic
                      title="메모리"
                      value={m.metrics.memory}
                      suffix="MB"
                      valueStyle={{ fontSize: 14 }}
                    />
                    <Statistic
                      title="연결"
                      value={m.metrics.activeConnections}
                      valueStyle={{ fontSize: 14 }}
                    />
                  </div>
                  <Progress
                    percent={m.metrics.cpu}
                    size="small"
                    status={m.metrics.cpu > 80 ? 'exception' : 'active'}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 알림 목록 */}
        <Card
          title="알림"
          extra={
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={() => dispatch(clearNotifications())}
            >
              초기화
            </Button>
          }
        >
          <List
            size="small"
            dataSource={notifications}
            locale={{ emptyText: '알림 없음' }}
            style={{ maxHeight: 300, overflow: 'auto' }}
            renderItem={(item) => (
              <List.Item>
                <div className="w-full">
                  <Tag color={levelColorMap[item.level]}>{item.level}</Tag>
                  <span className="text-sm">{item.message}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* 이벤트 로그 */}
        <Card title="이벤트 로그">
          <List
            size="small"
            dataSource={eventLog.slice(0, 15)}
            locale={{ emptyText: '이벤트 없음' }}
            style={{ maxHeight: 300, overflow: 'auto' }}
            renderItem={(item) => (
              <List.Item>
                <div className="w-full">
                  <Tag>{item.type}</Tag>
                  <div className="text-xs text-gray-500 mt-1 font-mono break-all">
                    {JSON.stringify(item.payload).slice(0, 80)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 설명 */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800 font-semibold mb-2">
          Redux Saga + WebSocket eventChannel 동작 흐름
        </p>
        <ol className="text-sm text-green-700 list-decimal list-inside space-y-1">
          <li><code>connectWebSocket()</code> action 디스패치 → saga에서 WebSocket 연결</li>
          <li>saga의 <code>eventChannel</code>이 WebSocket 메시지를 Redux action으로 변환</li>
          <li>서버 이벤트 타입별로 적절한 reducer action 디스패치 (STATUS_CHANGED, DATA_UPDATED 등)</li>
          <li>Redux 상태 업데이트 → React 컴포넌트 자동 리렌더링</li>
          <li><code>disconnectWebSocket()</code> 시 saga task cancel → WebSocket 연결 해제</li>
        </ol>
      </div>
    </div>
  )
}

export default RealtimeDemoPage
