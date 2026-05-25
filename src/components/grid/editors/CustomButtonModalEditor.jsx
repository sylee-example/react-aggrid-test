import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Input } from "antd";

const { TextArea } = Input;

const CustomButtonModalEditor = forwardRef((props, ref) => {
  const { value: initialValue, modalTitle = "상세 편집", stopEditing } = props;
  const [value, setValue] = useState(initialValue ?? "");
  const [modalOpen, setModalOpen] = useState(true);

  useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
    isCancelBeforeStart() {
      return false;
    },
    isCancelAfterEnd() {
      return !modalOpen;
    },
    isPopup() {
      return true;
    },
  }));

  const handleOk = () => {
    setModalOpen(false);
    // 약간의 지연 후 편집 종료 (모달 애니메이션 완료 후)
    setTimeout(() => {
      stopEditing();
    }, 100);
  };

  const handleCancel = () => {
    setValue(initialValue ?? "");
    setModalOpen(false);
    setTimeout(() => {
      stopEditing(true);
    }, 100);
  };

  return (
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
  );
});

CustomButtonModalEditor.displayName = "CustomButtonModalEditor";

export default CustomButtonModalEditor;
