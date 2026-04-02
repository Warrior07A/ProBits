import CodeEditor from "./Editor";
import Sidebar from "./Sidebar";
import Videostream from "./Videostream";

export default function MainBody() {
    return (
        <>
            <div className="flex gap-10 ">
                <div className="h-screen w-3/4 flex ">

                <div className="h-screen bg-red-700 w-2/5 "> 
                    <Sidebar/>
                </div>
                <div className="h-screen grow-4 w-10 ">
                    <CodeEditor />
                </div>

                </div>
                <div className="h-screen w-1/4 bg-orange-300">
                    <Videostream />
                </div>

            </div>
        </>
    )
}