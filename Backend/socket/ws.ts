import type { Request } from "express";
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type obj = {
    teacher_ws: WebSocket,
    student_ws?: WebSocket
}

type Client = {
    ws: WebSocket,
    username: string
}

let memory: Map<string, Set<Client>> = new Map();

let no = 1;
wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("connection no." + no + "made");
    no++;
    ws.on("message", (data: any) => {

        data = JSON.parse(data);
        console.log(data);
        if (data.type == "JOIN_ROOM") {
            let obj = {
                ws: ws,
                username: data.payload.username,
            }
            let room_find = memory.get(data.payload.room_id);
            if (room_find){
                room_find.add(obj);
            }
            else{
                memory.set(data.payload.room_id, new Set<Client>());
                memory.get(data.payload.room_id)!.add(obj);
            }

            console.log("Room has been created");
            ws.send(
                JSON.stringify(
                    {
                        type: "ROOM_CREATED",
                        payload: {}
                    }
                )
            );
            console.log(memory);
        }
        else if (data.type == "VALID_ROOM") {
            // console.log(data.payload.roomid);
            // console.log(memory);
            let roomid = memory.get(data.payload.roomid);
            // console.log(roomid);
            if (roomid) {
                ws.send(JSON.stringify({
                    type: "ROOM_VALID"
                }))
            } else ws.send(JSON.stringify({
                type: "ROOM_INVALID"
            }))
        }
        else if (data.type == "CODE_SEND") {
            let roomid = data.payload.room_id;
            let CurrRoom = memory.get(roomid);
            if (CurrRoom) {
                CurrRoom.forEach((ws_conn) => {
                    if (ws_conn.ws != ws) {
                        ws_conn.ws.send(JSON.stringify({
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
                    type: "LOCAL_RUN"
                }));
                console.log("not found");
            }
        }
        else if (data.type == "TERMINAL_CODE") {
            let room_id = data.payload.room_id;
            let CurRoom = memory.get(room_id);
            if (CurRoom) {
                CurRoom.forEach((ws_conn) => {
                    if (ws_conn.ws != ws) {
                        ws_conn.ws.send(JSON.stringify({
                            type: "TERMINAL_CODE_UPDATE",
                            payload: {
                                code: data.payload.code
                            }
                        }))
                    }
                })
            } else {
                ws.send(JSON.stringify({
                    msg: "no such room exists"
                }))
            }
        }
        else if (data.type == "CREATE_ROOM") {
            let room_id = data.room_id || data.payload?.room_id;
            if (room_id) {
                if (!memory.has(room_id)) {
                    memory.set(room_id, new Set<Client>());
                }
                ws.send(JSON.stringify({
                    type: "ROOM_CREATED",
                    payload: {}
                }));
                console.log("Room created via CREATE_ROOM");
            }
        }
        else {
            ws.send(JSON.stringify({
                msg: "messed up in ws"
            }))
        }
    })
    ws.on("close", () => {
        // const roomId = (ws).roomId;
        // console.log("onclosing roomid is " + roomId);
    })
}

)
