import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Modal, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const { TextArea } = Input

const CustomButtonModalEditor = forwardRef((props, ref) => {
  const { value: initialValue, modalTitle = '상세 편집' } = props
  const [value, setValue] = useState(initialValue ?? '')
  const [modalOpen, setModalOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    getValue() {
      return value
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      return false
    },
  }))

  const handleOk = () => {
    setModalOpen(false)
    // full row edit 모드: stopEditing 호출 없이 값만 저장
    // 행 편집 종료는 키보드 네비게이션(Up/Down)이 처리
  }

  const handleCancel = () => {
    setValue(initialValue ?? '')
    setModalOpen(false)
  }

  return (
    <div className="flex items-center gap-2 h-full px-1">
      <span className="truncate flex-1 text-sm">{value || '-'}</span>
      <Button
        type="link"
        size="small"
        icon={<EditOutlined />}
        onClick={() => setModalOpen(true)}
      >
        편집
      </Button>
      <Modal
        title={modalTitle}
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="확인"
        cancelText="취소"
        destroyOnHidden
        width={500}
      >
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder="내용을 입력하세요"
          className="mt-2"
        />
      </Modal>
    </div>
  )
})

CustomButtonModalEditor.displayName = "CustomButtonModalEditor";

export default CustomButtonModalEditor;
