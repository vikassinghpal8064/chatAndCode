import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import AboutSection from '../../Components/reusableComponents/AboutSection';
import PostSection from '../../Components/reusableComponents/PostSection';
function ViewProfile() {
    const [activeSection,setActiveSection] = useState(null);
    let [pictureLoad,setPictureLoad] = useState(false);
    let [obj, setobj]=useState({firstName:null,
        lastName:null,
        school:"not mentioned",
        college:"not mentioned"
    });
    let {id}=useParams();
   
    let navigate = useNavigate();
    const axiosInstances = SetupAxiosInstances(navigate);
    useEffect(()=>{
        try{
            async function getData(){
                let res = await axiosInstances.get(`/user/${id}`);
                console.log(res);
                setobj({...obj,...res.data});    
            }
           getData();
        }catch(err){
            console.log("error occured in view profile",err);
        }
    },[])

    const toggleSection = (section)=>{
        setActiveSection(activeSection === section ? null : section)
    }

  return (
    <div className='w-11/12 bg-gray-200 mx-auto h-screen py-2 px-4 flex'>
        <div className='w-2/5 h-full bg-yellow-500 py-2 px-4 mt-10 rounded-lg mr-10'>
        <div className='w-full flex-col flex h-60 relative'>
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
      {/* <h2 className='text-xl font-semibold ml-28 mt-2 text-gray-200'>@{obj.userName}</h2> */}
        </div>
        <div className='flex flex-col justify-center items-center'>
         <h2 className='text-2xl font-semibold'>{obj.firstName} {obj.lastName && (obj.lastName)}</h2>
         <h2 className='text-md font-medium text-gray-200'>@{obj.userName}</h2>
        </div>
        <div className='flex justify-center items-center'>
        <p className='text-xl pr-4 font-semibold'>0 Posts</p>
        <p className='text-xl font-semibold'>0 Friends</p>
        </div>
        <div className='py-2'>
            <button className='bg-green-600 py-2 px-4 rounded-md'>Add Friend</button>
        </div>
        </div>
        <div className='w-3/5 h-full flex relative'>
         <div className=''>
           <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'about' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('about')}>About</button>
           <button className={`font-semibold text-lg py-2 px-4 inline-flex items-center ${activeSection == 'post' ? 'text-blue-500 underline' : 'text-gray-800'}`} onClick={()=>toggleSection('post')}>Post</button>
         </div>
           {activeSection === 'about' && <AboutSection/>}
           {activeSection === 'post' && <PostSection/>}
        </div>
    </div>
  );
}

export default ViewProfile;
