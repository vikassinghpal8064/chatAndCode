import React, { useState } from 'react'
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import { useNavigate } from 'react-router-dom';
import Nav from '../../Components/Nav';

function AddPost() {
  let [form,setForm] = useState({
    title:'',
    upload:'',
    desc:''
  })
  let [profile, setProfile] = useState({});
  let navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);
  let userId = localStorage.getItem('userId');

  function handleChange(e){
    const {name,value} = e.target;
    setForm({...form,[name]:value});
  }
  
  async function handleSubmit(e){
    e.preventDefault();
    await axiosInstances.post('/addPost',form)
    .then((res)=>{
     if(res.status == '201'){
      handleProfile(userId);
      alert("Post added Successfully.")
     }
    })
    .catch((e)=>{
      console.log("failed to add new post axios error: ",e);
    })
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

  return (
    <>
    <Nav/>
     <div className="flex justify-center xs:relative mx-auto xs:top-10 sm:top-12 md:top-14 lg:top-16 sm:h-screen-48 md:h-screen-56 lg:h-screen-64 h-screen xs:h-screen-40 bg-gray-100 px-1 w-full sm:w-10/12 md:w-2/3 lg:w-1/2">
      <form onSubmit={handleSubmit}>
        <div className='mt-2 mx-auto py-1 px-2 sm:mt-4 sm:px-3 sm:py-2 font-semibold bg-gray-300 rounded-sm xs:rounded-md flex flex-col text-base w-76 xs:w-96 xs:text-lg sm:text-xl'>
          <h2 className="text-xl xs:text-2xl font-bold mb-2 text-center sm:text-3xl sm:mb-3">Add Post</h2>
          <label htmlFor="title">Title: 
          <input type="text" name="title" placeholder="Title of the Post" value={form.title} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full" id='title'/>
          </label>
          <label htmlFor="img">Image Url: 
          <input type="text" name="upload" placeholder="Image of the Post" value={form.upload} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full" id='img'/>
          </label>
          <label htmlFor="desc">Description: 
          <input type="text" name="desc" placeholder="Description of the Post" value={form.desc} onChange={handleChange} className="rounded-md border-gray-400 border p-2 mb-2 w-full" id='desc' />
          </label>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 my-2 w-full hover:bg-blue-600">Add Post</button>
        </div>      
        </form>
    </div>
    </>
  )
}

export default AddPost