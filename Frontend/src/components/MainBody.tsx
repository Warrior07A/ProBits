import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Videostream from "./Videostream";
import axios from "axios";
import { Editor } from "@monaco-editor/react";
import XTerminal from "./Terminal";
import { toast } from "react-toastify";
import { BE, PORT } from "@/Pages/Signin";

const ws = new WebSocket("wss://" + PORT);

export default function MainBody() {
    const [trigger, settrigger] = useState(false);
    let [roomid, setroom_id] = useState("");
    let [JoinRoomId, SetJoinRoomId] = useState("");
    let activeRoom = useRef("");
    const editorinput = useRef<string | null>(null);
    const [CommonValue, SetCommonValue] = useState("");
    const [TOutput, setTOutput] = useState("");


    useEffect(() => {
        activeRoom.current = roomid
    }, [roomid])
    useEffect(() => {
        activeRoom.current = JoinRoomId
    }, [JoinRoomId])


    async function compileCode() {
        console.log(editorinput.current);
        console.log(CommonValue);
        let Compilereq = await axios.post("https://judge0.nagmaniupadhyay.com.np/submissions?wait=true", {
            "language_id": 63,
            "source_code": editorinput.current || ""
        })
        let FinalCodeOutput = "";
        if (Compilereq.data.status.id == 3) {
            console.log(Compilereq.data.stdout);
            FinalCodeOutput = Compilereq.data.stdout;
        }
        else {
            FinalCodeOutput = Compilereq.data.status.description;
        }

        setTOutput(FinalCodeOutput);
        console.log(Compilereq);

        ws.send(JSON.stringify({
            type: "TERMINAL_CODE",
            payload: {
                code: FinalCodeOutput,
                room_id: activeRoom.current
            }
        }))

        console.log("ran here");
    }

    const EditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editor.onDidChangeModelContent((event) => {
            const code = editor.getValue();
            editorinput.current = code;
            const actroom = activeRoom.current
            ws.send(JSON.stringify({
                type: "CODE_SEND",
                payload: {
                    room_id: actroom,
                    changes: editorinput.current
                }
            }))
        })
    }

    async function JoinRoom() {
        if (JoinRoomId == "") {
            return toast.error("Enter a valid room id");
        }
        const res = await axios.put("https://" + BE + "/user/join?roomId=" + JoinRoomId, {}, {
            headers: {
                Authorization: localStorage.getItem("Authorization")
            }
        });
        console.log(res);
        if (res.status == 201) {
            toast.success("You have joined the Room")
            ws.send(JSON.stringify({
                type: "JOIN_ROOM",
                student_id: res.data.student_id,
                room_id: JoinRoomId,
            }))
        }
        else if (res.status == 200) {
            console.log(JoinRoomId);
            console.log(roomid);
            toast.success("Welcome Back")
        }

    }
    //useEffect for attaching ws listener for all users irrespective of their way of entering in a room.
    useEffect(() => {
        ws.onmessage = (event) => {
            // console.log(event);
            
            let data = JSON.parse(event.data);
            // console.log(data);
            if (data.type == "ROOM_CREATED") {
                toast.success("Room Created");
                settrigger(trigger => false);
                return;
            }
            else if (data.type == "CODE_UPDATE") {
                SetCommonValue(data.payload.changes);
                console.log(editorinput);
            }
            else if (data.type == "TERMINAL_CODE_UPDATE") {
                setTOutput(data.payload.code);
            }
            else {
                console.log("erro while recieving data from ws in FE");
            }

        }
    }, [])

    useEffect(() => {
        async function dbcall() {
            try {
                const CreateRoom = await axios.post("https://" + BE + "/teacher/createroom", {}, {
                    headers: {
                        Authorization: localStorage.getItem("Authorization")
                    }
                })
                if (CreateRoom.status == 201) {
                    let teacher_id = CreateRoom.data.teacher_id;
                    let room_id = CreateRoom.data.roomid;
                    ws.send(JSON.stringify({
                        type: "CREATE_ROOM",
                        teacher_id: teacher_id,
                        room_id: room_id
                    }))
                    setroom_id(room_id);
                }
            } catch (e) {
                // if (e.response.status == 401) {
                return toast.error("Access Denied");
                // }
            }
        }
        if (trigger) {
            dbcall();
        }
    }, [trigger])

    return (
        <>
            <div className="flex gap-10 ">
                <div className="h-screen w-3/4 flex ">
                    <div className="h-screen grow-4 w-10 flex-col ">
                        <Editor
                            onMount={EditorDidMount}
                            defaultLanguage="javascript" defaultValue=" // You can code here in JavaScript"
                            value={CommonValue}
                            height="70vh"
                            theme='vs-dark'
                        />
                        <div className="flex justify-end h-10">
                            <button className="bg-[#4079da] mr-10 rounded p-2"
                                onClick={() => { compileCode() }}
                            ><label className="text-white"> Run Code </label></button>
                        </div>
                        <div>
                            <XTerminal OutputCode={TOutput} />
                        </div>
                    </div>
                </div>
                <div className="h-screen w-1/4 bg-[#161b1d]">
                    <Videostream />
                    <button
                        onClick={() => { settrigger(!trigger) }}
                        className="bg-[#4079da] mr-10 rounded p-2"><label className="text-white">Create Room</label>
                    </button>
                    <div>
                        {roomid ? <h2> Room Created !</h2> : null}
                        <div className="flex">
                            <div>
                                <h3 className="bg-white border border-e-black w-9/10">{roomid}</h3>
                            </div>
                            {
                                roomid ?
                                    <div>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(roomid), toast.success("Copied to Clipboard") }}
                                            className="bg-white"> Copy </button>
                                    </div> : ""
                            }
                        </div>
                    </div>
                    <input
                        className="border border-black bg-amber-50"
                        type="text" placeholder="Enter Room Id to Join"
                        onChange={(e) => { SetJoinRoomId(JoinRoomId => e.target.value) }}
                    ></input>
                    <button className="bg-[#4079da] mr-10 rounded p-2" onClick={() => { JoinRoom() }}> <label className="text-white">Join Room</label> </button>
                    <div>
                        <label >{JoinRoomId ? "Room Id :" + JoinRoomId : (roomid ? "Room Id : " + roomid : null)}</label>
                    </div>
                </div>

            </div>
        </>
    )
}