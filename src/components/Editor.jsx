import { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/closebrackets.js";
import ACTIONS from "../Actions";

const Editor = (props) => {
  const { socketRef, roomId, onCodeChange } = props;
  const editorRef = useRef(null);
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

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        console.log("code", code);
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, [roomId, onCodeChange, socketRef]);
  // on join sync codex

  useEffect(() => {
    socketRef.current.on(ACTIONS.SYNC_CODE, ({ code }) => {
      editorRef.current.setValue(code);
    });
  }, [socketRef]);

  return (
    <div>
      <textarea ref={editorRef} id="realtimeEditor"></textarea>
    </div>
  );
};

export default Editor;
