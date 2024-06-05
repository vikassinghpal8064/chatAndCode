import React, { useEffect, useState } from 'react';
import ClickButton from './ClickButton';
import { useNavigate, useParams } from 'react-router-dom';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
function ViewProfile() {
    let [obj, setobj]=useState({firStName:null,
        lastName:null,
        school:"not mentioned",
        college:"not mentioned"
    });
    let id=useParams();
    // console.log(id);
    function handleClick(){
        alert("demo friend added");
    }
    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        try{

            async function getData(){
                let res = await axiosInstances.post(`/user/${id.id}`);
                console.log(res);
                setobj({...obj,...res.data});
               
            }
           getData();
       
        }catch(err){
            console.log("error occured in view profile",err);
        }
        
    },[])
  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-slate-400">
      <img className="w-16 h-16 rounded-full border-2 border-indigo-500" src={obj.photo} alt="Profile Picture" />
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{obj.firstName} {obj.lastName}</h3>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Education Details</h3>
        <h2 className="mt-2 text-gray-600">school</h2>
        <h2 className="mt-2 text-gray-600">college</h2>
        <ClickButton name="Add Friend" handleClick={handleClick}></ClickButton>
      </div>
    </div>
  );
}

export default ViewProfile;
