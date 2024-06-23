import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
function ProfileFriendCard({item}) {
  let [pictureLoad,setPictureLoad] = useState(false);

  return (
    <div className='h-20 px-2 py-2 mx-1 mb-1 flex' style={{width:'calc(100% - 8px)'}}>
      <Link to={`/ViewProfile/${item._id}`}>
      <button onClick={handleClick}>
      {item.photo && !pictureLoad ?
      (
        <>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='h-full border-2 border-black rounded-full bg-gray-300'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='h-full border-2 border-black rounded-full bg-gray-300'/>
        </>
      )}
      </button>
      </Link>
      <div className='flex items-center pl-1'>
    <Link><button onClick={handleClick} className='text-md font-bold hover:text-blue-800 hover:underline'>{item.firstName} {item.lastName && (item.lastName)}</button></Link>
     </div>
    </div>
  )
}

export default ProfileFriendCard