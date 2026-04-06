import { Editor  }  from "@monaco-editor/react";
import type {editor} from "@monaco-editor/react";
import axios from "axios";

import { useEffect, useRef, useState } from "react";

export default function CodeEditor(){
    const editorinput = useRef<editor.IStandaloneCodeEditor | null> (null);
    
    const EditorDidMount = (editor : editor.IStandaloneCodeEditor )=>{
        editorinput.current = editor; 
    }
    
    return (
        <>
        <h1> lovely codeditor</h1>
            <Editor 
            onMount={EditorDidMount}
            defaultLanguage="javascript" defaultValue="You can code here in JavaScript"/>
        </>
    )


}