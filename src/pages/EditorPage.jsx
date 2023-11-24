import React, {useEffect, useRef, useState} from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor';
import { initSocket } from '../socket.js';
import ACTIONS from '../Actions.js';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const {roomId} = useParams(); 
    const socketRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    useEffect(()=>{
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket Connection Failed, Try Again Later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
        };
    });
    const [clients, setClients] = useState([
        {socketID:1, username: 'Shubham G'},
        {socketID:2, username: 'Prachi A'},
        {socketID:3, username: 'Tannu S'},
    ]);

    if(!location.state){
        return <Navigate to="/"/>
    }

    return (
        <div className='mainWrap'>
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className='logoImage' src="/Code Fuse Logo.png" alt="" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {
                            clients.map((client) => (
                                <Client 
                                key={client.socketID}
                                username={client.username}/>
                            ))
                        }
                    </div>
                </div>
                <button className='btn copyBtn'>Copy ROOM ID</button>
                <button className='btn leaveBtn'>Leave</button>
            </div>
            <div className="editorWrap">
                <Editor></Editor>
            </div>
        </div>
    )
}

export default EditorPage