import { useState, useMemo, useCallback, useRef } from 'react'
import { Button, Tag, Badge } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import MultiEditSlideOver from '../components/MultiEditSlideOver'

const departmentOptions = [
  { label: '개발', value: 'engineering' },
  { label: '디자인', value: 'design' },
  { label: '마케팅', value: 'marketing' },
  { label: '인사', value: 'hr' },
  { label: '영업', value: 'sales' },
]

const skillOptions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Spring', value: 'spring' },
  { label: 'Figma', value: 'figma' },
  { label: 'Photoshop', value: 'photoshop' },
  { label: 'SEO', value: 'seo' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'Recruitment', value: 'recruitment' },
]

const departmentColorMap = {
  engineering: 'blue',
  design: 'purple',
  marketing: 'orange',
  hr: 'green',
  sales: 'cyan',
}

const initialRowData = [
  { id: 1, name: '홍길동', email: 'hong@example.com', department: 'engineering', skills: ['react', 'typescript'], status: 'active', note: '시니어 개발자' },
  { id: 2, name: '김철수', email: 'kim@example.com', department: 'design', skills: ['figma', 'photoshop'], status: 'active', note: 'UI/UX 전문' },
  { id: 3, name: '이영희', email: 'lee@example.com', department: 'marketing', skills: ['seo', 'analytics'], status: 'inactive', note: '육아휴직 중' },
  { id: 4, name: '박민수', email: 'park@example.com', department: 'engineering', skills: ['java', 'spring', 'kubernetes'], status: 'active', note: '백엔드 리드' },
  { id: 5, name: '정수진', email: 'jung@example.com', department: 'hr', skills: ['recruitment'], status: 'active', note: '' },
  { id: 6, name: '최유리', email: 'choi@example.com', department: 'sales', skills: ['analytics'], status: 'active', note: '신규 입사' },
  { id: 7, name: '윤재원', email: 'yoon@example.com', department: 'engineering', skills: ['react', 'java'], status: 'inactive', note: '파견 중' },
  { id: 8, name: '서민지', email: 'seo@example.com', department: 'design', skills: ['figma'], status: 'active', note: '' },
  { id: 9, name: '조현우', email: 'jo@example.com', department: 'marketing', skills: ['seo'], status: 'active', note: '콘텐츠 담당' },
  { id: 10, name: '강태양', email: 'kang@example.com', department: 'engineering', skills: ['typescript', 'kubernetes'], status: 'active', note: '' },
  { id: 11, name: '임소연', email: 'lim@example.com', department: 'hr', skills: ['recruitment', 'analytics'], status: 'active', note: '인사팀 리드' },
  { id: 12, name: '노준혁', email: 'noh@example.com', department: 'sales', skills: ['analytics', 'seo'], status: 'inactive', note: '연수 중' },
  { id: 13, name: '문지아', email: 'moon@example.com', department: 'design', skills: ['figma', 'photoshop'], status: 'active', note: '' },
  { id: 14, name: '오태양', email: 'oh@example.com', department: 'engineering', skills: ['java', 'spring'], status: 'active', note: '인프라 담당' },
  { id: 15, name: '배수지', email: 'bae@example.com', department: 'marketing', skills: ['seo', 'analytics'], status: 'active', note: '브랜드 마케터' },
]

const PANEL_DEFAULT_WIDTH = 400
const PANEL_MIN_WIDTH = 280

