import React, { useEffect } from 'react'
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import { useNavigate } from 'react-router-dom';
function Check() {
    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        async function getData(){
        let res = await axiosInstances.get('/check');
        if(res.status == 200){
            alert("success");
        }else{
            alert("failure")
        }
        }
        getData();
    },[])
  return (
    <div>Check</div>
  )
} 

export default Check