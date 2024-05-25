import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
function Chat() {
  const location = useLocation();
  console.log(location.state.arr);
  const arr = location.state?.arr || [{message:"null"}];
  console.log(arr);
  let [messages, setMessages] = useState([...arr]);
  let inputRef = useRef(null);
  let socket = useRef();


  useEffect(() => {
    socket.current = io("http://localhost:8080",{
      auth: {
        serverOffset: 0
      }
    });

//receiving message
    socket.current.on("message", (msg) => {
      sessionStorage.setItem('firstMess',false);
      setMessages((prevMessages) => [...prevMessages, msg]);
      // socket.current.auth.serverOffset = serverOffset;
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);


  //sending msg
  function handleClick() {
    if (inputRef.current.value) {
      const msg={
        sourceId:localStorage.getItem("token"),
        firstMess:sessionStorage.getItem('firstMess'),
        targetId:sessionStorage.getItem("current"),
        message: inputRef.current.value
      };
      socket.current.emit('message',msg);
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <ul>
        {messages.map((item, index) => (
          <li key={index}>{item.message}</li>
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
