import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function ProfileFriendCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  let [profile,setProfile] = useState({});
  let navigate = useNavigate();
  let axiosInstances = SetupAxiosInstances(navigate);

  async function handleProfile(id){
    await axiosInstances.get(`/user/${id}`)
    .then((res)=>{
     setProfile(res.data);
     navigate(`/ViewProfile/${id}`,{state:{profile:res.data}});
    })
    .catch((e)=>{
      console.log("failed to fetch profile: ",e);
    })
  }

  return (
  <div className='px-2 py-1 mb-1 flex justify-center w-full group'>
      <button onClick={()=>{handleProfile(item._id)}}>
      {item.photo && !pictureLoad ?
      (
        <>
        <div className='flex justify-center'>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='w-16 h-16 border-2 border-black rounded-full bg-gray-300'/>
        </div>
      <div onClick={()=>{handleProfile(item._id)}} className='sm:text-lg md:text-base lg:text-lg xl:text-xl font-bold hover:text-blue-800 hover:underline cursor-pointer'>{item.firstName} {item.lastName && (item.lastName)}</div>
        </>
      ):(
        <>
        <div className='flex justify-center'>
        <img src="/Assets/profile.png" className='w-16 h-16 border-2 border-black rounded-full bg-gray-300'/>
        </div>
        <div onClick={()=>{handleProfile(item._id)}} className='sm:text-lg md:text-base lg:text-lg xl:text-xl font-bold hover:text-blue-800 hover:underline cursor-pointer line-clamp-1 group-hover:line-clamp-none'>{item.firstName} {item.lastName && (item.lastName)}</div>
        </>
      )}
      </button>
  </div>
  )
}


export default ProfileFriendCard