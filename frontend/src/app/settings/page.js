import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import Properties from '@/components/Pages/Properties'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
    </main>
    </div>
    </>
  )
}