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
    <div className='xs:relative xs:top-10 sm:top-12 md:top-14 lg:top-16 bg-gray-100 pt-2 px-1 sm:px-2 w-full flex flex-col items-center overflow-y-auto h-screen xs:h-screen-40 sm:h-screen-48 md:h-screen-56 lg:h-screen-64' style={{scrollbarWidth:'none'}}>
      <h2 className='font-bold text-base my-1 xs:my-2 xs:text-lg sm:text-xl'>My Friend List</h2>
   {friendList.map((item,index)=>{
    return(
        <div key={item._id} className='w-full md:w-4/5 lg:w-1/2'>
            <FriendCard item={item} />
        </div>
    )
   })}
   </div>
    </>
  )
}

export default Friends