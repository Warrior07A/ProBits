import MainBody from "@/components/MainBody";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
    return (
        <>
            <div className="w-1000 h-10">
                <Navbar />
            </div>
            <div>
                <MainBody />
            </div>
        </>
    )
}