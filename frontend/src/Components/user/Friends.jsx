import React, { useEffect ,useState} from 'react'
import { useNavigate ,} from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import Card from '../reusableComponents/Card';
function Friends() {
    const [friendList,setFriendList]=useState([]);

    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        async function getData(){
        let res = await axiosInstances.get('http://localhost:8080/getAllFriends');
        console.log(res);
        setFriendList([...res.data]);
    }
        
    getData();
    },[])
  return (
   <>
   {friendList.map((item,index)=>{
    return(
        <Card item = {item}></Card>
    )
   })}
   </>
  )
}

export default Friends