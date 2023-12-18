import Sidebar from '@/components/Navigation/Sidebar'
import Navbar from '@/components/Navigation/Navbar'
import PropertiesManagement from '@/components/Management/PropertiesManagement'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
          <PropertiesManagement />
    </main>
    </div>
    </>
  )
}