import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,Link ,useLocation} from 'react-router-dom';
import { SlMenu } from "react-icons/sl";
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import AboutSection from '../../Components/reusableComponents/AboutSection';
import PostSection from '../../Components/reusableComponents/PostSection';
import ProfileFriendCard from '../../Components/reusableComponents/ProfileFriendCard';
import Nav from '../../Components/Nav';

function ViewProfile() {
    const [activeSection,setActiveSection] = useState(null);
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
    },[profileId])

    async function handleDelete(){
      await axiosInstances.delete('/delete-education')
      .then((res)=>{
       if(res.status == 200){
        alert('Successfully deleted the education.')
        setData(res.data)
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
    <div className='lg:w-full bg-gray-200 mx-auto py-2 lg:px-2 flex xs:relative lg:top-16 lg:h-screen-64'>
      <div className='w-2/5 h-auto bg-yellow-500 mt-10 rounded-lg lg:mr-2 relative group'>
        <div className='w-full flex-col flex h-56 relative'>
        {profile.photo && !pictureLoad ?
      (
        <>
        <img src={profile.photo} onError={()=>setPictureLoad(true)} className='w-full h-48 rounded-md'/>
        </>
         ):(
          <>
          <img src="/Assets/landing.avif" className='w-full h-48 rounded-md'/>
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





        <div className='px-2 w-full flex h-24'>
        <div className='flex flex-col w-2/5 justify-start items-start'>
         <h2 className='text-2xl font-semibold pr-2 line-clamp-1 group-hover:line-clamp-none'>{profile.firstName} {profile.lastName && (profile.lastName)}</h2>
         <h2 className='text-md font-medium text-gray-200'>@{profile.userName}</h2>
         <div className='flex justify-start'>
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
        <div className='w-3/5 flex flex-col justify-start items-end'>
         {profile.education && profile.education.college ? (
          <>
             <h2 className='text-lg font-semibold w-full line-clamp-1 text-right'>{profile.education.college.name}</h2>
             <h3 className='text-md w-full font-medium text-right'>{profile.education.college.major} {profile.education.college.year}</h3>
          </>
         ):(
          <>
          {profile.education && profile.education.school ? (
            <>
            <h2 className='text-lg font-semibold w-full line-clamp-1 text-right'>{profile.education.school.name}</h2>
            <h3 className='text-md font-medium pl-4'>{profile.education.school.class}<sup>th</sup>Standard {profile.education?.school.year}</h3>
            </>
          ):(
            <></>
          )}
          </>
         )}
           <div className='h-11 overflow-hidden'>
          <div className='flex text-md font-semibold'>
          {profile._id == userId && (
          <>
          {profile.education && (profile.education.college || profile.education.school) ? (
            <>
            <Link to={'/user/update-education'}><button className='py-2 px-2 mr-2 text-green-300 rounded-md bg-green-600'>Update</button></Link>
            <button className='bg-red-800 text-red-400 py-2 px-2 rounded-md' onClick={handleDelete}>Delete</button>
            </>
          ):(
            <>
            <Link to={'/user/add-education'}><button className='py-2 px-2 rounded-md bg-green-600'>Add Education</button></Link>
            </>
          )}
          </>
           )}
           </div>
          </div>
         </div>
         </div>
         <div className='w-full pt-2 px-2 justify-between flex'>
         <div className='flex items-center justify-start w-11/12'>
           <button className='text-xl pb-2 px-4 font-semibold cursor-default'>{profile.posts && (profile.posts.length)} Posts</button>
           <button className='text-xl pb-2 px-4 font-semibold cursor-default'>{profile.friends && (profile.friends.length)} Friends</button>
         </div>
           {profile._id == userId && (
           <div className='w-1/12 relative cursor-pointer' onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
           <SlMenu className='text-xl'/>
           {isOpen && (
             <div className="absolute right-7 -top-3 w-48 bg-white border rounded-lg shadow-lg z-20">
             <Link to={'/user/update-profile'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Update Profile</Link>
             <Link to={'/user/update-education'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Update Education</Link>
             <Link to={'/addpost'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Add Post</Link>
             <Link to={'/notifications'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Notifications</Link>
           </div>
         )}
           </div>
             )}
           </div>
           <div className='w-full h-44 px-2 py-2 overflow-y-auto flex flex-wrap' style={{scrollbarWidth:'none'}}>
           {friendList && friendList.map((item,index)=>{
             return(
               <div className='w-1/2' key={item._id}>
               <ProfileFriendCard item={item} key={item._id} />
               </div>
                   )
                  })}
                  </div>
      </div>











      <div className='w-3/5 flex xs:relative lg:h-screen-120'>
       <div>
         <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'about' ?'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('about')}>About</button>
         <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'post' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('post')}>Post</button>
       </div>
         {activeSection === 'about' && <AboutSection/>}
         {activeSection === 'post' && <PostSection postSection={profile.posts}/>}
      </div>
    </div>
   </>
  );
}

export default ViewProfile;
