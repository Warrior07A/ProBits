import type { Request } from "express";
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type obj = {
    teacher_ws: WebSocket,
    student_ws?: WebSocket
}


let memory: Map<string, Set<WebSocket>> = new Map();

let no = 1;
wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("connection no." + no + "made");
    no++;
    ws.on("message", (data: any) => {
        // console.log("message received");
        data = JSON.parse(data);
        // console.log(data);
        if (data.type == "CREATE_ROOM") {
            let obj = {
                teacher_ws: ws
            }
            memory.set(data.room_id, new Set<WebSocket>());
            memory.get(data.room_id)!.add(ws);

            console.log("Room create logic reached");
            ws.send(
                JSON.stringify(
                    {
                        type: "ROOM_CREATED",
                        payload: {}
                    }
                )
            );
        }
        else if (data.type == "JOIN_ROOM") {
            const roomexist = memory.get(data.room_id);
            if (roomexist) {
                roomexist.add(ws);
                ws.send(
                    JSON.stringify({
                        type: "updated websockets",
                        payload: {}
                    })
                )
                console.log(memory.size)
                console.log("hello");
            }
            else {
                ws.send("Room doesnot exist");
            }
            // console.log(memory.get(data.roomid)!.size);
        }
        else if (data.type == "CODE_SEND") {
            let roomid = data.payload.room_id;
            let CurrRoom = memory.get(roomid);
            if (CurrRoom) {
                CurrRoom.forEach((ws_conn) => {
                    if (ws_conn != ws) {
                        ws_conn.send(JSON.stringify({
                            type: "CODE_UPDATE",
                            payload: {
                                changes: data.payload.changes
                            }
                        }))
                    }
                })
            }
            else {
                ws.send(JSON.stringify({
                    type : "LOCAL_RUN"
                }));
                console.log("not found");
            }
            console.log(memory.size);
            // console.log(memory.get(data.roomid)!.size);
        }
        else if (data.type == "TERMINAL_CODE") {
            let room_id = data.payload.room_id;
            let CurRoom = memory.get(room_id);
            if (CurRoom) {
                CurRoom.forEach((ws_conn)=>{
                    if (ws_conn != ws){
                        ws_conn.send(JSON.stringify({
                            type : "TERMINAL_CODE_UPDATE",
                            payload :{
                                code : data.payload.code
                            }
                        }))
                    }
                })
            }else{
                ws.send(JSON.stringify({
                    msg : "no such room exists"
                }))
            }
        }
        else {
            ws.send(JSON.stringify({
                msg: "this is out of my bounds in websockets brooo"
            }))
        }
    })
    ws.on("close", () => {
        const roomId = (ws).roomId;
        console.log("onclosing roomid is " + roomId);
    })
}

)
