import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function NotifyCard() {
  let [data,setData] = useState([]);
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  async function getData(){
    try {
      let res = await axiosInstances.get(`/user/notification`)
    console.log("response: ",res.data.notification);
    console.log("response data:",res.data);
    if(res.status == 200){
      setData(res.data.notification);
    }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    }
  }
  useEffect(()=>{
    getData();
  },[])

  async function handleAccept(index){
  await axiosInstances.get(`/acceptRequest/${index}`)
  .then((res)=>{
  if(res.data == 'success'){
    alert("Friend request accepted successfully");
    getData();
  }
  })
  .catch((e)=>{
    if(e.response.data.message == 'empty notification'){
      alert("already empty the notification");
    }else{
      console.log("failed to accept friend request: ",e);
    }
  })
  }

  async function handleReject(index){
    await axiosInstances.get(`/rejectRequest/${index}`)
    .then((res)=>{
    if(res.data == 'success'){
      alert("Friend request rejected successfully");
      getData();
    }
    })
    .catch((e)=>{
      if(e.response.data.message == 'empty notification'){
        alert("already empty the notification");
      }else{
        console.log("failed to reject the friend request: ",e);
      }
    })
  }

  async function deleteNotification(index){
    await axiosInstances.delete(`/notification/delete/${index}`)
    .then((res)=>{
      if(res.data.message == "success"){
        alert("Successfully deleted Notification");
        getData();
      }
    })
    .catch((e)=>{
      if(e.response.data.message == "empty notification"){
        alert("already empty notification");
      }else{
        console.log("failed to delete notification: ",e);
      }
    })
  }

  return (
    <>
    <div className='relative top-16 bg-gray-300'>
    {
      data.map((item,index)=>{
        return(
          <div key={item._id} className='bg-gray-300 mt-2 py-2 px-4 rounded-md border-2 relative'>
            <button className='absolute bg-red-100 text-red-900 py-1 px-1 right-2 top-2 rounded-md' onClick={()=>deleteNotification(index)}>&#10060;</button>
            <h2>Name: {item.friend.firstName}</h2>
            <h2>last: {item.friend.lastName}</h2>
            <h2>User: {item.friend.userName}</h2>
            {item.category == 'sendRequest' && (
              <>
            <button className='bg-green-300 text-green-900 rounded-md mt-2 py-2 px-4' onClick={()=>handleAccept(index)}>Accept</button>
            <button className='bg-red-300 text-red-800 rounded-md mt-2 py-2 px-4' onClick={()=>handleReject(index)}>Reject</button>
              </>
            )}
          </div>
        )
      })
    }
    </div>
    </>
  )
}

export default NotifyCard