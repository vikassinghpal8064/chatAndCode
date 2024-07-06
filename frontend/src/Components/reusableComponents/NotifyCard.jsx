import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import Nav from '../Nav';
import NotificationCard from './NotificationCard';

function NotifyCard() {
  let [data,setData] = useState([]);
  let [pictureLoad,setPictureLoad] = useState(false);
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  async function getData(){
    try {
      let res = await axiosInstances.get('/notification')
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

  function handleClick(id){
   navigate(`/ViewProfile/${id}`);
  }

  async function handleAccept(index){
  await axiosInstances.get(`/acceptRequest/${index}`)
  .then((res)=>{
  if(res.data.message == 'success'){
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
    if(res.data.message == 'success'){
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
    console.log("index:",index);
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
    <Nav/>
    <div className='xs:relative xs:top-10 sm:top-12 md:top-14 lg:top-16 bg-gray-100 pt-2 px-1 sm:px-2 w-full items-center flex flex-col overflow-y-auto h-screen xs:h-screen-40 sm:h-screen-48 md:h-screen-56 lg:h-screen-64' style={{scrollbarWidth:'none'}}>
      <h2 className='font-bold text-base my-1 xs:my-2 xs:text-lg sm:text-xl'>Notifications</h2>
      {
        data.map((item,index)=>{
          return(
          <div key={item.details._id} className='w-full sm:w-10/12 md:w-2/3 lg:w-1/2'>
          <NotificationCard item={item}/>
          </div>
        )
      })
    }
    </div>
    </>
  )
}


export default NotifyCard