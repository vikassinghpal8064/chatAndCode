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
  
  async function fetchPostData() {
    try{
      let res = await axiosInstances.get("/allPosts");
      if(res.status == '200'){
        setPost(res.data.posts);
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
    fetchPostData();
    handleUser();
  }, [])

  return (
    <>
    <Nav/>
     <div className="w-4/5 flex px-4 py-2 mx-auto h-auto min-h-screen justify-between bg-gray-100 relative top-16">
      <div className="w-2/3 me-10 px-2 h-full">
      <div className="w-full h-14 p-2 flex justify-center bg-white rounded-t-2xl">
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
       
       <div className="bg-white p-2 mt-2 h-auto rounded-b-2xl w-full" style={{minHeight:'calc(100vh - 56px)'}}>
        {post && post.map((item,index)=>{
          return(
            <PostCard key={index} item={item} user={user}/>
          )
        })}
       </div>
      </div>
      <div className="w-1/3 h-full mt-16">
       {obj && obj.map((item,index)=>{
        return(
          <Card key={index} item={item}/>
        )
       })}
      </div>
    </div>
    </>
   
  );
}
export default Home;
