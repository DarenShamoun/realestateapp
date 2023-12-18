import Sidebar from '@/components/Navigation/Sidebar'
import Navbar from '@/components/Navigation/Navbar'
import UnitsManagement from '@/components/Management/UnitsManagement'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
          <UnitsManagement />
    </main>
    </div>
    </>
  )
}