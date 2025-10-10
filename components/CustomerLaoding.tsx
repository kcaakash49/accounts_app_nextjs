export default function CustomerLoading(){
    return (
        <section className="w-full bg-white rounded-xl shadow-md p-6 md:p-10">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Info grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
    )
}