import React from 'react'
import { useState ,useEffect} from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import SetupAxiosInstances from './Instances/SetupAxiosInstances';
function Nav() {
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [profile ,setProfile] = useState({});
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = Date.now();

    if (token && expirationTime && currentTime < parseInt(expirationTime, 10)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      setIsLoggedIn(false);
    }
  },[])

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');
    navigate("/login");
    setIsLoggedIn(false);
  }
   
  async function handleProfile(id){
    await axiosInstances.get(`/user/${id}`)
    .then((res)=>{
     setProfile(res.data);
     console.log("profile data: ",res.data);
     navigate(`/ViewProfile/${id}`,{state:{profile:res.data}});
    })
    .catch((e)=>{
      console.log("failed to fetch profile: ",e);
    })
  }

    return(
      <div className='flex flex-col xs:flex-row xs:fixed xs:top-0 text-white bg-gray-400 items-start xs:items-center justify-evenly w-full h-40 xs:h-10 sm:h-12 md:h-14 lg:h-16 z-50 text-base sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold pl-7 xs:p-0' style={{overflowX:'hidden'}}>
        <div className='text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>Chat<sub className='text-gray-200'>&</sub>Code</div>
        <Link to={'/'}><div className='w-screen-7 xs:w-auto cursor-pointer'>Home</div></Link>
        {isLoggedIn ? (
          <>
            <div className='w-screen-7 xs:w-auto cursor-pointer' onClick={()=>handleProfile(userId)}>Profile</div>
            <Link to={'/friend-list'}><div className='w-screen-7 xs:w-auto cursor-pointer'>Friends</div></Link>
            <Link to={'/notifications'}><div className='w-screen-7 xs:w-auto cursor-pointer'>Notifications</div></Link>
            <div className='w-screen-7 xs:w-auto cursor-pointer' onClick={handleLogout}>Logout</div>
          </>
          ):(
          <>
            <Link to={'/about'}><div className='w-screen-7 xs:w-auto cursor-pointer'>About</div></Link>
            <Link to={'/signup'}><div className='w-screen-7 xs:w-auto cursor-pointer'>SignUp</div></Link>
            <Link to={'/login'}><div className='w-screen-7 xs:w-auto cursor-pointer'>Login</div></Link>
          </>
        )}
      </div>
      )
}

export default Nav
