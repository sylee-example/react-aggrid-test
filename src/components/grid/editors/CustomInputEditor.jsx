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
  } = props
  const [value, setValue] = useState(initialValue ?? '')
  const inputRef = useRef(null)

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
  }))

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
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
