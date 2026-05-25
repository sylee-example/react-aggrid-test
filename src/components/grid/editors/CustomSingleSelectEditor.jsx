import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Select } from 'antd'

const CustomSingleSelectEditor = forwardRef(
  (props, ref) => {
    const { value: initialValue, options = [], placeholder = '선택하세요', cellStartedEdit } = props
    const [value, setValue] = useState(initialValue)
    const containerRef = useRef(null)
    // 이 셀이 편집을 시작한 셀인 경우에만 드롭다운 자동 열기
    const [dropdownOpen, setDropdownOpen] = useState(!!cellStartedEdit)
    // focusIn() 직후 onOpenChange(false) 경쟁 상태 방지
    const suppressCloseRef = useRef(false)

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
        suppressCloseRef.current = true
        setDropdownOpen(true)
        setTimeout(() => {
          suppressCloseRef.current = false
        }, 200)
      },
    }))

    return (
      <div ref={containerRef} className="w-full h-full">
        <Select
          value={value}
          onChange={(val) => setValue(val)}
          open={dropdownOpen}
          onOpenChange={(open) => {
            if (!open && suppressCloseRef.current) return
            setDropdownOpen(open)
          }}
          options={options.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          placeholder={placeholder}
          className="w-full"
          popupMatchSelectWidth={false}
          size="small"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  },
)

CustomSingleSelectEditor.displayName = 'CustomSingleSelectEditor'

export default CustomSingleSelectEditor
