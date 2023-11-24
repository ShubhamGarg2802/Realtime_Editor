import React, {useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () =>{
    const navigate = useNavigate();
    const [roomID , setRoomID] = useState('');
    const [username , setUsername] = useState('');
    const createNewRoom = (e)=>{
        e.preventDefault();
        const id = uuidv4();
        setRoomID(id);
        toast.success('Created a new room')
    }

    const joinRoom = () => {
        if(!roomID || !username){
            toast.error('ROOM ID & Username is required');
            return;
        }

        navigate('/editor/${roomID}', {
            state: {
                username,
            },
        });
    };

        const handleKeyUp = (event) => {
            if(event.key === 'Enter'){
                joinRoom();
            }
        };

    return (
        <div className='homePageWrapper'>
            
            <div className="formWrapper">
                
                <img src="public/Code Fuse logo.png" alt="Code Fuse Logo" className='codeFuseLogo'/>
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                
                <div className="inputGroup">
                    <input type="text" className='inputBox'
                    placeholder='ROOM ID'
                    onChange={(e) => setRoomID(e.target.value)}
                    value={roomID}
                    onKeyUp={handleKeyUp} />
                    <input type="text" className='inputBox'
                    placeholder='USERNAME'
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    onKeyUp={handleKeyUp} />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">If you don't have an invite the create &nbsp;
                    <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home