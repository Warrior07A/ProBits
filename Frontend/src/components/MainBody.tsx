import { useEffect, useRef, useState } from "react";
import CodeEditor from "./Editor";
import Sidebar from "./Sidebar";
import Videostream from "./Videostream";
import axios from "axios";
const ws = new WebSocket("ws://localhost:8080");

export default function MainBody() {
    const editorinput = useRef(""); 
    const [trigger,settrigger] = useState(false);

     useEffect(()=>{
        async function dbcall(){
            const CreateRoom = await axios.post("http://localhost:3001/teacher/createroom" , {} , {
            headers : {
                Authorization : localStorage.getItem("Authorization")
            }})
            if (CreateRoom.status == 201){
                let teacher_id = CreateRoom.data.teacher_id;
                let room_id = CreateRoom.data.roomid;
                    ws.send(JSON.stringify({
                        type : "CREATE_ROOM",
                        teacher_id : teacher_id,
                        room_id : room_id
                    }))
                    ws.onmessage = (event) =>{
                        console.log(event);
                        let data = JSON.parse(event.data);
                        console.log(data);
                        if (data.type == "ROOM_CREATED"){
                            alert("room has been created");
                            return;
                        }
                        else{
                            
                        }
                    }
                }
        }
        dbcall();
    },[trigger])

    return (
        <>
            <div className="flex gap-10 ">
                <div className="h-screen w-3/4 flex ">

                    <div className="h-screen bg-red-700 w-2/5 ">
                        <Sidebar />
                    </div>
                    
                    <div className="h-screen grow-4 w-10 ">
                        <CodeEditor />
                    </div>

                </div>
                <div className="h-screen w-1/4 bg-orange-300">
                    <Videostream />
                    <button 
                        onClick={()=>{settrigger(!trigger) }}
                        className="border border-blue-900 bg-red-700">Create Room 
                    </button>
                    <button> Join Room</button>
                </div>

            </div>
        </>
    )
}