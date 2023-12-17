import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import PropertyDetails from '@/components/PropertyDetails';

export default function PropertyDetailPage() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          <PropertyDetails />
        </main>
      </div>
    </>
  );
}
