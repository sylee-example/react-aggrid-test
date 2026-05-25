import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Select } from 'antd'

const CustomMultiSelectEditor = forwardRef(
  (props, ref) => {
    const { value: initialValue, options = [], placeholder = '선택하세요' } = props
    const [value, setValue] = useState(
      Array.isArray(initialValue) ? initialValue : [],
    )
    const containerRef = useRef(null)

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
      isPopup() {
        return true
      },
      getPopupPosition() {
        return 'under'
      },
    }))

    useEffect(() => {
      setTimeout(() => {
        containerRef.current?.querySelector('input')?.focus()
      }, 0)
    }, [])

    return (
      <div
        ref={containerRef}
        className="p-2 bg-white rounded shadow-lg"
        style={{ minWidth: 250, minHeight: 40 }}
      >
        <Select
          mode="multiple"
          value={value}
          onChange={(val) => setValue(val)}
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          placeholder={placeholder}
          className="w-full"
          autoFocus
          defaultOpen
          style={{ width: '100%' }}
        />
      </div>
    )
  },
)

CustomMultiSelectEditor.displayName = 'CustomMultiSelectEditor'

export default CustomMultiSelectEditor
