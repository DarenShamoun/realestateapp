import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import Landing from '@/components/Pages/Home'

export default function Home() {
  return (
    <>
    <div className="flex">
    <Sidebar/>
    <main className="flex-grow ml-64 relative">
          <Navbar />
          <Landing/>
    </main>
    </div>
    </>
  )
}