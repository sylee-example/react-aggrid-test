import { Button } from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">AG Grid Enterprise 데모</h1>
      <p className="text-lg text-gray-500 mb-8">
        커스텀 셀 에디터가 포함된 공통 그리드 컴포넌트
      </p>
      <Button
        type="primary"
        size="large"
        icon={<TableOutlined />}
        onClick={() => navigate('/grid-demo')}
      >
        그리드 데모 보기
      </Button>
    </div>
  )
}

export default HomePage
