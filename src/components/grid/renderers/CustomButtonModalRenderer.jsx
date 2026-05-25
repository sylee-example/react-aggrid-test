import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const CustomButtonModalRenderer = (props) => {
  const { value, buttonText = '편집', api, column, node } = props

  const handleClick = () => {
    if (column) {
      api.startEditingCell({
        rowIndex: node.rowIndex,
        colKey: column.getColId(),
      })
    }
  }

  return (
    <div className="flex items-center gap-2 h-full">
      <span className="truncate flex-1">{value ?? '-'}</span>
      <Button
        type="link"
        size="small"
        icon={<EditOutlined />}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default CustomButtonModalRenderer
