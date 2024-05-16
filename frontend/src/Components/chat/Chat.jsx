import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

function Chat() {
  let [messages, setMessages] = useState([]);
  let inputRef = useRef(null);
  let socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:8080",{
      auth: {
        serverOffset: 0
      }
    });


    socket.current.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      socket.current.auth.serverOffset = serverOffset;
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  function handleClick() {
    if (inputRef.current.value) {
      socket.current.emit('message', inputRef.current.value);
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <ul>
        {messages.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div className='flex fixed bottom-0 w-full'>
        <input ref={inputRef} className='bg-slate-300 w-full rounded-md h-10' type="text" />
        <button onClick={handleClick} className='bg-red-500 rounded-md w-20 h-10'>send</button>
      </div>
    </div>
  );
}

export default Chat;
