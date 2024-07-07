import React, { useEffect, useState } from 'react'
import ProfilePostCard from './ProfilePostCard';
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function PostSection({postSection}) {
  const [user, setUser] = useState({});
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
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
            <div className='lg:w-1/2 w-full' key={item._id}>
              <ProfilePostCard item={item} key={item._id} user={user} />
            </div>
          )
         })}
        </div>
  );
}

export default PostSection