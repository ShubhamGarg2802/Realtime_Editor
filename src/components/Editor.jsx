/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/closebrackets.js";
import ACTIONS from "../Actions";

const Editor = (props) => {
  const { socketRef, roomId, onCodeChange, username } = props;
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) return;
    setTimeout(() => {
      editorRef.current.on("change", (doc) => {
        const code = doc.getValue();
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code, username });
      });
    }, 100);
  }, [onCodeChange, roomId, socketRef, username]);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
    }
    init();
  }, []);
  useEffect(() => {
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code === editorRef.current.getValue()) return;
      editorRef.current.setValue(code);
    });
  });

  return (
    <div>
      <textarea ref={editorRef} id="realtimeEditor"></textarea>
    </div>
  );
};

export default Editor;
