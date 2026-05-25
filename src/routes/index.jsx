import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import GridDemoPage from '../pages/GridDemoPage'
import RealtimeDemoPage from '../pages/RealtimeDemoPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'grid-demo', element: <GridDemoPage /> },
      { path: 'realtime-demo', element: <RealtimeDemoPage /> },
    ],
  },
])

export default router
