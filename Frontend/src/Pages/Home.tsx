import { useEffect, useState } from "react";
import { ws } from "./Signin";

import { toast } from "react-toastify";
import Dashboard from "./Dashboard";
import { useParams, useNavigate } from "react-router-dom";

export default function Home() {
  const { roomid: paramRoomId } = useParams();
  const navigate = useNavigate();
  const [roomid, setroomid] = useState(paramRoomId || "");
  const [username, setusername] = useState("");
  const [showdashboard, setdashboard] = useState(false);

  useEffect(() => {
    if (paramRoomId) {
      setroomid(paramRoomId);
    }
  }, [paramRoomId]);

  function idGenerator() {
    let id = crypto.randomUUID();
    setroomid(id);
    navigate(`/${id}`, { replace: true });
    console.log(id);
  }

  function JoinRoom() {
    if (!username || !roomid) {
      toast.error("Input Fields cannot be empty");
      return;
    }
    
    if (paramRoomId !== roomid) {
      navigate(`/${roomid}`, { replace: true });
    }

    ws.send(JSON.stringify({
      type: "JOIN_ROOM",
      payload: {
        room_id: roomid
      }
    }));

    console.log("next step ahead");
    setdashboard(true);

  }

  return (
    showdashboard ?
      <div>
        <Dashboard />
      </div>
      : 
      <div>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br  from-[#0b1220] via-[#0f1a2d] to-[#0a1323]">

          <div className="w-[420px] bg-[#1b2636] rounded-xl shadow-2xl p-8">

            <h1 className="text-center text-white text-2xl font-semibold tracking-widest mb-8">
              {"</>"} CodeBridge
            </h1>

            <div className="mb-5">
              <label className="block text-gray-300 text-sm mb-2">
                Room ID:
              </label>

              <input
                value={roomid} onChange={(e) => { setroomid(e.target.value) }}
                className="w-full bg-[#0f1725] border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">
                Username:
              </label>

              <input
                value={username}
                onChange={(e) => { setusername(e.target.value) }}
                className="w-full bg-[#0f1725] border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => { JoinRoom() }}
              className="w-full bg-gray-200 text-black font-medium py-2 rounded-md hover:bg-gray-300 transition">
              Join Room
            </button>


            <p className="text-center text-gray-400 text-sm mt-5">
              Don't have a Room ID?{" "}
              <span onClick={() => { idGenerator() }} className="text-white underline cursor-pointer">
                Create one now
              </span>
            </p>

          </div>
        </div>
      </div>
  );
}