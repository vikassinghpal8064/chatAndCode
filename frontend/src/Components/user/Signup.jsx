import React, { useState} from "react";
import { useNavigate ,Link} from "react-router-dom";
import {FiEye,FiEyeOff} from 'react-icons/fi';
import SetupAxiosInstances from "../Instances/SetupAxiosInstances";
import Nav from "../Nav";

function Signup() {
  let [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    userName:'',
    email:'',
    password:'',
    phone:'',
  });
 
  let [passwordVisible,setPasswordVisible] = useState(false);
  const togglePassword =()=>{
    setPasswordVisible(!passwordVisible);
  }

  const handleChange = (e) => {
    let {name,value} = e.target;
    setFormData({ ...formData, [name]:value });
  };
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);

  async function handleSubmit(e) {
    e.preventDefault();
   try {
    const res = await axiosInstances.post("/signup", formData);
    if(res.status == '201'){
      navigate('/login');
      alert("user successfully registered");
    }else if(res.data == 'empty field'){
      alert("please fill all required field correctly.");
    }else if(res.data == 'username exist'){
      alert("username not available");
    }else if(res.data == 'email exist'){
      alert("This email address is already registered.");
    }
  } catch (error) {
      console.error("Error in signup fetch data:", error);
  }
  }

  
  return (
    <>
    <Nav/>
    <div className='flex bg-cover items-center justify-around relative top-16' style={{backgroundImage:'url(/Assets/landing.avif)',height:'calc(100vh - 64px)'}}>
      <div className='flex flex-col items-center justify-center'>
        <p className='font-bold text-3xl mb-2'>Hello!</p>
       <p className='font-semibold text-2xl mb-2 text-white'>Do you have a account ?</p>
       <Link to={'/login'} className='mt-2'><button className='bg-blue-500 text-white rounded-md w-72 py-2 px-4 hover:bg-blue-700 font-medium'>Sign in</button></Link>
      </div>
<div className="flex justify-center bg-white p-4 rounded-lg relative w-auto">
      <form onSubmit={handleSubmit}>
        <div className="text-md">
          <h2 className="text-2xl font-bold absolute right-6 top-4 text-gray-500">Chat<sub className="text-gray-300">&</sub>Code</h2>
          <h2 className='mt-4 text-xl font-semibold'>Create an account</h2>
          <h2 className='mb-4 text-md font-medium text-gray-500'>Sign up to Continue</h2>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="first" className="font-medium">Firstname</label>
            </div>
            <div className="col-span-6">
            <input  type="text"  name="firstName"  placeholder="First Name"  onChange={handleChange} id='first'  className="rounded-md border-gray-400 text-center border py-2 px-1 mb-2" required/>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="last" className="font-medium">Lastname</label>
            </div>
            <div className="col-span-6">
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} id='last' className="rounded-md border-gray-400 text-center border py-2 px-1 mb-2"/>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="user" className="font-medium">Username</label>
            </div>
            <div className="col-span-6">
            <input type="text" name="userName" placeholder="User Name" onChange={handleChange} id='user' className="rounded-md border-gray-400 text-center border py-2 px-1 mb-2" required/>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="email" className="font-medium">Email</label>
            </div>
            <div className="col-span-6">
            <input type="email" name="email" id='email' placeholder="Email" onChange={handleChange} className="rounded-md border-gray-400 border py-2 px-1 mb-2 text-center" required/>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="pass" className="font-medium">Password</label>
            </div>
            <div className="col-span-6">
            <div className='relative'>
          <input type={passwordVisible ? 'text':'password'} name="password" placeholder="Password" onChange={handleChange} id='pass' className="rounded-md text-center border-gray-400 border mb-2 py-2 px-1" required/>
          <button type='button' className='absolute mb-2 right-0 rounded-e-md py-2 px-4 inset-y-0 bg-gray-500' onClick={togglePassword}>{passwordVisible ? <FiEye/> :<FiEyeOff/>}</button>
          </div>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-10">
            <div className="col-span-4">
            <label htmlFor="phone" className="font-medium">Mobile</label>
            </div>
            <div className="col-span-6">
            <input type="tel" name="phone" id='phone' placeholder="Phone Number" onChange={handleChange} className="rounded-md border-gray-400 text-center border py-2 px-1 mb-2" required/>
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-700 mb-4 mt-4"> Register </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default Signup;
