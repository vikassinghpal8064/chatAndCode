import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function Card({ item }) {
  const [arr, setArr] = useState([]);
  let [pictureLoad,setPictureLoad] = useState(false);
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  console.log(item);
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

  return (
    <div className="flex flex-col justify-center items-center py-4 px-2 mb-4 bg-white shadow-lg rounded-lg" key={item.friendId}>
      {item.photo && !pictureLoad ?
      (
        <>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='w-32 h-32 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-32 h-32 rounded-full border-black border-2'/>
        </>
      )}
      <h3 className="mt-4 text-xl font-semibold">{item.firstName} {item.lastName}</h3>
      <div className='flex gap-2 mt-4 justify-center text-sm'>
        <Link to={`/ViewProfile/${item._id}`}>
          <button className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
            Check Profile
          </button>
        </Link>
        <button onClick={handleClickChat} className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
          Chat
        </button>
        <button className='bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300'>Add Friend</button>
      </div>
    </div>
  );
}

export default Card;
