import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function FriendCard({item}) {
  const [arr, setArr] = useState([]);
  let [pictureLoad,setPictureLoad] = useState(false);
  let [profile,setProfile] = useState({});
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  
  async function handleClickChat() {
    sessionStorage.removeItem("current");
    sessionStorage.removeItem('firstMess');
    sessionStorage.removeItem("friend")
    
    sessionStorage.setItem("current", item._id);
    sessionStorage.setItem("firstMess", true);
    sessionStorage.setItem("friendId",item.friendId);
    //66335c3c34022a389bc50a3d    66335c3c34022a389bc50a3d
    let sourceId = localStorage.getItem('token');
    let targetId = sessionStorage.getItem('current');
    
    try {
      let res = await axiosInstances.get("/user/chat", {
        params: { sourceId, targetId }
      });
      setArr(res.data);
      console.log(res.data);

      // Navigate to the chat route with state after setting the arr
      navigate("/chat", { state: { arr: res.data } });
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  }

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
    <div className="flex gap-4 items-center py-4 px-2 mb-2 sm:mb-4 bg-white shadow-lg rounded-lg" key={item._id}>
      <div className='cursor-pointer' onClick={()=>{handleProfile(item._id)}}>
      {item.photo && !pictureLoad ?
      (
        <>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full border-black border-2 bg-gray-300'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full border-black border-2 bg-gray-300'/>
        </>
      )}
      </div>
      <div className='flex flex-col justify-start text-sm font-bold xs:text-lg sm:text-xl'>
      <h3>Name: <span className='text-gray-500'>{item.firstName} {item.lastName}</span></h3>
      <h3>UserName: <span className='text-gray-500'>{item.userName}</span></h3>
      <h3>Email: <span className='text-gray-500'>{item.email}</span></h3>
      <div className='flex gap-2 mt-2 text-sm font-medium xs:text-base sm:text-lg'>
          <button onClick={()=>{handleProfile(item._id)}} className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
            Profile
          </button>
        <button onClick={handleClickChat} className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
          Message
        </button>
      </div>
      </div>
    </div>
  );
}

export default FriendCard