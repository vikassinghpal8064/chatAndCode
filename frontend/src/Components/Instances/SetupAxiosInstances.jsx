import axios from "axios"

const SetupAxiosInstances = (navigate)=> {
  const axiosInstances = axios.create(
    {
      baseURL : import.meta.env.VITE_BACKEND_API
    })

  axiosInstances.interceptors.request.use(
    (config)=>{
      const token = localStorage.getItem('token');
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
  )
  
  axiosInstances.interceptors.response.use(
    (response)=>{
     return response;
    },
    (error)=>{
      if(error.response.status == 401 || error.response.status == 403){
        navigate('/auth/login')
      }
      return Promise.reject(error);
    }
  )
  return axiosInstances
}

export default SetupAxiosInstances