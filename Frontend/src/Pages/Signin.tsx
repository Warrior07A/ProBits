import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    function errorHandler() {
        function emailVerify() {
            if (!email.includes("@")) {
                alert("Inavlid email");
                return 0;
            }
            return 1;
        }
        function passwordVerify() {
            if (password.length < 6) {
                alert("Password must be of 6 characters");
                return 0;
            }
            return 1;
        }
        return { emailVerify, passwordVerify }
    }

    async function signipHandler() {
        const Handler = errorHandler();
        if (!Handler.emailVerify() || !Handler.passwordVerify()) return;
        if (email == "" || password == "") {
            alert("all input fields must be filled")
            return;
        }   
        const res = await axios.post("http://localhost:3001/api/auth/login", {
            email: email,
            password: password
        })
        if (res.status == 200) {
            console.log(res);
            localStorage.setItem("Authorization", "Bearer " + res.data.data.token)
            alert("you have logged in successfully");
            navigate("/ide");
        }
        console.log(res);
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex flex-col gap-6">
                        <div className="">
                            <div className="mb-1">
                                <label className="block text-sm font-medium text-gray-700">Email<label className="text-red-600 font-bold ml-1">*</label></label>
                            </div>
                            <input onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2b66b1] focus:border-transparent outline-none transition duration-200 ease-in-out"
                                type="text" placeholder="enter your email"></input>
                        </div>
                        <div className="">
                            <div className="mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password<label className="text-red-600 font-bold ml-1">*</label></label>
                            </div>
                            <input onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2b66b1] focus:border-transparent outline-none transition duration-200 ease-in-out"
                                type="text" placeholder="enter your password"></input>
                        </div>
                        <div className="mt-2">
                            <div>
                                <button
                                    className="w-full text-white bg-[#2b66b1] hover:bg-[#20508f] font-semibold rounded-lg px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out active:scale-[0.98]"
                                    onClick={() => { signipHandler() }}>Signin</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}