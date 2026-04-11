import { Navigate, Outlet, useNavigate } from "react-router";

export default function ProtectedRoute(){
    let token =  localStorage.getItem("Authorization")?.split(" ")[1];
    return(
        token ? <Outlet/> :  <Navigate to ="/signup"/>
    )
}