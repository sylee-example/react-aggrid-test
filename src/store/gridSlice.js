import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  rowData: [],
  loading: false,
  editMode: false,
  error: null,
}

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    // 데이터 로드 요청
    fetchDataRequest(state) {
      state.loading = true
      state.error = null
    },
    // 데이터 로드 성공
    fetchDataSuccess(state, action) {
      state.rowData = action.payload
      state.loading = false
    },
    // 데이터 로드 실패
    fetchDataFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    // 행 데이터 업데이트
    updateRowData(state, action) {
      state.rowData = action.payload
    },
    // 편집 모드 토글
    toggleEditMode(state) {
      state.editMode = !state.editMode
    },
    // 편집 모드 설정
    setEditMode(state, action) {
      state.editMode = action.payload
    },
  },
})

export const {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
  updateRowData,
  toggleEditMode,
  setEditMode,
} = gridSlice.actions

export default gridSlice.reducer
