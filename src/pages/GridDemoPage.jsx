import { useEffect, useMemo } from "react";
import { Button, Switch, Spin, Alert } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { DataGrid } from "../components/grid";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchDataRequest,
  updateRowData,
  toggleEditMode,
} from "../store/gridSlice";

// 부서 옵션
const departmentOptions = [
  { label: "개발", value: "engineering" },
  { label: "디자인", value: "design" },
  { label: "마케팅", value: "marketing" },
  { label: "인사", value: "hr" },
  { label: "영업", value: "sales" },
];

// 스킬 옵션
const skillOptions = [
  { label: "React", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "Spring", value: "spring" },
  { label: "Figma", value: "figma" },
  { label: "Photoshop", value: "photoshop" },
  { label: "SEO", value: "seo" },
  { label: "Analytics", value: "analytics" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "Recruitment", value: "recruitment" },
];

// 상태 옵션
const statusOptions = [
  { label: "활성", value: "active" },
  { label: "비활성", value: "inactive" },
];

const GridDemoPage = () => {
  const dispatch = useAppDispatch();
  const { rowData, loading, editMode, error } = useAppSelector(
    (state) => state.grid
  );

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  // 편집 모드에 따른 컬럼 정의
  const columnDefs = useMemo(() => {
    const baseDefs = [
      {
        field: "id",
        headerName: "ID",
        editable: false,
        maxWidth: 80,
        flex: 0,
      },
      {
        field: "name",
        headerName: "이름",
        // edit mode: CustomInput
        ...(editMode && {
          cellEditor: "customInputEditor",
          cellEditorParams: {
            placeholder: "이름을 입력하세요",
            type: "text",
            maxLength: 20,
          },
        }),
      },
      {
        field: "email",
        headerName: "이메일",
        minWidth: 200,
        ...(editMode && {
          cellEditor: "customInputEditor",
          cellEditorParams: {
            placeholder: "이메일을 입력하세요",
            type: "email",
          },
        }),
      },
      {
        field: "department",
        headerName: "부서",
        // edit mode: CustomSingleSelect
        valueFormatter: (params) => {
          const found = departmentOptions.find(
            (opt) => opt.value === params.value
          );
          return found ? found.label : params.value;
        },
        ...(editMode && {
          cellEditor: "customSingleSelectEditor",
          cellEditorParams: {
            options: departmentOptions,
            placeholder: "부서를 선택하세요",
          },
        }),
      },
      {
        field: "skills",
        headerName: "스킬",
        minWidth: 200,
        // edit mode: CustomMultiSelect
        valueFormatter: (params) => {
          if (!Array.isArray(params.value)) return "";
          return params.value
            .map((v) => {
              const found = skillOptions.find((opt) => opt.value === v);
              return found ? found.label : v;
            })
            .join(", ");
        },
        ...(editMode && {
          cellEditor: "customMultiSelectEditor",
          cellEditorParams: {
            options: skillOptions,
            placeholder: "스킬을 선택하세요",
          },
        }),
      },
      {
        field: "status",
        headerName: "상태",
        maxWidth: 120,
        valueFormatter: (params) => {
          const found = statusOptions.find((opt) => opt.value === params.value);
          return found ? found.label : params.value;
        },
        ...(editMode && {
          cellEditor: "customSingleSelectEditor",
          cellEditorParams: {
            options: statusOptions,
            placeholder: "상태를 선택하세요",
          },
        }),
      },
      {
        field: "note",
        headerName: "비고",
        minWidth: 200,
        // edit mode: CustomButtonModal (버튼 클릭 -> 모달 편집)
        ...(editMode && {
          cellRenderer: "customButtonModalRenderer",
          cellRendererParams: {
            buttonText: "편집",
          },
          cellEditor: "customButtonModalEditor",
          cellEditorParams: {
            modalTitle: "비고 편집",
          },
        }),
      },
    ];
    return baseDefs;
  }, [editMode]);

  const handleRowDataChanged = (data) => {
    dispatch(updateRowData(data));
  };

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold m-0">그리드 데모</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>편집 모드</span>
            <Switch
              checked={editMode}
              onChange={() => dispatch(toggleEditMode())}
            />
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => dispatch(fetchDataRequest())}
            loading={loading}
          >
            새로고침
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <DataGrid
          rowData={rowData}
          columnDefs={columnDefs}
          editable={editMode}
          onRowDataChanged={handleRowDataChanged}
          height={600}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      )}

      {editMode && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            편집 모드가 활성화되었습니다. 셀을 클릭하여 편집할 수 있습니다.
          </p>
          <ul className="text-sm text-blue-600 mt-2 list-disc list-inside">
            <li>
              <strong>이름/이메일</strong>: 커스텀 Input 에디터
            </li>
            <li>
              <strong>부서/상태</strong>: 커스텀 Single Select 에디터
            </li>
            <li>
              <strong>스킬</strong>: 커스텀 Multi Select 에디터
            </li>
            <li>
              <strong>비고</strong>: 버튼 클릭 → 모달 에디터
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GridDemoPage;
