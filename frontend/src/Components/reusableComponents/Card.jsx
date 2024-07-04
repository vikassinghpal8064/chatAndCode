import React, { useState ,useEffect} from 'react';
import {useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';

function Card({ item }) {
  const [arr, setArr] = useState([]);
  let [pictureLoad,setPictureLoad] = useState(false);
  let [isFriend,setIsFriend] = useState(false);
  let [profile,setProfile] = useState({});
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
 let userId = localStorage.getItem('userId');
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

  
  useEffect(()=>{
    async function getFriendList(userId){
      await axiosInstances.get(`/getAllFriends/${userId}`)
      .then((res)=>{
       const friendId = res.data ? res.data.map(friend => friend._id) : [];
       setIsFriend(friendId.includes(item._id));
       console.log("friend data: ",res.data);
      })
      .catch((e)=>{
        console.log("failed to load friendLIst: ",e);
      })
    }
    if(userId){
      getFriendList(userId);
    }
  },[userId])

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

  async function handleFriend(id){
    await axiosInstances.get(`/friendRequest/${id}`)
    .then((res)=>{
      if(res.data.message == 'success'){
        alert("successfully sent friend request");
      }
    })
    .catch((e)=>{
      if(e.response.data.message === "already a friend"){
        alert("already sent a friend request or he/she is your already friend.")
      }else if(e.response.data.message === "user not found"){
       console.log("user not found");
      }else{
        console.log("error in send friend request: ",e.response);
      }
    })
  }

  return (
    <div className="flex flex-col justify-center items-center xs:py-2 xs:px-1 xs:mb-2 md:mb-3 md:px-2 py-2 px-1 mb-2 bg-white shadow-md xs:shadow-md sm:shadow-lg xs:rounded-md sm:rounded-lg rounded-md" key={item._id}>
      {item.photo && !pictureLoad ?
      (
        <>
        <img src={item.photo} onError={()=>setPictureLoad(true)} className='xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 w-20 h-20 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 w-20 h-20 rounded-full border-black border-2'/>
        </>
      )}
      <h3 className="xs:mt-2 xs:text-sm sm:text-base md:text-lg line-clamp-1 mt-2 text-xs font-semibold">{item.firstName} {item.lastName}</h3>
      <div className='flex xs:gap-1 xs:mt-2 xs:text-xs gap-1 mt-2 justify-center text-xs flex-col sm:flex-row md:text-base'>
          <button onClick={()=>{handleProfile(item._id)}} className="bg-cyan-400 text-white xs:py-1 xs:px-2 py-1 px-2 rounded-md hover:bg-cyan-500 transition duration-300">
            Profile
          </button>
        
        {item._id != userId && (
          <>
          {isFriend ? (
        <button onClick={handleClickChat} className="bg-cyan-400 text-white xs:py-1 xs:px-2 py-1 px-2 rounded-md hover:bg-cyan-500 transition duration-300">
        Message
      </button>
          ):(
            <button className='bg-cyan-400 text-white xs:py-1 xs:px-2 py-1 px-2 rounded-md hover:bg-cyan-500 transition duration-300' onClick={()=>{handleFriend(item._id)}}>Add Friend</button>
          )}
          </>
        )}
      </div>
    </div>
  );
}

export default Card;
