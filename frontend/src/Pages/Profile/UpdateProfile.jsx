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
  let [profile, setProfile] = useState({});
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
    <div className="flex justify-center xs:relative mx-auto xs:top-10 sm:top-12 md:top-14 lg:top-16 sm:h-screen-48 md:h-screen-56 lg:h-screen-64 h-screen xs:h-screen-40 bg-gray-100 px-1 w-full sm:w-10/12 md:w-2/3 lg:w-1/2">
      <form onSubmit={handleSubmit}>
        <div className='mt-2 mx-auto py-1 px-2 sm:mt-4 sm:px-3 sm:py-2 font-semibold bg-gray-300 rounded-sm xs:rounded-md flex flex-col text-base w-76 xs:w-96 xs:text-lg sm:text-xl'>
          <h2 className="text-xl xs:text-2xl font-bold mb-2 text-center sm:text-3xl sm:mb-3">Update Profile</h2>
          <label htmlFor="firstName" className=''>Firstname</label>
          <input type="text" name="firstName" placeholder="First Name" value={formdata.firstName} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full text-center" required />
          <label htmlFor="lastName">Lastname</label>
          <input type="text" name="lastName" placeholder="Last Name" value={formdata.lastName} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full text-center"/>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Email Address" value={formdata.email} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full text-center" required />
          <label htmlFor="phone">Mobile</label>
          <input type="tel" name="phone" placeholder="Mobile Number" value={formdata.phone} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full text-center"/>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-600 my-2">Update</button>
        </div>      
        </form>
    </div>
    </>
  )
}

export default UpdateProfile