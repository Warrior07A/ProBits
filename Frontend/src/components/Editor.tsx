import { Editor } from "@monaco-editor/react";
import { useState } from "react";

export default function CodeEditor(){
    const [inputedit , setinputedit] = useState("");
    
    return (
        <>
        <h1> lovely codeditor</h1>
            <Editor  defaultLanguage="javascript" defaultValue="You can code here in JavaScript"/>
        </>
    )


}