import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import Nav from '../../Components/Nav';
function UpdateProfile() {
  let [formdata,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    phone:'',
  })
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  
  function handleChange(e){
    const {name,value} = e.target;
    setFormData({...formdata,[name]:value});
  }
  let userId = localStorage.getItem('userId');

  async function handleSubmit(e){
    e.preventDefault();
    await axiosInstances.put('/update-profile',formdata)
    .then((res)=>{
      if(res.status == 200){
        handleProfile(userId);
        alert("successfully updated the user's profile.")
      }
    })
    .catch((e)=>{
      console.log("failed to update profile axios error: ",e)
    })
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
    <>
    <Nav/>
    <div className="flex justify-center relative top-16">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <h2 className="text-3xl mb-4">Update Profile</h2>
          <input type="text" name="firstName" placeholder="First Name" value={formdata.firstName} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full" required />
          <input type="text" name="lastName" placeholder="Last Name" value={formdata.lastName} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full"/>
          <input type="email" name="email" placeholder="Email Address" value={formdata.email} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full" required />
          <input type="tel" name="phone" placeholder="Mobile Number" value={formdata.phone} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full"/>
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-600">Update</button>
        </div>      
        </form>
    </div>
    </>
    
  )
}

export default UpdateProfile