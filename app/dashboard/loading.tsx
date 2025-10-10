

// app/loading.tsx
export default function Loading() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {/* Spinning Loader */}
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full mx-auto mb-4"></div>
  
          {/* Loading Text */}
          <p className="text-xl text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  