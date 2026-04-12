import { useState } from "react"

export default function Navbar() {
    const [language, setLanguage] = useState("");
    return (
        <div>
            <div className="bg-[#555555] h-15">
                this is navbar i know it
            </div>
            <div className="bg-[#171b1c]">
                <div className="flex justify-between w-310 ">
                    <div>

                        {/* <label for = "select-language" > Choose Language </label> */}
                        <select 
                            className="bg-white border border-black m-3 ml-10"
                                id="lang-select" name="languages">
                            <option value="C++"> C++</option>
                            {/* 76 */}
                            <option value="C "> C </option>
                            {/* 50 */}
                            <option value="JavaScript" >JavaScript</option>
                            {/* 63 */}
                            <option value="Go"> Go </option>
                            {/* 60 */}
                            <option value="Rust"> Rust</option>   { /* 73.  */}
                        </select>
                    </div>

                    <div className="justify-center align-middle mt-1">
                        <button className="bg-[#4079da] mr-10 rounded p-2"
                            onClick={() => { compileCode() }}
                        ><label className="text-white"> Run Code </label></button>
                    </div>

            </div>
            </div>

        </div>
    )
}