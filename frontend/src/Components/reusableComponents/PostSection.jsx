import React, { useEffect, useState } from 'react'
import ProfilePostCard from './ProfilePostCard';

function PostSection({postSection}) {
  const [user, setUser] = useState({});
  async function handleUser(){
    let userId = localStorage.getItem("userId");
    await axiosInstances.get(`/user/${userId}`)
    .then((res)=>{
     setUser(res.data);
    })
    .catch((e)=>{
      console.log("failed to load user: ",e);
    })
  }
  useEffect(()=>{
    handleUser();
  },[])

  return (
        <div className="flex flex-wrap absolute w-full h-full top-10 left-0 bg-white border rounded-lg shadow-lg z-10 py-2 px-2 overflow-y-auto" style={{scrollbarWidth:"none"}}>
         {postSection && postSection.map((item,index)=>{
           return(
            <div className='w-1/2'>
              <ProfilePostCard item={item} key={item._id} user={user} />
            </div>
          )
         })}
        </div>
  );
}

export default PostSection