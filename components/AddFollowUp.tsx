import { addFollowupDate } from "@/action/addFollowupDate";
import { useState } from "react"
import Loading from "./Loading";


export default function({userId, setRefreshKey}: {userId: number, setRefreshKey: () => void}){
    const [date, setDate] = useState("");
    const [message,setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading,setLoading] = useState(false);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const followUpDate = date ? new Date(date) : null;
            if(!followUpDate) return;

            const res = await addFollowupDate(followUpDate, userId);
            if(res.success && res.message){
                setMessage(res.message)
                setError(null);
                setRefreshKey();
                // setRefreshKey();
            }if(res.error){
                setError(res.error);
                setMessage(null);
            }

        }catch(e){
            setError("Internal server error");
        }finally{
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
        <div>
          <label className="block">FollowUp</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded" disabled = {loading}>
        {
          loading ? <Loading/> : "Add follow"
        }
      </button>
  
        
        {message && <div className="p-4 text-center bg-green-600 text-white">{message}</div>}
        {error && <div className="p-4 text-center bg-red-600 text-white">{error}</div>}
      </form>
    )
}