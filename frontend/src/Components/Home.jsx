import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "./reusableComponents/Card";
import { FaSearch ,FaPlus} from "react-icons/fa";
import SetupAxiosInstances from "./Instances/SetupAxiosInstances";
import PostCard from "./reusableComponents/PostCard";
import Nav from "./Nav";

function Home() {
  let [obj, setObj] = useState([]);
  let [post, setPost] = useState([]);
  let [totalPages, setTotalPages] = useState(1);
  let [ currentPage,setCurrentPage] = useState(1);
  let [user,setUser] = useState({});
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);

  
  async function fetchdata() {
    try{
      let res = await axiosInstances.get("/getAll");
      if(res.status == 200){
        setObj(res.data);
      }
    }
    catch(err){
      console.log("error in fetch all users: ",err);
    }
  }

  async function fetchPostData(page = 1) {
    try{
      let res = await axiosInstances.get(`/allPosts?page=${page}`);
      if(res.status == '200'){
        setPost(res.data.posts);
        setTotalPages(res.data.totalPages);
      }
    }catch(err){
    console.log("error in fetch all posts: ",err);
    }
  }
  
  async function handleUser(){
    let userId = localStorage.getItem("userId");
    await axiosInstances.get(`/user/${userId}`)
    .then((res)=>{
     setUser(res.data);
    })
    .catch((e)=>{
      console.log("failed to load user: ",e);
    })
  }

  useEffect(() => {
    fetchdata();
    handleUser();
  }, [])

  useEffect(()=>{
    fetchPostData(currentPage);
  },[currentPage]);

  return (
    <>
    <Nav/>
     <div className="w-4/5 flex flex-col px-4 py-2 mx-auto justify-between bg-gray-200 relative top-16" style={{height:'calc(100vh - 64px)'}}>
     <div className="fixed left-38 h-16 z-20 bg-gray-200 flex" style={{minWidth:'calc(80% - 32px)'}}>
      <div className="w-2/3 h-14 mr-12 ml-1 flex justify-center items-center bg-white rounded-2xl">
        <div className="rounded-3xl h-10 w-96 relative mr-4 cursor-pointer">
         <button className="left-1 top-1 px-2 absolute py-2"><FaSearch/></button>
         <input type="text" className="outline-0 h-full pl-10 pr-2 py-2 w-full rounded-3xl text-lg font-semibold text-center bg-gray-200" placeholder="search here........."/>
        </div>
        <Link to={'/addpost'}>
        <div className="border-4 border-yellow-600 h-10 w-36 flex items-center rounded-lg cursor-pointer">
         <h2 className="text-2xl px-2"><FaPlus/></h2>
         <h2 className="text-xl font-semibold">Add Post</h2>
        </div>
        </Link>
      </div>
      <div className="w-1/3 h-14 p-2 flex justify-center items-center text-2xl font-semibold bg-white rounded-2xl">
       Trending Users
      </div>
     </div>
     <div className="w-full flex justify-between relative top-14">
      <div className="w-2/3 me-10 px-2 h-full overflow-y-auto" style={{height:'calc(100vh - 128px)',scrollbarWidth:'none'}}>
      <div className="bg-white p-2 mt-2 mb-4 h-auto rounded-2xl w-full" style={{minHeight:'calc(100vh - 64px)'}}>
        {post && post.map((item,index)=>{
          return(
            <PostCard key={index} item={item} user={user}/>
          )
        })}
        <div className=" w-full h-12 flex justify-center items-center">
         <h2 className="text-2xl font-semibold flex items-center justify-center">Page 
          <ul className="pl-2 gap-2 text-xl flex items-center justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`hover:text-blue-600 hover:underline ${currentPage === index + 1 ? "text-2xl text-blue-600" : "text-gray-500"}`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</li>
          ))}
          </ul>
         </h2>
        </div>
       </div>
      </div>
      <div className="w-1/3 h-full pt-2 overflow-y-auto" style={{height:'calc(100vh - 128px)',scrollbarWidth:'none'}}>
       {obj && obj.map((item,index)=>{
        return(
          <Card key={index} item={item}/>
        )
       })}
      </div>
      </div>
    </div>
    </>
   
  );
}
export default Home;
