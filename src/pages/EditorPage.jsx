import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor.jsx";
import { initSocket } from "../socket.js";
import ACTIONS from "../Actions.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const roomId = useLocation().pathname.split("/")[2];
  console.log(roomId);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([
    //     {socketID:1, username: 'Shubham G'},
    //     {socketID:2, username: 'Prachi A'},
    //     {socketID:3, username: 'Tannu S'},
  ]);
  const reactNavigator = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket Connection Failed, Try Again Later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
          console.log("joined", username, "code", codeRef.current);
        }
      );
      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [roomId, location.state?.username, reactNavigator]);

  async function copyRoomId() {
    try {
      console.log(roomId);
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy Romm ID");
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/CodeFuseLogo.png" alt="" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        {socketRef.current && (
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
            username={location.state?.username}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPage;
