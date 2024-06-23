import React from 'react'
import { useState } from 'react';
import { CiMenuKebab } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { FaRegThumbsUp ,FaRegThumbsDown,FaThumbsDown,FaThumbsUp,FaRegCommentAlt ,FaShare} from "react-icons/fa";


function ProfilePostCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  let [isOpen,setIsOpen] = useState(false);
  console.log(item.userId._id,"id of user");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  
  const openDropdown = ()=>{
    setIsOpen(true);
  }
  
  const closeDropdown = ()=>{
    setIsOpen(false);
  }

  return (
    <div className='py-2 px-4 mb-2 rounded-lg bg-gray-100 mx-1' style={{width:'calc(100% - 8px)'}}>
      <div className='flex justify-start mb-4'>
      <div className='pr-2 pt-1 w-1/6'>
          {item.userId.photo && !pictureLoad ?
      (
        <>
        <img src={item.userId.photo} onError={()=>setPictureLoad(true)} className='w-12 h-12 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-12 h-12 rounded-full border-black border-2'/>
        </>
      )}
      </div>
      <div className='w-9/12'>
          <button><h2 className='text-2xl font-semibold cursor-default'>{item.userId.firstName} {item.userId.lastName && (item.userId.lastName)}</h2></button>
        <h2 className='text-sm text-gray-400'>{formatDate(item.createdAt)}</h2>
      </div>
      <div className='1/12 inline-flex items-center justify-center relative' onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
      <CiMenuKebab className='text-xl'/>
      {isOpen && (
        <div className="absolute top-10 right-0 w-48 bg-white border rounded-lg shadow-lg z-20">
          <Link to={'/user/update-profile'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Update Profile</Link>
          <Link to={'/user/my-posts'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Chat</Link>
          <Link to={'/addpost'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Add Post</Link>
          <Link to={'/user/notifications'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Notifications</Link>
        </div>
      )}
      </div>
      </div>
      <div>
      <h2 className='text-xl font-semibold pb-2'>{item.title}</h2>
      <div className='bg-gray-300 w-full h-50'>
      <img className='h-60 w-auto mx-auto' src={item.upload} />
      </div>
      <h2 className='text-xl font-medium py-2 line-clamp-2 expand-text h-16'>{item.desc}</h2>
      </div>
    </div>
  )
}

export default ProfilePostCard