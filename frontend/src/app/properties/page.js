import Sidebar from '@/components/Navigation/Sidebar'
import Navbar from '@/components/Navigation/Navbar'
import Properties from '@/components/Pages/Properties'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
          <Properties/>
    </main>
    </div>
    </>
  )
}