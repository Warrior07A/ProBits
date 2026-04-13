import { useState } from "react";

export default function Navbar() {
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(14);

    return (
        <div className="h-16 flex items-center justify-between px-8 
                        bg-[#0f172a] text-white shadow-md border-b border-[#1f2937]">

            {/* Logo */}
            <div className="text-2xl font-bold tracking-wide text-blue-400">
                CodeBridge
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="javascript">Javascript</option>
                    <option value="cpp">C++</option>
                </select>

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="vs-dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="hc-black">HC Black</option>
                </select>

                <select
                    className="bg-[#1e293b] hover:bg-[#334155] transition px-3 py-1.5 rounded-md text-sm outline-none"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                >
                    {[12,14,16,18,20].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>

            </div>
        </div>
    );
}