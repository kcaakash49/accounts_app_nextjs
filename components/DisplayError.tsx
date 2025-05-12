export default function DisplayError({error}: {error:string}){
    return <div className="text-red-500 flex items-center justify-center text-2xl">
        {error}
    </div>
}