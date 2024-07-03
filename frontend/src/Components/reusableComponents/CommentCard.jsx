import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function CommentCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  let navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  function handleClick(id){
   localStorage.setItem("clickId",id);
   navigate(`/ViewProfile/${id}`);
  }

  return (
    <div className='w-full px-2 py-1 mb-1 bg-green-100 rounded-lg'>
    <div className='flex'>
      <button onClick={()=>handleClick(item.commentedBy._id)}>
      {item.commentedBy.photo && !pictureLoad ?
      (
        <>
        <img src={user.photo} onError={()=>setPictureLoad(true)} className='w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      )}
      </button>
      <div className='flex items-center justify-between w-full'>
      <button onClick={()=>handleClick(item.commentedBy._id)} className='text-md pl-2 font-semibold text-gray-900 hover:text-blue-600 hover:underline'>{item.commentedBy.firstName} {item.commentedBy.lastName && (item.commentedBy.lastName)}</button>
      <p className='text-xs pl-2 font-semibold'>{formatDate(item.createdAt)}</p>
      </div>
    </div>
    <div>
    <p className='text-sm font-semibold pl-10'>{item.comment}</p>
    </div>
    </div>
  )
}


export default CommentCard