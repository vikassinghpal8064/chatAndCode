import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';
function PostSection({postSection}) {
  return (
        <div className="flex absolute w-full h-full top-10 left-0 bg-white border rounded-lg shadow-lg z-50 py-2 px-2">
         {postSection && postSection.map((item,index)=>{
           return(
            <div className='w-1/2 mr-2'>
              <PostCard item={item} key={item._id}></PostCard>
            </div>
          )
         })}
        </div>
  );
}

export default PostSection