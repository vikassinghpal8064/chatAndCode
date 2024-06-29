import React, { useEffect ,useState} from 'react'
import { useNavigate ,} from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import FriendCard from '../reusableComponents/FriendCard';
import Nav from '../Nav';
function Friends() {
    const [friendList,setFriendList]=useState([]);

    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);

    useEffect(()=>{
        let userId = localStorage.getItem('userId');
        async function getData(){
        let res = await axiosInstances.get(`/getAllFriends/${userId}`);
        setFriendList([...res.data]);
        console.log("friend data user: ",res.data);
    }
    getData();
    },[])

  return (
    <>
    <Nav/>
    <div className='relative top-16 bg-gray-100 pt-2 w-full flex flex-col items-center overflow-y-auto' style={{height:'calc(100vh - 64px)',scrollbarWidth:'none'}}>
   {friendList.map((item,index)=>{
    return(
        <div key={item._id} className='w-1/2'>
            <FriendCard item={item} />
        </div>
    )
   })}
   </div>
    </>
  )
}

export default Friends