import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Input } from 'antd'

const CustomInputEditor = forwardRef((props, ref) => {
  const {
    value: initialValue,
    placeholder = '입력하세요',
    type = 'text',
    maxLength,
    cellStartedEdit,
  } = props
  const [value, setValue] = useState(initialValue ?? '')
  const inputRef = useRef(null)

  const getNativeInput = () =>
    inputRef.current?.nativeElement ||
    inputRef.current?.input ||
    inputRef.current

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
    focusIn() {
      inputRef.current?.focus()
    },
    focusAtStart() {
      inputRef.current?.focus()
      setTimeout(() => {
        try {
          getNativeInput()?.setSelectionRange(0, 0)
        } catch {
          // email 등 selection 미지원 타입은 무시
        }
      }, 0)
    },
    focusAtEnd() {
      inputRef.current?.focus()
      setTimeout(() => {
        try {
          const el = getNativeInput()
          const len = el?.value?.length || 0
          el?.setSelectionRange(len, len)
        } catch {
          // email 등 selection 미지원 타입은 무시
        }
      }, 0)
    },
  }))

  // 이 셀이 편집을 시작한 셀인 경우에만 자동 포커스
  useEffect(() => {
    if (cellStartedEdit) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      props.stopEditing()
    }
    if (e.key === 'Escape') {
      props.stopEditing(true)
    }
  }

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      size="small"
      style={{ width: '100%', height: '100%' }}
    />
  )
})

CustomInputEditor.displayName = 'CustomInputEditor'

export default CustomInputEditor
