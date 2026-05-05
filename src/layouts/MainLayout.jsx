import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div id="app-container" className="bg-latar min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 flex flex-col">
          <Header />
          <div className="p-4 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
