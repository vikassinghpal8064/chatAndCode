import React from 'react'
import ProfilePostCard from './ProfilePostCard';
function PostSection({postSection}) {
  return (
        <div className="flex flex-wrap absolute w-full h-full top-10 left-0 bg-white border rounded-lg shadow-lg z-50 py-2 px-2">
         {postSection && postSection.map((item,index)=>{
           return(
            <div className='w-1/2'>
              <ProfilePostCard item={item} key={item._id} />
            </div>
          )
         })}
        </div>
  );
}

export default PostSection