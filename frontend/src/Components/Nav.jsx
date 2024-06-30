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
     navigate(`/ViewProfile/${id}`,{state:{profile:res.data}});
    })
    .catch((e)=>{
      console.log("failed to fetch profile: ",e);
    })
  }

    return(
        <div className='bg-gray-400 h-16 flex justify-evenly items-center fixed w-full z-50 text-xl font-bold text-white top-0'>
        <div><h2 className='text-2xl text-gray-500'>Chat<sub className='text-gray-200'>&</sub>Code</h2></div>
        <Link to={'/'}><div>Home</div></Link>
        {isLoggedIn ? (
          <>
          <div onClick={()=>handleProfile(userId)}>Profile</div>
          <Link to={'/friend-list'}><div>Friends</div></Link>
          <Link to={'/notifications'}><div>Notification</div></Link>
          <div onClick={handleLogout}>Logout</div>
          </>
        ):(
          <>
          <Link><div>About</div></Link>
          <Link to={'/signup'}><div>SignUp</div></Link>
          <Link to={'/login'}><div>Login</div></Link>
          </>
        )}
      </div>
      )
}

export default Nav
