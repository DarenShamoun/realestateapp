import Sidebar from '@/components/Navigation/Sidebar'
import Navbar from '@/components/Navigation/Navbar'
import Utilities from '@/components/Pages/Utilities'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
          <Utilities />
    </main>
    </div>
    </>
  )
}