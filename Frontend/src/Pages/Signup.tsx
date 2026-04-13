import axios from "axios";
import { color } from "bun";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { BE } from "./Signin";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    function errorHandler() {
        function emailVerify() {    
            if (!email.includes("@")) {
                toast.error("Invalid Email!" );
                setEmail(email =>(""))
                return 0;
            }
            return 1;
        }
        function passwordVerify() {
            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return 0;
            }
            return 1;
        }
        return { emailVerify, passwordVerify }
    }

    async function signupHandler() {
        const Handler = errorHandler();
        if (!Handler.emailVerify() || !Handler.passwordVerify()) return;
        if (email === "" || password === "") {
            toast.error("All input fields must be filled");
            return;
        }
        try {
            const res = await axios.post("http://" + BE + "/api/auth/signup", {
                email: email,
                password: password
            })
            if (res.status === 201) {
                toast.success("You are Signd Up");
                setTimeout(()=>{
                    navigate("/signin");
                },1000)
            }
            console.log(res);
        } catch (error) {
            if (error.status == 400){
                toast.error("Email already exists !Please Signin")
                navigate("/signin");
            }
            console.error("Signup error:", error);
            toast.error("Signup failed. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
                    <p className="mt-2 text-sm text-gray-600">Create a new account</p>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-600 font-bold">*</span>
                        </label>
                        <input 
                            onChange={(e) => { setEmail(e.target.value) }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2b66b1] focus:border-transparent outline-none transition duration-200 ease-in-out"
                            type="email" 
                            placeholder="Enter your email"
                            value = {email}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-600 font-bold">*</span>
                        </label>
                        <input 
                            onChange={(e) => { setPassword(e.target.value) }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2b66b1] focus:border-transparent outline-none transition duration-200 ease-in-out"
                            type="password" 
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <div className="mt-2">
                        <button
                            className="w-full text-white bg-[#2b66b1] hover:bg-[#20508f] font-semibold rounded-lg px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out active:scale-[0.98]"
                            onClick={() => { signupHandler() }}
                        >       
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
    
}