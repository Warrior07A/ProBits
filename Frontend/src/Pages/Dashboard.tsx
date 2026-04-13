import MainBody from "@/components/MainBody";
import Navbar from "@/components/Navbar";
import { WS } from "./Signin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


export default function Dashboard() {
    
    return (
        <>
        <div>
            <div className="w-full">
                <Navbar />
            </div>
            <div className="w-full">
                <MainBody />
            </div>
        </div>               
        </>
    )
}