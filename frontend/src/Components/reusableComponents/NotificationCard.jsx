import React from 'react'

function NotificationCard({item}) {
  return (
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
  )
}

export default NotificationCard