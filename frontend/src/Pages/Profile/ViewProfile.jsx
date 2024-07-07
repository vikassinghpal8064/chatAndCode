import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,Link ,useLocation} from 'react-router-dom';
import { SlMenu } from "react-icons/sl";
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import AboutSection from '../../Components/reusableComponents/AboutSection';
import PostSection from '../../Components/reusableComponents/PostSection';
import ProfileFriendCard from '../../Components/reusableComponents/ProfileFriendCard';
import Nav from '../../Components/Nav';

function ViewProfile() {
    const [activeSection,setActiveSection] = useState('about');
    const [friendList, setFriendList] = useState([]);
    const location = useLocation();
    const profile = location.state?.profile;
    let [pictureLoad,setPictureLoad] = useState(false);
    let [isOpen,setIsOpen] = useState(false);
    let [isFriend,setIsFriend] = useState(false);
    let profileId = profile._id;
    let userId = localStorage.getItem('userId');

    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    
    
    useEffect(()=>{
      async function getFriendList(profileId){
        await axiosInstances.get(`/getAllFriends/${profileId}`)
        .then((res)=>{
         setFriendList(res.data);
         const friendId = res.data ? res.data.map(friend => friend._id) : [];
         setIsFriend(friendId.includes(userId));
         console.log("friend data: ",res.data);
        })
        .catch((e)=>{
          console.log("failed to load friendLIst: ",e);
        })
      }
      getFriendList(profileId);
      setActiveSection('about');
    },[profileId])

    async function handleDelete(){
      await axiosInstances.delete('/delete-education')
      .then((res)=>{
       if(res.status == 200){
        alert('Successfully deleted the education.')
        navigate('/');
       }
      })
      .catch((e)=>{
        console.log("failed to delete education axios error: ",e)
      })
    }

    async function handleFriend(id){
      await axiosInstances.get(`/friendRequest/${id}`)
      .then((res)=>{
        if(res.data.message == 'success'){
          alert("successfully send friend request");
        }
      })
      .catch((e)=>{
        if(e.response.data.message == "already a friend"){
          alert("already sent a friend request or he/she is your already friend.")
        }else if(e.response.data.message == "user not found"){
         console.log("user not found");
        }else{
          console.log("error in send friend request: ",e);
        }
      })
    }

    const toggleSection = (section)=>{
        setActiveSection(activeSection === section ? null : section)
    }

    const openDropdown = ()=>{
      setIsOpen(true);
    }

    const closeDropdown = ()=>{
      setIsOpen(false);
    }

  return (
  <>
  <Nav/>
  <div className='w-full sm:w-10/12 md:w-full xl:w-11/12 3xl:w-10/12 bg-gray-200 mx-auto py-2 px-1 sm:px-2 flex flex-col md:flex-row xs:relative xs:top-10 sm:top-12 md:top-14 lg:top-16 lg:h-screen-64 md:h-screen-56 sm:h-screen-2x-104 xs:h-screen-2x-128 h-screen-2x-112'>
    <div className='w-full sm:w-11/12 md:w-1/2 lg:w-2/5 h-screen-120 xs:h-screen-104 sm:h-screen-64 md:h-auto bg-yellow-500 md:mt-10 rounded-lg md:mr-2 relative group mx-auto'>
      <div className='w-full flex-col flex h-48 relative'>
        {profile.photo && !pictureLoad ?
      (
        <>
        <img src={profile.photo} onError={()=>setPictureLoad(true)} className='w-full h-40 rounded-md'/>
        </>
         ):(
          <>
          <img src="/Assets/landing.avif" className='w-full h-40 rounded-md'/>
          </>
        )}
          {profile.photo && !pictureLoad ?
        (
          <div className='bg-gray-200 w-24 h-24 rounded-full absolute bottom-0 left-2'>
          <img src={profile.photo} onError={()=>setPictureLoad(true)} className=' w-24 h-24 rounded-full border-black border-2'/>
          </div>
        ):(
          <div className='bg-gray-200 w-24 h-24 rounded-full absolute bottom-0 left-2'>
        <img src="/Assets/profile.png" className=' w-24 h-24 rounded-full border-black border-2'/>
        </div>
      )}
      </div>
      <div className='px-2 w-full flex justify-between h-28'>
        <div className='flex flex-col items-start'>
         <h2 className='text-base sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold line-clamp-1 group-hover:line-clamp-none'>{profile.firstName} {profile.lastName && (profile.lastName)}</h2>
         <h2 className='text-xs sm:text-lg md:text-base xl:text-lg font-semibold text-gray-200'>@{profile.userName}</h2>
         <div className='flex mt-1 sm:mt-0 text-xs sm:text-lg md:text-base lg:text-lg xl:text-xl'>
          {profile._id != userId && (
            <>
            {isFriend ? (
              <Link><button className='px-2 py-2 rounded-md bg-green-600 text-green-300'>Message</button></Link>
            ) : (
              <>
              <button className='px-2 py-2 rounded-md bg-green-600 text-green-300' onClick={()=>{handleFriend(profile._id)}}>Add Friend</button>
              </>
            )}
            </>
          )}
           </div>
        </div>

        <div className='flex flex-col items-end'>
         {profile.education && profile.education.college.name !== "" ? (
          <>
             <h2 className='text-sm xs:text-base sm:text-lg md:text-base xl:text-lg font-bold w-full line-clamp-1 group-hover:line-clamp-none text-right'>{profile.education.college.name}</h2>
             <h3 className='text-xs xs:text-sm sm:text-base md:text-sm xl:text-base w-full font-semibold line-clamp-1 group-hover:line-clamp-none text-right'>{profile.education.college.major} {profile.education.college.year}</h3>
          </>
         ):(
          <>
          {profile.education && profile.education.school ? (
            <>
            <h2 className='text-sm xs:text-base sm:text-lg md:text-base xl:text-lg font-bold w-full line-clamp-1 group-hover:line-clamp-none text-right'>{profile.education.school.name}</h2>
            <h3 className='text-xs xs:text-sm sm:text-base md:text-sm xl:text-base font-semibold line-clamp-1 group-hover:line-clamp-none text-right'>{profile.education.school.class}<sup>th</sup>Standard {profile.education?.school.year}</h3>
            </>
          ):(
            <></>
          )}
          </>
         )}

          <div className='h-11 overflow-hidden'>
          <div className='flex text-xs xs:text-sm sm:text-base md:text-sm xl:text-base font-bold'>
          {profile._id == userId && (
          <>
          {profile.education && (profile.education.college.name !== "" || profile.education.school.name !== "") ? (
            <>
            <Link to={'/user/update-education'}><button className='py-2 px-2 mr-2 text-green-300 rounded-md bg-green-600'>Update</button></Link>
            <button className='bg-red-800 text-red-400 py-2 px-2 rounded-md' onClick={handleDelete}>Delete</button>
            </>
          ):(
            <>
            <Link to={'/user/add-education'}><button className='py-2 px-2 rounded-md text-green-300 bg-green-600'>Add Education</button></Link>
            </>
          )}
          </>
           )}
           </div>
          </div>
        </div>
      </div>
      <div className='w-full pt-2 pb-1 h-10 justify-between flex'>
         <div className='flex items-center font-bold text-xl lg:text-2xl'>
           <button className='px-2 cursor-default'>{profile.posts && (profile.posts.length)} Posts</button>
           <button className='px-2 cursor-default'>{profile.friends && (profile.friends.length)} Friends</button>
         </div>
           {profile._id == userId && (
           <div className='relative px-2 cursor-pointer' onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
           <SlMenu className='text-xl lg:text-2xl font-bold'/>
           {isOpen && (
             <div className="absolute right-7 top-0 w-40 xl:w-44 2xl:w-48 text-base xl:text-lg 2xl:text-xl font-semibold bg-white border rounded-lg shadow-lg z-20">
             <Link to={'/user/update-profile'} className="block px-2 py-2 text-gray-800 hover:bg-gray-200">Update Profile</Link>
             <Link to={'/user/update-education'} className="block px-2 py-2 text-gray-800 hover:bg-gray-200">Update Education</Link>
             <Link to={'/addpost'} className="block px-2 py-2 text-gray-800 hover:bg-gray-200">Add Post</Link>
             <Link to={'/notifications'} className="block px-2 py-2 text-gray-800 hover:bg-gray-200">Notifications</Link>
           </div>
         )}
           </div>
             )}
      </div>
      <div className='text-lg lg:text-xl font-bold h-8 w-full text-center text-gray-700'>Friend List</div>  
      <div className='w-full h-screen-504 xs:h-screen-488 sm:h-screen-448 md:h-screen-496 lg:h-screen-504 px-2 pt-2 pb-4 overflow-y-auto flex flex-wrap' style={{scrollbarWidth:'none'}}>
        {friendList && friendList.map((item,index)=>{
          return(
            <div className='w-1/2 xs:w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/2 2xl:w-1/3' key={item._id}>
              <ProfileFriendCard item={item}/>
            </div>
          )
        })}
      </div>
    </div>
    <div className='w-full sm:w-11/12 md:w-1/2 lg:w-3/5 flex relative lg:h-screen-120 md:h-screen-112 sm:h-screen-96 xs:h-screen-88 h-screen-48 mx-auto'>
       <div className='text-lg xs:text-xl md:text-lg lg:text-xl xl:text-2xl py-1 xs:py-2 xl:py-1'>
         <button className={`font-bold px-4 inline-flex items-center ${activeSection == 'about' ?'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('about')}>About</button>
         <button className={`font-bold px-4 inline-flex items-center ${activeSection == 'post' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('post')}>Post</button>
       </div>
         {activeSection === 'about' && <AboutSection/>}
         {activeSection === 'post' && <PostSection postSection={profile.posts}/>}
    </div>
  </div>
</>
);
}

export default ViewProfile;
