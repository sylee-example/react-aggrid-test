import { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import CustomSingleSelectEditor from './editors/CustomSingleSelectEditor'
import CustomMultiSelectEditor from './editors/CustomMultiSelectEditor'
import CustomInputEditor from './editors/CustomInputEditor'
import CustomButtonModalEditor from './editors/CustomButtonModalEditor'
import CustomButtonModalRenderer from './renderers/CustomButtonModalRenderer'

// 공통 AG Grid 컴포넌트
const DataGrid = ({
  rowData,
  columnDefs,
  editable = false,
  gridOptions,
  onRowDataChanged,
  height = 500,
  className = '',
}) => {
  const gridRef = useRef(null)

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

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit()
  }, [])

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

  return (
    <div
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
        stopEditingWhenCellsLoseFocus
        singleClickEdit={editable}
        {...gridOptions}
      />
    </div>
  )
}

export default DataGrid
