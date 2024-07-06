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
    <div className='xs:relative xs:top-10 sm:top-12 md:top-14 lg:top-16 bg-gray-100 pt-2 px-1 sm:px-2 w-full items-center flex flex-col overflow-y-auto h-screen xs:h-screen-40 sm:h-screen-48 md:h-screen-56 lg:h-screen-64' style={{scrollbarWidth:'none'}}>
      <h2 className='font-bold text-base my-1 xs:my-2 xs:text-lg sm:text-xl'>Notifications</h2>
      {
        data.map((item,index)=>{
          return(
          <div key={item.details._id} className='w-full sm:w-10/12 md:w-2/3 lg:w-1/2'>
          <div className='bg-gray-200 mb-2 rounded-md border-2 flex w-full'>
            <div className='relative py-4 px-2 w-full'>
            <button className='text-sm absolute bg-red-100 text-red-900 py-1 px-1 right-1 top-1 xs:text-base sm:text-lg rounded-md' onClick={()=>deleteNotification(index)}>&#10060;</button>
             {item.details.category == 'sendRequest' ? (
               <div className='flex pt-3'>
               <div>
            <button onClick={()=>{handleClick(item.sourcePersonInfo._id)}}>
      {item.sourcePersonInfo.photo && !pictureLoad ?
      (
        <>
        <img src={item.sourcePersonInfo.photo} onError={()=>setPictureLoad(true)} className='w-20 h-20 xs:w-24 xs:h-24 border-2 md:w-28 md:h-28 border-black bg-gray-300 rounded-full'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 border-2 border-black bg-gray-300 rounded-full'/>
        </>
      )}
            </button>
               </div>
            <div className='pl-4 flex flex-col justify-center'>
            <h2 className='text-lg xs:text-xl md:text-2xl font-bold text-gray-800'>{item.sourcePersonInfo.firstName} {item.sourcePersonInfo.lastName && (item.sourcePersonInfo.lastName)} <span className='text-base xs:text-lg md:text-xl font-semibold text-gray-500'>{item.details.message}</span></h2>
              <div className='text-sm xs:text-base font-semibold'>
            <button className='bg-green-300 text-green-900 rounded-md md:mt-2 md:py-2 md:px-4 md:mr-4 mt-1 py-1 px-2 mr-2' onClick={()=>handleAccept(index)}>Accept</button>
            <button className='bg-red-300 text-red-800 rounded-md md:mt-2 md:py-2 md:px-4 mt-1 py-1 px-2' onClick={()=>handleReject(index)}>Reject</button>
              </div>
            </div>
               </div>
            ):(
              <div className='flex pt-3'>
                <div>
                  <button onClick={()=>{handleClick(item.targetPersonInfo._id)}}>
                    {item.targetPersonInfo.photo && !pictureLoad ?
                    (
                      <>
                      <img src={item.targetPersonInfo.photo} onError={()=>setPictureLoad(true)} className='w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 border-2 border-black bg-gray-300 rounded-full'/>
                      </>
                    ):(
                      <>
                      <img src="/Assets/profile.png" className='w-20 h-20 xs:w-24 xs:h-24 border-2 border-black bg-gray-300 md:w-28 md:h-28 rounded-full'/>
                      </>
                    )}
                  </button>
                </div>
                <div className='pl-4 flex flex-col justify-center'>
                  <h2 className='text-lg xs:text-xl md:text-2xl font-bold text-gray-800'>{item.targetPersonInfo.firstName} {item.targetPersonInfo.lastName && (item.targetPersonInfo.lastName)} <span className='text-base xs:text-lg md:text-xl font-semibold text-gray-500'>{item.details.message}</span></h2>
                <div>
              </div>
                </div>
              </div>
        )}
            </div>
          </div>
          </div>
        )
      })
    }
    </div>
    </>
  )
}


export default NotifyCard