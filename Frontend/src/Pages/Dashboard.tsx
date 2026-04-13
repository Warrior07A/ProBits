import MainBody from "@/components/MainBody";
import Navbar from "@/components/Navbar";
import { ws } from "./Signin";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router";
import { Editor } from "@monaco-editor/react";
import XTerminal from "@/components/Terminal";


export default function Dashboard() {
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(14);

    let [roomid, setroom_id] = useState("");
    let [JoinRoomId, SetJoinRoomId] = useState("");
    let activeRoom = useRef("");
    const editorinput = useRef<string | null>(null);
    const editorRef = useRef<any>(null);
    const isRemoteUpdate = useRef(false);
    const [CommonValue, SetCommonValue] = useState("");
    const [TOutput, setTOutput] = useState("");
    let location = useLocation();

    useEffect(() => {
        ws.onmessage = (event) => {
            console.log(event);
            let data = JSON.parse(event.data);
            console.log(data);
            if (data.type == "CODE_UPDATE") {
                SetCommonValue(data.payload.changes);
                if (editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (currentCode !== data.payload.changes) {
                        isRemoteUpdate.current = true;
                        editorRef.current.setValue(data.payload.changes);
                        isRemoteUpdate.current = false;
                    }
                }
            }
            else if (data.type == "TERMINAL_CODE_UPDATE") {
                setTOutput(data.payload.code);
            }
            else {
                
            }
        }
    }, [])

    useEffect(()=>{
        // console.log(location);
        let param_roomid = location.pathname.split("/").pop();
        if (param_roomid){
            activeRoom.current = param_roomid;
            // console.log("roomid", activeRoom);
        }
    },[location])



    async function compileCode() {
        let Compilereq = await axios.post("https://judge0.nagmaniupadhyay.com.np/submissions?wait=true", {
            "language_id": 63,
            "source_code": editorinput.current || ""
        })
        let FinalCodeOutput = "";
        if (Compilereq.data.status.id == 3) {
           
            FinalCodeOutput = Compilereq.data.stdout;
        }
        else {
            FinalCodeOutput = Compilereq.data.status.description;
        }

        setTOutput(FinalCodeOutput);
        ws.send(JSON.stringify({
            type: "TERMINAL_CODE",
            payload: {
                code: FinalCodeOutput,
                room_id: activeRoom.current
            }
        }))

        console.log(CommonValue);
    }

    const EditorDidMount = (editor: any) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            if (isRemoteUpdate.current) return;
            const code = editor.getValue();
            editorinput.current = code;
            // console.log("ws", activeRoom.current, editorinput.current);
            ws.send(JSON.stringify({
                type: "CODE_SEND",
                payload: {
                    room_id: activeRoom.current,
                    changes: editorinput.current
                }
            }))
        })
    }




    return (
        <>
        <div>
            <div className="w-full">
                <div className="h-16 flex items-center justify-between px-8 
                        bg-[#0f172a] text-white shadow-md border-b border-[#1f2937]">


            <div className="text-2xl font-bold tracking-wide text-blue-400">
                CodeBridge
            </div>

            <div className="flex items-center gap-6">

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="javascript">Javascript</option>
                </select>

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="vs-dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="hc-black">HC Black</option>
                </select>

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                >
                    {[12,14,16,18,20].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>

            </div>
        </div> 
            </div>
            <div className="w-full">
               <div className="flex h-screen bg-[#0b1220] text-white">

        {/* LEFT SIDE */}
        <div className="w-3/4 flex flex-col p-4 gap-4">

            {/* Editor Card */}
            <div className="bg-[#0f172a] rounded-xl shadow-lg border border-[#1f2937] overflow-hidden">

                <Editor
                    onMount={EditorDidMount}
                    defaultLanguage="javascript"
                    defaultValue="// You can code here in JavaScript"
                    value={CommonValue}
                    height="55vh"
                    theme={theme}
                    language={language}
                    options = {{
                        fontSize : fontSize
                    }}
                />

                {/* Run Button */}
                <div className="flex justify-end p-3 bg-[#020617] border-t border-[#1f2937]">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md font-medium shadow-md"
                        onClick={compileCode}
                    >
                        ▶ Run Code
                    </button>
                </div>
            </div>

            {/* Terminal */}
            <div className="bg-black rounded-xl border border-[#1f2937] shadow-md p-3">
                <XTerminal OutputCode={TOutput} />
            </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/4 bg-[#020617] border-l border-[#1f2937] flex flex-col">

            <div className="p-4 border-b border-[#1f2937]">
                <h2 className="text-xl font-semibold text-blue-400">
                    Participants
                </h2>
            </div>

            <div className="flex-1 p-4 text-gray-400">
                {/* future participants list */}
               
            </div>

        </div>
    </div>
            </div>
        </div>               
        </>
    )
}
