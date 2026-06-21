import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div id="app-container" className="flex min-h-screen bg-latar">
      <div className="print:hidden"><Sidebar /></div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden"><Header /></div>
        <main className="flex-1 p-6 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
