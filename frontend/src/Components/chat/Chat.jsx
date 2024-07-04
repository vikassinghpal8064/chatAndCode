
import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import Nav from '../Nav';

function Chat() {
  const location = useLocation();
  const arr = location.state?.arr || [{ message: "null" }];
  const [messages, setMessages] = useState([...arr]);
  const inputRef = useRef(null);
  const socket = useRef();

  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.current = io(import.meta.VITE_BACKEND_API, {
      auth: {
        serverOffset: 0
      }
    });

    const userId = localStorage.getItem("userId");
    const friendId = sessionStorage.getItem("current");

    // Join the unique room
    let room = sessionStorage.getItem("friendId");
    console.log(room);
    socket.current.emit('joinRoom', room);

    // Receiving message
    socket.current.on("message", (msg) => {
      sessionStorage.setItem('firstMess', false);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.current.emit('leaveRoom', room);
      socket.current.disconnect();
    };
  }, []);

  // Sending message
  async function handleClick() {
    if (inputRef.current.value || file) {
      console.log("sending message");
      const msg = {
        sourceId: localStorage.getItem("userId"),
        firstMess: sessionStorage.getItem('firstMess'),
        targetId: sessionStorage.getItem("current"),
        message: inputRef.current.value
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileMsg = {
            ...msg,
           
            fileName: file.name,
            fileData: reader.result.split(',')[1] // Base64 encoding
          };
          socket.current.emit('message', fileMsg);
          setFile(null);
          setUpload(false);
        };
        reader.readAsDataURL(file);
      } else {
        socket.current.emit('message', msg);
      }

      inputRef.current.value = "";
    }
  }
console.log(messages);
  // Handle file change
  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setUpload(true);
  }

  
  return (
    <>
    <Nav/>
    <div className='bg-gradient-to-t from-red-400 to-blue-400 flex justify-center overflow-y-auto relative top-16' style={{height:'calc(100vh - 64px)', scrollbarWidth:'none'}}>
      <div className='w-100 bg-gradient-to-r h-full from-red-50 mb-11 to-red-400 p-4 overflow-y-auto' style={{scrollbarWidth:'none', height:'calc(100% - 46px)'}}>
        <ul className='space-y-5 grid'>
          {messages.map((item, index) => (
            item.sourceId == localStorage.getItem('userId') ? (
              <li key={index} className='bg-gray-300 rounded-md w-52 p-2'>
                {item.message}
                {item.fileUrl && (
                  <a href={item.fileUrl} download>
                    Download {item.fileName}
                  </a>
                )}
              </li>
            ) : (
              <li key={index} className='bg-gray-300 rounded-md justify-self-end w-52 p-3'>
                {item.message}
                {item.fileUrl && (
                  <a href={item.fileUrl} download>
                    Download {item.fileName}
                  </a>
                )}
              </li>
            )
          ))}
        </ul>
        
      </div>
      <div className='flex fixed bottom-0 w-100  bg-white mt-40'>
          <input ref={inputRef} className='bg-slate-300 rounded-md h-10 mr-2 w-full' type="text" />
          <input  onChange={handleFileChange} className='p-2  ' type="file" />
          <button onClick={handleClick} className='bg-green-500 rounded-md w-20 h-10'>Send</button>
      </div>
    </div>
    </>
  );
}

export default Chat;
