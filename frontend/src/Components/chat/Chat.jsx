import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import axios from "axios"


function Chat() {
  const location = useLocation();
  const arr = location.state?.arr || [{ message: "null" }];
  const [messages, setMessages] = useState([...arr]);
  const inputRef = useRef(null);
  const socket = useRef();
 const [upload,setUpload]=useState(false);
 const [file,setFile]=useState(null);
  useEffect(() => {
    socket.current = io("http://localhost:8080", {
      auth: {
        serverOffset: 0
      }
    });

    const userId = localStorage.getItem("token");
    const friendId = sessionStorage.getItem("current");
   

    // Join the unique room
    let room= sessionStorage.getItem("friendId");
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
  function handleClick() {
    if (inputRef.current.value) {
      const msg = {
        sourceId: localStorage.getItem("token"),
        firstMess: sessionStorage.getItem('firstMess'),
        targetId: sessionStorage.getItem("current"),
        message: inputRef.current.value
      };
      socket.current.emit('message', msg);
      inputRef.current.value = "";
    }
  }

  //upload function
 function handleFileChange(e){
  setFile(e.target.files[0]);
 
  setUpload(true);
  
 
 }

 //submit upload
 async function handleUpload(e){
 e.preventDefault();
 console.log("hello")
 if(upload==true){

   let formData= new FormData();
   formData.append("file",file);
   try {
    let res = await axios.post("http://localhost:8080/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
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
     
        <input onChange={handleFileChange} type="file" />
        {upload==true && <button onClick={handleUpload} className='bg-blue-400 rounded-md w-20 h-10'>upload</button>}
        <button onClick={handleClick} className='bg-red-500 rounded-md w-20 h-10'>send</button>
      </div>
    </div>
  );
}

export default Chat;
