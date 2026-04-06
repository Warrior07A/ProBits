import { useEffect, useRef, useState } from "react";
import CodeEditor from "./Editor";
import Sidebar from "./Sidebar";
import Videostream from "./Videostream";
import axios from "axios";
const ws = new WebSocket("ws://localhost:8080");

export default function MainBody() {
    const editorinput = useRef(""); 
    const [trigger,settrigger] = useState(false);
    let [roomid ,setroom_id] = useState("");
    let [JoinRoomId , SetJoinRoomId ]= useState("");



    async function JoinRoom(){
        if(JoinRoomId == ""){
            return alert("Enter a valid room id");
        }
        const res = await axios.put("http://localhost:3001/user/join?roomId=" + JoinRoomId ,{} ,{
            headers : {
                Authorization : localStorage.getItem("Authorization")
            }
        });
        console.log(res);
        if (res.status == 201 ){
            alert("You have joined the Room");
            ws.send(JSON.stringify({
                type : "JOIN_ROOM",
                student_id : res.data.student_id,
                room_id : JoinRoomId
            }))

        }
        else if (res.status == 200){
            alert("Welcome back");
        }

    }

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
                            setroom_id(roomid => room_id);
                            settrigger(trigger => false);
                            return;
                        }
                        console.log("else mein fatta");
                        return;
                    }
                }
        }
        if (trigger){
            dbcall();
        }
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
                    <div> 
                        {roomid ? <h2> Room Created !</h2> :<h2> Create a Room </h2>}
                        <div className="flex">
                            <div>
                                <h3 className="bg-white border border-e-black w-9/10">{roomid}</h3>
                                </div>
                                {
                                    roomid ? 
                                <div>
                                    <button
                                        onClick={()=>{navigator.clipboard.writeText(roomid) , alert("Copied to clipboard")}}
                                        className="bg-white"> Copy </button>
                                </div> : ""
                                 }
                        </div>
                    </div>
                    <input
                        className="border border-black bg-amber-50"
                        type = "text" placeholder="Enter Room Id to Join"
                        onChange = {(e)=>{SetJoinRoomId (e.target.value) }}
                        ></input>
                    <button className="bg-red-600" onClick={()=>{JoinRoom()}}> Join Room</button>
                </div>

            </div>
        </>
    )
}