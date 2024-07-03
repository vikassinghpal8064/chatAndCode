import React, { useState } from 'react';
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import { useNavigate ,Link} from 'react-router-dom';
import { FiEye,FiEyeOff } from 'react-icons/fi';
import Nav from '../Nav';

function Login() {
  const [formData,setFormData] = useState({
   userName:'',
   password:''
  });

  let [passwordVisible,setPasswordVisible] = useState(false);
  const togglePassword =()=>{
    setPasswordVisible(!passwordVisible);
  }

  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);

  const handleChange = (e) => {
    let {name,value} = e.target;
    setFormData({ ...formData, [name]:value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axiosInstances.post("/login", formData);
      if(res.data.message == "success" ){
        const token = res.data.uid;
        const userId = res.data.userId;
        localStorage.setItem("token",token);
        localStorage.setItem("userId",userId);
        const expirationTime = Date.now() + 3*60*60*1000;
        localStorage.setItem('expirationTime',expirationTime);
        setTimeout(()=>{
         localStorage.removeItem('token');
         localStorage.removeItem('expirationTime');
         localStorage.removeItem('userId');
         alert("your session expired, need to login again");
         navigate('/');
        },3*60*60*1000);
        alert("successfully login");
        navigate('/');
      }
    } catch (error) {
      if(error.message == 'incorrect password or username'){
        alert("incorrect username or password, Please enter credentials correctly.")
      }else if(error.message == "user not found"){
       alert("this user does not exist.")
      }else if(error.message == "username and password are required"){
     alert("Please fill all required field.")
      }else{
        console.log("error in fetch login: ",error);
      }
    }
  }

  return (
    <>
    <Nav/>
    <div className='flex bg-cover items-center justify-around relative top-16' style={{backgroundImage:'url(/Assets/landing.avif)',height:'calc(100vh - 64px)'}}>
      <div className='flex flex-col items-center justify-center'>
        <p className='font-bold text-3xl mb-2'>Hello!</p>
       <p className='font-semibold text-2xl mb-2 text-white'>Don't have a account ?</p>
       <Link to={'/signup'} className='mt-2'><button className='bg-blue-500 text-white rounded-md w-72 py-2 px-4 hover:bg-blue-700 font-medium'>Sign up</button></Link>
      </div>
<div className="flex justify-center bg-white p-4 rounded-lg relative w-auto">
      <form onSubmit={handleSubmit}>
        <div className="text-md">
          <h2 className="text-2xl font-bold absolute right-6 top-4 text-gray-500">Chat<sub className='text-gray-300'>&</sub>Code</h2>
          <h2 className='mt-4 text-xl font-semibold'>Welcome Back !!</h2>
          <h2 className='mb-4 text-md font-medium text-gray-500'>Sign in to Continue</h2>
            <label htmlFor="first" className="font-medium">Username</label>
            <br />
            <input  type="text"  name="userName"  placeholder="User Name"  onChange={handleChange} id='first'  className="rounded-md text-center border-gray-400 border py-2 px-1 mb-2 w-96" required/>
            <br />
            <label htmlFor="pass" className="font-medium">Password</label>
           <br />
          <div className='relative'>
          <input type={passwordVisible ? 'text':'password'} name="password" placeholder="Password" onChange={handleChange} id='pass' className="rounded-md text-center border-gray-400 border mb-2 py-2 px-1 w-96" required/>
          <button type='button' className='absolute mb-2 right-0 rounded-e-md py-2 px-4 inset-y-0 bg-gray-500' onClick={togglePassword}>{passwordVisible ? <FiEye/> :<FiEyeOff/>}</button>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-700 mb-4 mt-4">Sign in</button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default Login;
