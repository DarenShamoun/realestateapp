export default function Home() {
  return (
    <main className="flex-grow p-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Tiles will now adjust based on screen size */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="min-w-[250px] flex flex-col justify-between rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:from-gray-700 dark:to-gray-800"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Placeholder Title {i + 1}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
            </div>
            <button className="mt-4 rounded bg-blue-500 py-2 px-4 text-white shadow transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
