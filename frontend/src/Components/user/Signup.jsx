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
    <div className='flex bg-cover items-center justify-around xs:relative xs:top-10 h-screen-160 xs:h-screen-40 sm:top-12 sm:h-screen-48 md:top-14 md:h-screen-56 lg:top-16 lg:h-screen-64' style={{backgroundImage:'url(/Assets/landing.avif)'}}>
      <div className='xs:flex flex-col items-center justify-center hidden'>
        <p className='font-bold text-lg sm:text-xl md:text-3xl mb-1 md:mb-2'>Hello!</p>
       <p className='font-semibold text-base sm:text-lg md:text-2xl mb-1 md:mb-2 text-white'>Do you have a account ?</p>
       <Link to={'/login'} className='mt-2'><button className='bg-blue-500 text-white rounded-sm w-40 sm:rounded-md md:w-72 py-1 md:py-2 px-4 hover:bg-blue-700 font-medium sm:w-56 text-base sm:text-lg md:text-xl lg:w-88'>Sign in</button></Link>
      </div>
      <div className="flex flex-col justify-center bg-white p-2 md:py-4 md:px-3 rounded-md md:rounded-lg relative w-76 xs:w-60 sm:w-76 md:w-88 lg:w-96">
      <form onSubmit={handleSubmit}>
        <div className="text-sm sm:text-base md:text-lg">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold absolute top-2 right-2 md:right-4 md:top-4 text-gray-500">Chat<sub className="text-gray-300">&</sub>Code</h2>
          <h2 className='md:mt-4 text-base sm:text-lg md:text-xl font-semibold'>Create an account</h2>
          <h2 className='mb-2 md:mb-4 font-medium text-gray-500'>Sign up to Continue</h2>
          <div className="w-72 flex xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="first" className="font-medium">Firstname</label>
            </div>
            <div className="pl-4 xs:pl-0 md:pl-2">
            <input  type="text"  name="firstName"  placeholder="First Name"  onChange={handleChange} id='first'  className="rounded-sm sm:rounded-md border-gray-400 text-center border w-52 mb-1 py-1 md:py-2 px-1 xs:w-56 sm:w-72 md:w-60 lg:w-68" required/>
            </div>
          </div>
          <div className="flex w-72 xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="last" className="font-medium">Lastname</label>
            </div>
            <div className="pl-5 xs:pl-0 md:pl-3">
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} id='last' className="rounded-sm mb-1 py-1 w-52 sm:rounded-md border-gray-400 text-center border md:py-2 px-1 xs:w-56 sm:w-72 md:w-60 lg:w-68"/>
            </div>
          </div>
          <div className="flex w-72 xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="user" className="font-medium">Username</label>
            </div>
            <div className="pl-4 xs:pl-0 md:pl-2">
            <input type="text" name="userName" placeholder="User Name" onChange={handleChange} id='user' className="rounded-sm mb-1 w-52 py-1 sm:rounded-md border-gray-400 text-center border md:py-2 px-1 xs:w-56 sm:w-72 md:w-60 lg:w-68" required/>
            </div>
          </div>
          <div className="flex w-72 xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="email" className="font-medium">Email</label>
            </div>
            <div className="pl-11 xs:pl-0 md:pl-11">
            <input type="email" name="email" id='email' placeholder="Email" onChange={handleChange} className="mb-1 py-1 w-52 rounded-sm sm:rounded-md border-gray-400 border md:py-2 px-1 text-center xs:w-56 sm:w-72 md:w-60 lg:w-68" required/>
            </div>
          </div>
          <div className="flex w-72 xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="pass" className="font-medium">Password</label>
            </div>
            <div className="pl-5 xs:pl-0 md:pl-3">
            <div className='relative'>
          <input type={passwordVisible ? 'text':'password'} name="password" placeholder="Password" onChange={handleChange} id='pass' className="mb-1 py-1 w-52 rounded-sm sm:rounded-md border-gray-400 border md:py-2 px-1 text-center xs:w-56 sm:w-72 md:w-60 lg:w-68" required/>
          <button type='button' className='absolute mb-1 right-0 rounded-e-sm sm:rounded-e-md py-2 px-4 inset-y-0 bg-gray-500' onClick={togglePassword}>{passwordVisible ? <FiEye/> :<FiEyeOff/>}</button>
          </div>
            </div>
          </div>
          <div className="flex w-72 xs:flex-col xs:w-56 sm:w-72 md:flex-row md:w-80 lg:w-88">
            <div>
            <label htmlFor="phone" className="font-medium">Mobile</label>
            </div>
            <div className="pl-9 xs:pl-0 md:pl-7">
            <input type="tel" name="phone" id='phone' placeholder="Phone Number" onChange={handleChange} className="mb-1 py-1 w-52 rounded-sm sm:rounded-md border-gray-400 border md:py-2 px-1 text-center xs:w-56 sm:w-72 md:w-60 lg:w-68" required/>
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-sm sm:rounded-md px-4 py-2 w-full hover:bg-blue-700 my-2 md:mb-4 md:mt-4"> Register </button>
        </div>
      </form>
      <div className="xs:hidden text-sm text-center">
        <p>Do you have a account ?<Link to={'/login'}><span className="text-blue-500 hoer:text-blue-700 hover:underline text-base"> Sign in</span></Link></p>
      </div>
      </div>
    </div>
    </>
  );
}

export default Signup;
