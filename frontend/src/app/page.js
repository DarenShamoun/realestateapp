import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder tiles */}
        <div className="bg-white rounded-lg shadow p-5">Tile 1</div>
        <div className="bg-white rounded-lg shadow p-5">Tile 2</div>
        <div className="bg-white rounded-lg shadow p-5">Tile 3</div>
        {/* More tiles can be added here */}
      </div>
    </main>
  );
}
