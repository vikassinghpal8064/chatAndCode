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
    <div className='flex flex-col xs:flex-row bg-cover items-center justify-around xs:relative xs:top-10 h-screen-160 xs:h-screen-40' style={{backgroundImage:'url(/Assets/landing.avif)',overflowX:'hidden'}}>
    <div className='flex flex-col items-center justify-center'>
        <p className='font-bold text-lg sm:text-xl md:text-3xl mb-1 md:mb-2'>Hello!</p>
       <p className='font-semibold text-base md:text-2xl mb-1 md:mb-2 sm:text-lg text-white'>Don't have a account ?</p>
       <Link to={'/signup'} className='mt-1 md:mt-2'><button className='bg-blue-500 text-base text-white rounded-md w-52 py-1 md:py-2 px-4 hover:bg-blue-700 font-medium xs:w-40 sm:w-52 sm:text-lg md:w-72 md:text-xl'>Sign up</button></Link>
    </div>
    <div className="flex flex-col justify-center bg-white p-2 md:p-4 rounded-lg relative w-76 xs:w-60 sm:w-76 md:w-96">
      <form onSubmit={handleSubmit}>
        <div className='text-base sm:text-lg md:text-xl'>
          <h2 className="text-base sm:text-lg md:text-2xl font-bold absolute top-1 right-2 md:right-4 md:top-4 text-gray-500">Chat<sub className='text-gray-300'>&</sub>Code</h2>
          <h2 className='md:mt-4 text-base sm:text-lg md:text-xl font-semibold'>Welcome Back !!</h2>
          <h2 className='mb-2 md:mb-4 text-xs sm:text-sm md:text-md font-medium text-gray-500'>Sign in to Continue</h2>
            <label htmlFor="first" className="font-medium">Username</label>
            <input  type="text"  name="userName"  placeholder="User Name"  onChange={handleChange} id='first'  className="rounded-sm py-1 xs:rounded-md text-center border-gray-400 border md:py-2 px-1 mb-1 md:mb-2 w-48 xs:w-56 ml-3 xs:block xs:ml-0 sm:w-72 md:w-88" required/>
            <label htmlFor="pass" className="font-medium">Password</label>
          <div className='relative inline pl-4 xs:pl-0 xs:block'>
          <input type={passwordVisible ? 'text':'password'} name="password" placeholder="Password" onChange={handleChange} id='pass' className="rounded-sm xs:rounded-md py-1 text-center border-gray-400 border mb-1 md:mb-2 md:py-2 px-1 w-48 xs:w-56 sm:w-72 md:w-88" required/>
          <button type='button' className='absolute mb-1 md:mb-2 right-0 rounded-e-sm xs:rounded-e-md py-2 px-4 bg-gray-500 xs:inset-y-0' onClick={togglePassword}>{passwordVisible ? <FiEye/> :<FiEyeOff/>}</button>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 md:py-2 w-72 xs:w-56 hover:bg-blue-700  mt-2 mb-1 md:mb-4 md:mt-4 sm:w-72 sm:mb-2 md:w-full">Sign in</button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default Login;
