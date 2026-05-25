import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Select } from 'antd'

const CustomSingleSelectEditor = forwardRef(
  (props, ref) => {
    const { value: initialValue, options = [], placeholder = '선택하세요' } = props
    const [value, setValue] = useState(initialValue)
    const selectRef = useRef(null)

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

    useEffect(() => {
      // 에디터가 열리면 자동 포커스
      setTimeout(() => {
        selectRef.current?.querySelector('input')?.focus()
      }, 0)
    }, [])

    return (
      <div ref={selectRef} className="w-full h-full">
        <Select
          value={value}
          onChange={(val) => setValue(val)}
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          placeholder={placeholder}
          className="w-full"
          popupMatchSelectWidth={false}
          autoFocus
          defaultOpen
          size="small"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  },
)

CustomSingleSelectEditor.displayName = 'CustomSingleSelectEditor'

export default CustomSingleSelectEditor
