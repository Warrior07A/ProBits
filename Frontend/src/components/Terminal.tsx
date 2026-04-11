import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";


export default function XTerminal({ OutputCode } : { OutputCode: string }) {

    console.log("terminal changed ");
    const terminalRef = useRef<HTMLDivElement>(null);
    const termInstance = useRef<Terminal | null>(null);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 15,
            scrollback: 2000,
            // cursorStyle: "block", 
            theme: {
                background: "#000000",
                foreground: "#FFFFFF",
                cursor: "#ffffff"
            }
        });
        termInstance.current = term;
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        
        term.open(terminalRef.current!);
        fitAddon.fit();
        
        console.log(OutputCode);
        term.write(OutputCode != "" ? OutputCode : "Available Commands : help , clear");
        
        let command = "hi there"
        term.onData((data) => {
            term.clear();
            // ENTER
            if (data === "\r") {
                term.write("\r\n");

                if (command === "help") {
                    term.writeln("Available commands: help, clear");
                }

                if (command === "clear") {
                    term.clear();
                }

                command = "";
                term.write("$ ");
            }

            // BACKSPACE
            else if (data === "\u007F") {
                if (command.length > 0) {
                    command = command.slice(0, -1);
                    term.write("\b \b");
                }
            }

            // NORMAL CHARACTER
            else {
                command += data;
                term.write(data);
            }

        });

        return () => {
            term.dispose();
        }
    }, []);
    
    useEffect(()=>{
        if (termInstance.current && OutputCode){
            termInstance.current.clear();
            termInstance.current.writeln("");
            const formattedOutput = OutputCode.replace(/\n/g , "\r\n");
            termInstance.current.write(formattedOutput);
        }
    },[OutputCode])

    return <div className="border border-black"
        ref={terminalRef} style={{ height: "300px", width: "100%" }} />;
}