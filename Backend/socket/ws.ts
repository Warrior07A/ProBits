import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({port : 8080});

let ws_conn = [];

wss.on("connection" , async(ws)=>{
    ws_conn.push(ws);
    ws.on("message" , )
})