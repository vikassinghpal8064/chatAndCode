import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation,useNavigate,Link} from 'react-router-dom';
import Nav from '../Nav';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import { FaDownload, FaUpload } from 'react-icons/fa';

function Chat() {
  const location = useLocation();
  const arr = location.state?.arr || [{ message: "null" }];
  let parentRef = useRef(null);
  let [pictureLoad, setPictureLoad] = useState(false);
  const [childWidth, setChildWidth] = useState('100%');
  const [messages, setMessages] = useState([...arr]);
  const [member , setMember] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useRef();
  let navigate = useNavigate();
  let axiosInstances = SetupAxiosInstances(navigate);
  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);

  const userId = localStorage.getItem('userId');
  let targetId = sessionStorage.getItem("current");

  useEffect(()=>{
    async function ChatFriend(){
    await axiosInstances.get(`/find-friend/${targetId}`)
    .then((res)=>{
      if(res.status == 201){
        setMember(res.data);
        console.log("response: ",res.data);
      }
    })
    .catch((e)=>{
      console.log("error in chat friend: ",e.message);
    })
    }
    ChatFriend();
  },[targetId])

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
      console.log("receving message");
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


// console.log(messages);

  // Handle file change
  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setUpload(true);
  }

  useEffect(()=>{
    const handleResize = () => {
      if (parentRef.current) {
        const parentWidth = parentRef.current.clientWidth;
        setChildWidth(`${parentWidth}px`);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  function handleIconClick(){
    console.log("i am alive");
  }

  return (
    <>
    <Nav/>
    <div className='bg-gradient-to-t from-red-400 to-blue-400 flex justify-center xs:relative xs:top-10 h-screen xs:h-screen-40 sm:top-12 sm:h-screen-48 md:top-14 md:h-screen-56 lg:top-16 lg:h-screen-64'>
     <div className='relative w-full xs:w-10/12 sm:w-4/5 md:w-2/3 lg:w-3/5' ref={parentRef}>
      <div className='h-14 xs:fixed xs:top-10 sm:top-12 md:top-14 lg:top-16 bg-gray-300 flex items-center px-2' style={{width:childWidth}}>
      {member && member.receiver && !pictureLoad ?
      (
        <>
        <img src={member.receiver.photo || '/Assets/profile.png'} onError={()=>setPictureLoad(true)} className='w-10 h-10 rounded-full border-black border-2'/>
        <h2 className='text-base pl-2 font-bold xs:text-lg sm:text-xl'>{member.receiver.firstName} {member.receiver.lastName}</h2>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-10 h-10 rounded-full border-black border-2'/>
        <h2 className='text-base pl-2 font-bold xs:text-lg sm:text-xl'>{member && (member.receiver.firstName)} {member && (member.receiver.lastName)}</h2>
        </>
      )}
      </div>
      <div className='w-full bg-gradient-to-r from-red-50 mb-11 to-red-400 p-4 overflow-y-auto h-screen-112 xs:h-screen-152 sm:h-screen-160 md:h-screen-168 lg:h-screen-176 xs:relative xs:top-14' style={{scrollbarWidth:'none'}}>
        <ul className='space-y-3'>
          {messages.map((item,index)=>(
            <li className= {`flex ${item.sourceId == userId ? 'justify-end':'justify-start'}`}>
             <div className={`${item.sourceId == userId ? 'bg-green-300 text-black' : 'bg-gray-100 text-black'} w-auto py-2 px-3 rounded-md shadow-lg max-w-[150px] text-sm xs:max-w-[200px] xs:text-base sm:max-w-[225px] md:max-w-[300px] md:text-lg lg:max-w-[350px] font-medium`}>
             <p>{item.message}</p>
             {item.fileUrl && (
                <a href={item.fileUrl} download className='text-sm text-blue-800 underline flex items-center justify-center'>{item.fileName} 
                <div className='text-gray-400 border-2 mr-2 border-gray-400 rounded-full flex justify-center items-center'>
                  <FaDownload/>
                </div>
                </a>
             )}
             </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex fixed items-center px-1 xs:px-2 bottom-0 h-14 bg-gray-300 font-semibold text-base xs:text-lg md:text-xl' style={{width:childWidth}}>
          <div className='flex items-center'>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{display:'none'}}/>
            <button className='text-blue-500 hover:text-blue-700 text-xl sm:text-2xl pr-2' onClick={handleIconClick}><FaUpload/></button>
          </div>
          <input ref={inputRef} className='bg-white rounded-md h-10 mr-2 px-2 py-1 w-full outline-0 text-center' placeholder='send message here...' type="text" />
          <button onClick={handleClick} className='bg-green-500 px-2 rounded-md h-10'>Send</button>
      </div>
     </div>
    </div>
    </>
  );
}

export default Chat;
