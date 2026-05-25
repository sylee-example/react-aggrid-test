import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import CustomSingleSelectEditor from './editors/CustomSingleSelectEditor'
import CustomMultiSelectEditor from './editors/CustomMultiSelectEditor'
import CustomInputEditor from './editors/CustomInputEditor'
import CustomButtonModalEditor from './editors/CustomButtonModalEditor'
import CustomButtonModalRenderer from './renderers/CustomButtonModalRenderer'

// Ant Design Select 드롭다운이 현재 열려있는지 DOM으로 확인
const isAntSelectDropdownOpen = () =>
  Array.from(document.querySelectorAll('.ant-select-dropdown')).some(
    (el) =>
      !el.classList.contains('ant-select-dropdown-hidden') &&
      el.offsetParent !== null,
  )

// 이벤트 타겟이 select 에디터 내부인지 확인
const isInsideSelectEditor = (target) =>
  !!(target?.closest?.('.ant-select'))

// 공통 AG Grid 컴포넌트
const DataGrid = ({
  rowData,
  columnDefs,
  editable = false,
  gridOptions,
  onRowDataChanged,
  height = 500,
  className = '',
  pagination = false,
  paginationPageSize = 10,
  paginationPageSizeSelector = [5, 10, 20, 50],
}) => {
  const gridRef = useRef(null)
  const wrapperRef = useRef(null)
  // onGridReady 이후 DOM 이벤트 리스너 정리용
  const keyListenerRef = useRef(null)

  // 공통 기본 컬럼 설정
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable,
      flex: 1,
      minWidth: 120,
    }),
    [editable],
  )

  // 커스텀 에디터 컴포넌트 등록
  const components = useMemo(
    () => ({
      customSingleSelectEditor: CustomSingleSelectEditor,
      customMultiSelectEditor: CustomMultiSelectEditor,
      customInputEditor: CustomInputEditor,
      customButtonModalEditor: CustomButtonModalEditor,
      customButtonModalRenderer: CustomButtonModalRenderer,
    }),
    [],
  )

  const onCellValueChanged = useCallback(
    (_event) => {
      if (onRowDataChanged && gridRef.current?.api) {
        const allData = []
        gridRef.current.api.forEachNode((node) => {
          if (node.data) {
            allData.push(node.data)
          }
        })
        onRowDataChanged(allData)
      }
    },
    [onRowDataChanged],
  )

  // Left/Right 셀 네비게이션 처리
  const navigateHorizontal = useCallback((api, event, direction) => {
    const editingCells = api.getEditingCells()
    if (!editingCells.length) return

    // full row edit에서 실제 포커스된 셀을 getFocusedCell()로 가져옴
    const focusedCell = api.getFocusedCell()
    const rowIndex = focusedCell?.rowIndex ?? editingCells[0].rowIndex
    const currentColId =
      focusedCell?.column?.getColId() ?? editingCells[0].column.getColId()

    const allColumns = api.getAllDisplayedColumns()
    const currentIdx = allColumns.findIndex(
      (col) => col.getColId() === currentColId,
    )

    const targetIdx = direction === 'left' ? currentIdx - 1 : currentIdx + 1
    if (targetIdx < 0 || targetIdx >= allColumns.length) return // 경계에서 중지

    event.preventDefault()
    event.stopPropagation()

    const targetCol = allColumns[targetIdx]
    const rowNode = api.getDisplayedRowAtIndex(rowIndex)
    const targetColId = targetCol.getColId()
    const { editable: colEditable, cellEditor } = targetCol.getColDef()

    // AG Grid 포커스 위치 업데이트
    api.setFocusedCell(rowIndex, targetColId)

    if (colEditable !== false && cellEditor) {
      setTimeout(() => {
        const instances = api.getCellEditorInstances({
          rowNodes: rowNode ? [rowNode] : [],
          columns: [targetCol],
        })

        if (instances.length) {
          const editor = instances[0]
          if (cellEditor === 'customInputEditor') {
            direction === 'left' ? editor.focusAtEnd?.() : editor.focusAtStart?.()
          } else {
            editor.focusIn?.()
          }
        } else {
          // getCellEditorInstances가 빈 배열일 때 DOM으로 직접 접근
          const cellEl = wrapperRef.current?.querySelector(
            `[col-id="${targetColId}"]`,
          )
          if (cellEditor === 'customInputEditor') {
            const inputEl = cellEl?.querySelector('input')
            if (inputEl) {
              inputEl.focus()
              try {
                if (direction === 'left') {
                  const len = inputEl.value.length
                  inputEl.setSelectionRange(len, len)
                } else {
                  inputEl.setSelectionRange(0, 0)
                }
              } catch {}
            }
          } else {
            // Ant Design Select는 mousedown으로 드롭다운 열기를 감지
            const selectorEl = cellEl?.querySelector('.ant-select-selector')
            selectorEl?.dispatchEvent(
              new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
            )
          }
        }
      }, 0)
    }
  }, [])

  // 방향키 네비게이션을 위한 캡처 단계 DOM 이벤트 핸들러
  // onCellKeyDown은 편집 중에 발화되지 않으므로 캡처 단계 리스너 사용
  const onGridReady = useCallback(
    (params) => {
      params.api.sizeColumnsToFit()

      // wrapper div를 rootEl로 사용 (가장 안정적인 방법)
      const rootEl = wrapperRef.current
      if (!rootEl) return

      const handleKeyDown = (event) => {
        const api = gridRef.current?.api
        if (!api) return

        const editingCells = api.getEditingCells()
        if (!editingCells.length) return

        const key = event.key
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key))
          return

        // full row edit에서 getEditingCells()는 행의 모든 편집 셀을 반환하므로
        // 실제 포커스된 셀을 getFocusedCell()로 가져옴
        const focusedCell = api.getFocusedCell()
        const rowIndex = focusedCell?.rowIndex ?? editingCells[0].rowIndex
        const focusedColId =
          focusedCell?.column?.getColId() ??
          editingCells[0].column.getColId()
        const totalRows = api.getDisplayedRowCount()

        if (key === 'ArrowDown') {
          if (isAntSelectDropdownOpen()) return
          event.preventDefault()
          event.stopPropagation()
          if (rowIndex < totalRows - 1) {
            const nextRow = rowIndex + 1
            api.stopEditing(false)
            // setFocusedCell로 그리드 포커스 복원 후 편집 시작
            api.setFocusedCell(nextRow, focusedColId)
            api.startEditingCell({ rowIndex: nextRow, colKey: focusedColId })
          }
        } else if (key === 'ArrowUp') {
          if (isAntSelectDropdownOpen()) return
          event.preventDefault()
          event.stopPropagation()
          if (rowIndex > 0) {
            const prevRow = rowIndex - 1
            api.stopEditing(false)
            api.setFocusedCell(prevRow, focusedColId)
            api.startEditingCell({ rowIndex: prevRow, colKey: focusedColId })
          }
        } else if (key === 'ArrowLeft') {
          // select 내부: 항상 셀 이동
          if (isInsideSelectEditor(event.target)) {
            navigateHorizontal(api, event, 'left')
            return
          }
          if (event.target?.tagName === 'INPUT') {
            // selectionStart === null: email/number 등 selection 미지원 타입 → 항상 셀 이동
            if (event.target.selectionStart === null) {
              navigateHorizontal(api, event, 'left')
              return
            }
            // text input: 커서가 맨 앞일 때만 셀 이동
            if (event.target.selectionStart === 0) {
              navigateHorizontal(api, event, 'left')
            }
            return
          }
          navigateHorizontal(api, event, 'left')
        } else if (key === 'ArrowRight') {
          // select 내부: 항상 셀 이동
          if (isInsideSelectEditor(event.target)) {
            navigateHorizontal(api, event, 'right')
            return
          }
          if (event.target?.tagName === 'INPUT') {
            // selectionEnd === null: email/number 등 selection 미지원 타입 → 항상 셀 이동
            if (event.target.selectionEnd === null) {
              navigateHorizontal(api, event, 'right')
              return
            }
            // text input: 커서가 맨 끝일 때만 셀 이동
            if (event.target.selectionEnd === event.target.value.length) {
              navigateHorizontal(api, event, 'right')
            }
            return
          }
          navigateHorizontal(api, event, 'right')
        }
      }

      rootEl.addEventListener('keydown', handleKeyDown, true)
      keyListenerRef.current = { el: rootEl, fn: handleKeyDown }
    },
    [navigateHorizontal],
  )

  // 언마운트 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      const { el, fn } = keyListenerRef.current ?? {}
      if (el && fn) el.removeEventListener('keydown', fn, true)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`ag-theme-alpine ${className}`}
      style={{ height, width: '100%' }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        components={components}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        editType="fullRow"
        stopEditingWhenCellsLoseFocus
        singleClickEdit={editable}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        {...gridOptions}
      />
    </div>
  )
}

export default DataGrid
