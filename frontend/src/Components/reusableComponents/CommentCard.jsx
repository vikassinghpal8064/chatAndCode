import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function CommentCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  let [profile, setProfile] = useState({});
  let navigate = useNavigate();
  let axiosInstances = SetupAxiosInstances(navigate);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

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
    <div className='w-full px-1 xs:px-2 py-1 mb-1 bg-green-100 xs:rounded-md sm:rounded-lg rounded-lg'>
    <div className='flex'>
      <button onClick={()=>handleProfile(item.commentedBy._id)} >
      {item.commentedBy.photo && !pictureLoad ?
      (
        <>
        <img src={user.photo} onError={()=>setPictureLoad(true)} className='md:w-10 md:h-10 w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='md:w-10 md:h-10 w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      )}
      </button>
      <div className='flex items-center justify-between w-full'>
      <button onClick={()=>handleProfile(item.commentedBy._id)} className='text-xs xs:text-base md:text-lg pl-1 xs:pl-2 line-clamp-1 font-semibold text-gray-900 hover:text-blue-600 hover:underline'>{item.commentedBy.firstName} {item.commentedBy.lastName && (item.commentedBy.lastName)}</button>
      <p className='text-xs pl-2 font-semibold'>{formatDate(item.createdAt)}</p>
      </div>
    </div>
    <div>
    <p className='text-xs xs:text-xs sm:text-sm md:text-base font-semibold pl-10'>{item.comment}</p>
    </div>
    </div>
  )
}


export default CommentCard