const MultiEditDemoPage = () => {
  const gridRef = useRef(null)
  const containerRef = useRef(null)
  const panelWidthRef = useRef(PANEL_DEFAULT_WIDTH)
  const isDraggingRef = useRef(false)

  const [rowData, setRowData] = useState(initialRowData)
  const [selectedRows, setSelectedRows] = useState([])
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH)

  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        flex: 0,
        sortable: false,
        filter: false,
        resizable: false,
        pinned: 'left',
      },
      { field: 'id', headerName: 'ID', maxWidth: 70, flex: 0, editable: false },
      { field: 'name', headerName: '이름' },
      { field: 'email', headerName: '이메일', minWidth: 180 },
      {
        field: 'department',
        headerName: '부서',
        cellRenderer: (params) => {
          const opt = departmentOptions.find((o) => o.value === params.value)
          return (
            <Tag color={departmentColorMap[params.value] ?? 'default'}>
              {opt?.label ?? params.value}
            </Tag>
          )
        },
      },
      {
        field: 'skills',
        headerName: '스킬',
        minWidth: 180,
        valueFormatter: (params) => {
          if (!Array.isArray(params.value)) return ''
          return params.value
            .map((v) => skillOptions.find((o) => o.value === v)?.label ?? v)
            .join(', ')
        },
      },
      {
        field: 'status',
        headerName: '상태',
        maxWidth: 100,
        cellRenderer: (params) => {
          const isActive = params.value === 'active'
          return (
            <Badge
              status={isActive ? 'success' : 'default'}
              text={isActive ? '활성' : '비활성'}
            />
          )
        },
      },
      { field: 'note', headerName: '비고', minWidth: 140 },
    ],
    [],
  )

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: false,
      flex: 1,
      minWidth: 100,
    }),
    [],
  )

  const onSelectionChanged = useCallback(() => {
    if (!gridRef.current?.api) return
    setSelectedRows(gridRef.current.api.getSelectedRows())
  }, [])

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit()
  }, [])

  const handleEditClick = () => {
    setSlideOverOpen(true)
  }

  const handleSlideOverClose = () => {
    setSlideOverOpen(false)
  }

  const handleSave = useCallback(
    (changedValues) => {
      const selectedIds = new Set(selectedRows.map((r) => r.id))
      setRowData((prev) =>
        prev.map((row) => {
          if (!selectedIds.has(row.id)) return row
          return { ...row, ...changedValues }
        }),
      )
      gridRef.current?.api?.deselectAll()
      setSelectedRows([])
      setSlideOverOpen(false)
    },
    [selectedRows],
  )

  // 드래그 핸들 mousedown — 가로 리사이즈
  const handleResizerMouseDown = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = panelWidthRef.current
    isDraggingRef.current = true

    const onMove = (me) => {
      const containerW = containerRef.current?.offsetWidth ?? 900
      const delta = startX - me.clientX
      const next = Math.max(PANEL_MIN_WIDTH, Math.min(startWidth + delta, containerW - 400))
      setPanelWidth(next)
      panelWidthRef.current = next
    }

    const onUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  // panelWidth 변경 시 ref 동기화
  const syncedPanelWidth = panelWidth
  panelWidthRef.current = syncedPanelWidth

  return (
    // 헤더(64px) + Content 패딩(48px) = 112px 제외
    <div
      ref={containerRef}
      className='flex'
      style={{ height: 'calc(100vh - 112px)', overflow: 'hidden' }}
    >
      {/* 좌: 그리드 영역 */}
      <div className='flex flex-col' style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {/* 툴바 */}
        <div className='flex items-center justify-between mb-3 shrink-0'>
          <div>
            <h2 className='text-xl font-bold m-0'>멀티 선택 편집 데모</h2>
            <p className='text-gray-400 text-xs mt-0.5 m-0'>
              체크박스로 여러 항목을 선택 후 일괄 수정
            </p>
          </div>
          <Button
            type='primary'
            icon={<EditOutlined />}
            disabled={selectedRows.length === 0}
            onClick={handleEditClick}
          >
            수정{selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}
          </Button>
        </div>

        {/* 선택 상태 바 */}
        <div
          className='shrink-0 mb-2 px-3 py-1.5 rounded text-xs transition-all'
          style={{
            background: selectedRows.length > 0 ? '#eff6ff' : '#f9fafb',
            border: `1px solid ${selectedRows.length > 0 ? '#bfdbfe' : '#e5e7eb'}`,
            color: selectedRows.length > 0 ? '#1d4ed8' : '#9ca3af',
          }}
        >
          {selectedRows.length > 0
            ? `${selectedRows.length}개 항목 선택됨 — 우측 상단 수정 버튼을 눌러 일괄 편집`
            : '행 왼쪽 체크박스로 항목을 선택하세요'}
        </div>

        {/* AG Grid */}
        <div className='ag-theme-alpine' style={{ flex: 1, overflow: 'hidden' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection='multiple'
            suppressRowClickSelection
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[5, 10, 20]}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>

      {/* 드래그 핸들 + 우측 패널 */}
      {slideOverOpen && (
        <>
          {/* 드래그 핸들 */}
          <div
            className='shrink-0 flex items-center justify-center cursor-col-resize bg-gray-100 hover:bg-blue-300 active:bg-blue-400 transition-colors select-none'
            style={{ width: 5 }}
            onMouseDown={handleResizerMouseDown}
          >
            <div
              className='rounded-full bg-gray-400'
              style={{ width: 3, height: 32, pointerEvents: 'none' }}
            />
          </div>

          {/* 우: 편집 패널 */}
          <div
            className='shrink-0 border-l bg-white overflow-hidden'
            style={{ width: syncedPanelWidth }}
          >
            <MultiEditSlideOver
              open={slideOverOpen}
              selectedRows={selectedRows}
              onClose={handleSlideOverClose}
              onSave={handleSave}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MultiEditDemoPage
