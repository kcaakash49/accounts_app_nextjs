import { fetchAdminInfo } from "@/action/fetchAdminInfo";

export default async function AdminInfo() {
  try {
    const res = await fetchAdminInfo();

    if (res?.error) {
      return (
        <div className="text-2xl text-red-500 text-center mt-10">
          {res.error}
        </div>
      );
    }

    const initial = res.username?.charAt(0).toUpperCase() ?? "?";

    return (
      <div className="flex items-center gap-x-3 sm:gap-x-4">
        {/* Responsive Circle */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold">
          {initial}
        </div>

        {/* Username (hidden on small screens) */}
        <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 hidden lg:block">
          {res.username}
        </div>
      </div>
    );
  } catch (e) {
    return (
      <div className="text-2xl text-red-500 text-center mt-10">
        Internal Server Error
      </div>
    );
  }
}
