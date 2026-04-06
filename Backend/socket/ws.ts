import type { Request } from "express";
import { WebSocket, WebSocketServer } from "ws";
import axios from "axios";
import url from "url"

const wss = new WebSocketServer({ port: 8080 });

// type IncomingData = {
//     type : string,
//     teacher_id : string,
//     room_id : string
// }

type obj = {
    teacher_id: string,
    teacher_ws: WebSocket,
    student_id?: string,
    student_ws?: WebSocket
}

let memory: Map<string, obj> = new Map();

wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("connection made");
    ws.on("message", (data: any) => {
        console.log("message received");
        data = JSON.parse(data);
        console.log(data);
        if (data.type == "CREATE_ROOM") {
            let obj = {
                teacher_id: data.teacher_id,
                teacher_ws: ws
            }
            memory.set(data.room_id, obj);
            console.log("Room create logic reached");
            console.log(memory);
            ws.send(
                JSON.stringify(
                    {
                        type: "ROOM_CREATED",
                        payload: {}
                    }
                )
            );
        }
        else if (data.type == "JOIN_ROOM"){
            const roomexist = memory.get(data.room_id);
            if (roomexist){
                roomexist["student_id"] = data.student_id;
                roomexist["student_ws"] = ws;
            }
            ws.send(
                JSON.stringify({
                    type : "updated websockets", 
                    payload : {}
                })
            )
        }
    })
}

)
