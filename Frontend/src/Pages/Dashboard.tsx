import MainBody from "@/components/MainBody";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
    return (
        <>
            <div className="w-full">
                <Navbar />
            </div>
            <div className="w-full">
                <MainBody />
            </div>
        </>
    )
}