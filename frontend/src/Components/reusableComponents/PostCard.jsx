import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegThumbsUp ,FaRegThumbsDown,FaThumbsDown,FaThumbsUp,FaRegCommentAlt ,FaShare} from "react-icons/fa";

function PostCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  console.log(item.userId._id,"id of user");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  return (
    <div className='py-2 px-4 mb-4 rounded-lg bg-gray-100 group relative transition-all duration-300 ease-in-out'>
      <div className='flex justify-start mb-4'>
      <div className='pr-2 pt-1'>
          <Link to={`/ViewProfile/${item.userId._id}`}>
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
          </Link>
      </div>
      <div>
          <Link to={`/ViewProfile/${item.userId._id}`}>
        <h2 className='text-2xl font-semibold hover:underline hover:text-blue-400'>{item.userId.firstName} {item.userId.lastName && (item.userId.lastName)}</h2>
          </Link>
        <h2 className='text-sm text-gray-400'>{formatDate(item.createdAt)}</h2>
      </div>
      </div>
      <div>
      <h2 className='text-xl font-semibold pb-2'>{item.title}</h2>
      <div className='bg-gray-300 w-full h-60'>
      <img className='h-60 w-auto mx-auto' src={item.upload} />
      </div>
      <h2 className='text-xl font-medium py-2'>{item.desc}</h2>
      </div>
       <div className='h-0 w-full transition-all duration-300 ease-in-out group-hover:h-7 overflow-hidden'>
        <div className='h-full flex justify-evenly border-t-2 border-gray-300'>
          <div className='flex text-lg'>
            <div className='flex items-center'>
            <p className='pr-1'>0</p>
            <FaRegThumbsUp className='mr-4'></FaRegThumbsUp>
            </div>
            <div className='flex items-center'>
            <p className='pr-1'>0</p>
            <FaRegThumbsDown></FaRegThumbsDown>
            </div>
          </div>
          <div className='flex items-center text-lg'>
            <FaRegCommentAlt className='mr-1'></FaRegCommentAlt>
            <p>Comments 0</p>
          </div>
          <div className='flex items-center text-lg'>
            <FaShare className='mr-1'></FaShare>
            <p>Share</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard