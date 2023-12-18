import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

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