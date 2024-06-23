
import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

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
    <div className='bg-gradient-to-t from-red-300 to-blue-600 flex justify-center min-h-screen'>
      <div className='w-100 bg-gradient-to-r from-red-50 to-red-400 rounded-md p-4'>
        <ul className='space-y-5 grid'>
          {messages.map((item, index) => (
            item.sourceId == localStorage.getItem('userId') ? (
              <li key={index} className='bg-gray-300 rounded-md w-52'>
                {item.message}
                {item.fileUrl && (
                  <a href={item.fileUrl} download>
                    Download {item.fileName}
                  </a>
                )}
              </li>
            ) : (
              <li key={index} className='bg-gray-300 rounded-md justify-self-end w-52'>
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
          <input onChange={handleFileChange} className='mr-2' type="file" />
          <button onClick={handleClick} className='bg-red-500 rounded-md w-20 h-10'>Send</button>
        </div>
    </div>
  );
  
}

export default Chat;
