import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTerminal() {
    const terminalRef = useRef<HTMLDivElement>(null);
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
        
        term.reset();
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current!);
        fitAddon.fit();
        window.addEventListener("resize", () => fitAddon.fit());
        term.write("Available commands: help, clear\r\n$ ");
        let command = "";
        term.onData((data) => {

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

    return <div className="border border-black"
        ref={terminalRef} style={{ height: "200px", width: "100%" }} />;
}