import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import Card from '../reusableComponents/Card';
function friend() {
    const [friendList,setFriendList]=useStae([]);

    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        async function getData(){
        let res = await axiosInstances.get('http://localhost:8080/getAllFriends');
        setFriendList([...res.data]);
        }
        getData();
    },[])
  return (
   <>
   {friendList.map((item,index)=>{
    return(
        <Card item={item}></Card>
    )
   })}
   </>
  )
}

export default friend