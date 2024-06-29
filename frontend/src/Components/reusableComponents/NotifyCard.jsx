import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import Nav from '../Nav';

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
    <div className='bg-gray-100 h-screen'>
    <div className='relative top-16 bg-gray-100 py-2 w-full justify-center flex overflow-y-auto' style={{maxHeight:'calc(100vh - 64px)',scrollbarWidth:'none'}}>
      <div className='w-1/2'>
      {
      data.map((item,index)=>{
        return(
          <div key={item.details._id} className='bg-gray-200 mb-2 py-2 px-4 rounded-md border-2 relative flex'>
            <button className='absolute bg-red-100 text-red-900 py-1 px-1 right-2 top-2 rounded-md' onClick={()=>deleteNotification(index)}>&#10060;</button>
             {item.details.category == 'sendRequest' ? (
               <div className='flex'>
               <div>
            <button onClick={()=>{handleClick(item.sourcePersonInfo._id)}}>
      {item.sourcePersonInfo.photo && !pictureLoad ?
      (
        <>
        <img src={item.sourcePersonInfo.photo} onError={()=>setPictureLoad(true)} className='w-24 h-24 border-2 border-black bg-gray-300 rounded-full'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-24 h-24 border-2 border-black bg-gray-300 rounded-full'/>
        </>
      )}
            </button>
               </div>
            <div className='pl-4 flex flex-col justify-center'>
            <h2 className='text-2xl font-bold text-gray-800'>{item.sourcePersonInfo.firstName} {item.sourcePersonInfo.lastName && (item.sourcePersonInfo.lastName)} <span className='text-xl font-semibold text-gray-500'>{item.details.message}</span></h2>
              <div>
            <button className='bg-green-300 text-green-900 rounded-md mt-2 py-2 px-4 mr-4' onClick={()=>handleAccept(index)}>Accept</button>
            <button className='bg-red-300 text-red-800 rounded-md mt-2 py-2 px-4' onClick={()=>handleReject(index)}>Reject</button>
              </div>
            </div>
            </div>
            ):(
              <div className='flex'>
                <div>
                  <button onClick={()=>{handleClick(item.targetPersonInfo._id)}}>
                    {item.targetPersonInfo.photo && !pictureLoad ?
                    (
                      <>
                      <img src={item.targetPersonInfo.photo} onError={()=>setPictureLoad(true)} className='w-24 h-24 border-2 border-black bg-gray-300 rounded-full'/>
                      </>
                    ):(
                      <>
                      <img src="/Assets/profile.png" className='w-24 h-24 border-2 border-black bg-gray-300 rounded-full'/>
                      </>
                    )}
                  </button>
                </div>
                <div className='pl-4 flex flex-col justify-center'>
                  <h2 className='text-2xl font-bold text-gray-800'>{item.targetPersonInfo.firstName} {item.targetPersonInfo.lastName && (item.targetPersonInfo.lastName)} <span className='text-xl font-semibold text-gray-500'>{item.details.message}</span></h2>
                <div>
              </div>
                </div>
          </div>
        )}
      </div>
        )
      })
    }
      </div>
    </div>
    </div>
    </>
  )
}

export default NotifyCard