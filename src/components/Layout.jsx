import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu } from 'antd'
import { TableOutlined, HomeOutlined, ThunderboltOutlined } from '@ant-design/icons'

const { Header, Content } = AntLayout

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">홈</Link>,
  },
  {
    key: '/grid-demo',
    icon: <TableOutlined />,
    label: <Link to="/grid-demo">그리드 데모</Link>,
  },
  {
    key: '/realtime-demo',
    icon: <ThunderboltOutlined />,
    label: <Link to="/realtime-demo">실시간 데몬 연동</Link>,
  },
]

const Layout = () => {
  const location = useLocation()

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center">
        <div className="text-white text-lg font-bold mr-8">AG Grid App</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="flex-1"
        />
      </Header>
      <Content className="p-6">
        <Outlet />
      </Content>
    </AntLayout>
  )
}

export default Layout
