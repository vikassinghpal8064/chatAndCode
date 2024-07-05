import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SetupAxiosInstances from '../../Components/Instances/SetupAxiosInstances';
import Nav from '../../Components/Nav';
function AddEducation() {
  let [formdata,setFormData] = useState({
    school:{
      name:'',
      year:'',
      class:''
    },
    college:{
      name:'',
      year:'',
      major:''
    }
  })
  let [profile , setProfile] = useState({});
  let navigate = useNavigate();
  let userId = localStorage.getItem('userId');
  const axiosInstances = SetupAxiosInstances(navigate);
  function handleChange(e){
    const {name,value} = e.target;
    if(name.startsWith('school.')){
      const schoolField = name.split('.')[1];
      setFormData({...formdata,school:{...formdata.school,[schoolField]:value}});
    }else if(name.startsWith('college.')){
      const collegeField = name.split('.')[1];
      setFormData({...formdata,college:{...formdata.college,[collegeField]:value}});
    }else{
      setFormData({...formdata,[name]:value});
    }
  }
  async function handleSubmit(e){
    e.preventDefault();
    await axiosInstances.post('/add-education',formdata)
    .then((res)=>{
      if(res.status == 201){
        handleProfile(userId);
        alert("successfully added the user's education.")
      }
    })
    .catch((e)=>{
      console.log("failed to added education axios error: ",e)
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
    <div className="flex justify-center mx-auto bg-gray-100 xs:relative xs:top-10 h-screen w-full sm:w-full md:w-11/12 lg:w-4/5 xl:w-3/4 px-2 py-2 xs:h-screen-40 sm:top-12 sm:h-screen-48 md:top-14 md:h-screen-56 lg:top-16 lg:h-screen-64">
      <form onSubmit={handleSubmit}>
        <div className='mt-2 mx-auto py-1 px-2 sm:mt-4 sm:px-3 sm:py-2 font-semibold bg-gray-300 rounded-sm xs:rounded-md flex flex-col text-base w-76 xs:w-96 sm:w-120 md:w-160 lg:w-180 xl:w-200 xs:text-lg sm:text-xl'>
          <h2 className="text-xl xs:text-2xl font-bold mb-2 text-center sm:text-3xl sm:mb-3">Add Education</h2>
          <div className='flex flex-col sm:flex-row sm:gap-2 md:gap-4'>
          <div>
          <h2 className='text-sm font-bold text-center py-1'>School</h2>
          <label htmlFor="schoolname">School Name
          <input type="text" name="school.name" placeholder="School Name" value={formdata.school.name} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='schoolname'/>
          </label>
          <label htmlFor="schoolyear">Year
          <input type="number" name="school.year" placeholder="Year of Passing" value={formdata.school.year} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='schoolyear'/>
          </label>
          <label htmlFor="schoolclass">Class
          <input type="number" name="school.class" placeholder="Higher Schooling" value={formdata.school.class} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='schoolclass' />
          </label>
          </div>
          <div>
          <h2 className='text-center font-bold text-sm py-1'>College</h2>
          <label htmlFor="collegename">College Name
          <input type="text" name="college.name" placeholder="College Name" value={formdata.college.name} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='collegename'/>
          </label>
          <label htmlFor="collegeyear">Year
          <input type="number" name="college.year" placeholder="Year of Graduation" value={formdata.college.year} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='collegeyear'/>
          </label>
          <label htmlFor="collegeclass">Field
          <input type="text" name="college.major" placeholder="Field" value={formdata.college.major} onChange={handleChange} className="rounded-md border-gray-400 border px-2 py-1 mb-1 w-full" id='collegeclass'/>
          </label>
          </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-600 my-2 ">Add Education</button>
        </div>     
        </form>
    </div>
    </>
    
  )
}

export default AddEducation