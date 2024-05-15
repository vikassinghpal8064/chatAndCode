import React, { useState ,useRef } from 'react'
import { Link } from 'react-router-dom'

function Chat() {
    let [list ,setList]= useState([]);
   let inputRef= useRef(null);
  function handleClick(){
    console.log(inputRef.current.value);
    list.push(inputRef.current.value);
    setList(list);
    console.log(list);
    inputRef.current.value="";
  }
  return (
  <div>
  <ul>

  </ul>
      <div className='flex fixed bottom-0 w-full'>
    <input ref={inputRef} className='bg-slate-300 w-full rounded-md h-10' type="text"  />
    <button onClick={handleClick} className='bg-red-500 rounded-md w-20 h-10'>send</button>
        </div>
    
</div>

    
  )
}

export default Chat
