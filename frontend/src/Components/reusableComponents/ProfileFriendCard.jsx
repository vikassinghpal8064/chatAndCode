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
  <div className='h-20 px-2 py-2 mx-1 mb-1 flex' style={{width:'calc(100% - 8px)'}}>
      <button onClick={()=>{handleProfile(item._id)}}>
      {item.photo && !pictureLoad ?
      (
        <>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='w-16 h-16 border-2 border-black rounded-full bg-gray-300'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-16 h-16 border-2 border-black rounded-full bg-gray-300'/>
        </>
      )}
      </button>
    <div className='flex items-center pl-1'>
      <button onClick={()=>{handleProfile(item._id)}} className='text-md font-bold hover:text-blue-800 hover:underline'>{item.firstName} {item.lastName && (item.lastName)}</button>
    </div>
  </div>
  )
}

export default ProfileFriendCard