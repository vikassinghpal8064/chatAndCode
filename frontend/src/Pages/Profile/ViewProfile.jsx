import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { SlMenu } from "react-icons/sl";
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import AboutSection from '../../Components/reusableComponents/AboutSection';
import PostSection from '../../Components/reusableComponents/PostSection';
function ViewProfile() {
    const [activeSection,setActiveSection] = useState(null);
    let [pictureLoad,setPictureLoad] = useState(false);
    let [isOpen,setIsOpen] = useState(false);
    let [isFriend,setIsFriend] = useState(false);
    let [obj, setobj]=useState({});
    let id = localStorage.getItem('clickId');
    let userId = localStorage.getItem('userId');
    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        try{
            async function getData(){
                let res = await axiosInstances.get(`/user/${id}`);
                console.log(res);
                setobj(res.data);
                console.log(userId);
                if(obj.friends){
                const friendId = obj.friends ? obj.friends.map(friend => friend._id) : [];
                console.log("current user: ",userId);
                console.log("friendId: ",friendId);
                const isFriendCheck = friendId.includes(userId);
                console.log('Is Friend:', isFriendCheck); // Debugging log
          
                setIsFriend(friendId.includes(userId));
                }else{
                  setIsFriend(false);
                }
            }
           getData();
        }catch(err){
            console.log("error occured in view profile",err);
        }
    },[])

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
    <div className='w-11/12 bg-gray-200 mx-auto h-screen py-2 px-4 flex'>
        <div className='w-2/5 h-full bg-yellow-500 mt-10 rounded-lg mr-10'>

        <div className='w-full flex-col flex h-56 relative'>

        {obj.photo && !pictureLoad ?
      (
        <>
        <img src={obj.photo} onError={()=>setPictureLoad(true)} className='w-full h-48 rounded-md'/>
        </>
      ):(
        <>
        <img src="/Assets/landing.avif" className='w-full h-48 rounded-md'/>
        </>
      )}
        {obj.photo && !pictureLoad ?
      (
        <div className='bg-gray-200 w-24 h-24 rounded-full absolute bottom-0 left-2'>
        <img src={obj.photo} onError={()=>setPictureLoad(true)} className=' w-24 h-24 rounded-full border-black border-2'/>
        </div>
      ):(
        <div className='bg-gray-200 w-24 h-24 rounded-full absolute bottom-0 left-2'>
        <img src="/Assets/profile.png" className=' w-24 h-24 rounded-full border-black border-2'/>
        </div>
      )}
        </div>

        <div className='px-2 w-full flex h-24'>
        <div className='flex flex-col w-2/5 justify-start items-start'>
         <h2 className='text-3xl font-semibold pr-2 line-clamp-1'>{obj.firstName} {obj.lastName && (obj.lastName)}</h2>

         <h2 className='text-md font-medium text-gray-200'>@{obj.userName}</h2>
         <div className='flex justify-start'>
          {obj._id != userId && (
            <>
            {isFriend ? (
              <Link><button className='px-2 py-2 rounded-md bg-green-600 text-green-300'>Message</button></Link>
            ) : (
              <>
              <button className='px-2 py-2 rounded-md bg-green-600 text-green-300'>Add Friend</button>
              </>
            )}
            </>
          )}
        </div>
        </div>

        <div className='w-3/5 group transition-all duration-300 ease-in-out relative flex flex-col justify-start items-end'>
         {obj.education && obj.education.college ? (
          <>
             <h2 className='text-lg font-semibold w-full line-clamp-1 text-right'>{obj.education.college.name}</h2>
             <h3 className='text-md w-full font-medium text-right'>{obj.education.college.major} {obj.education.college.year}</h3>
          </>
         ):(
          <>
          {obj.education && obj.education.school ? (
            <>
            <h2 className='text-lg font-semibold w-full line-clamp-1 text-right'>{obj.education.school.name}</h2>
            <h3 className='text-md font-medium pl-4'>{obj.education.school.class}<sup>th</sup>Standard {obj.education?.school.year}</h3>
            </>
          ):(
            <></>
          )}
          </>
         )}
         <div className='h-0 overflow-hidden group-hover:h-11 transition-all duration-300 ease-in-out'>
          <div className='flex text-md font-semibold'>
          {obj._id == userId && (
          <>
          {obj.education && (obj.education.college || obj.education.school) ? (
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
          <button className='text-xl pb-2 px-4 font-semibold cursor-default'>{obj.posts && (obj.posts.length)} Posts</button>
          <button className='text-xl pb-2 px-4 font-semibold cursor-default'>{obj.friends && (obj.friends.length)} Friends</button>
        </div>
          {obj._id == userId && (
          <div className='w-1/12 relative cursor-pointer' onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
          <SlMenu className='text-xl'/>
          {isOpen && (
        <div className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg z-50">
          <Link to={'/user/update-profile'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Update Profile</Link>
          <Link to={'/user/my-posts'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Chat</Link>
          <Link to={'/addpost'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Add Post</Link>
          <Link to={'/user/notifications'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Notifications</Link>
        </div>
      )}
        </div>
          )}
        </div>
        
        </div>
        <div className='w-3/5 h-full flex relative'>
         <div className=''>
           <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'about' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('about')}>About</button>
           <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'post' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('post')}>Post</button>
         </div>
           {activeSection === 'about' && <AboutSection/>}
           {activeSection === 'post' && <PostSection postSection={obj.posts}/>}
        </div>
    </div>
  );
}

export default ViewProfile;
