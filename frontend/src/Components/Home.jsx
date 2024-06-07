import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ViewProfile from "./reusableComponents/ViewProfile";
import Card from "./reusableComponents/Card";
import { FaSearch ,FaPlus} from "react-icons/fa";
import SetupAxiosInstances from "./Instances/SetupAxiosInstances";
import PostCard from "./reusableComponents/PostCard";
let message = "hii i am traveling to europe";
// let imageUrl ="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg";
let imageUrl =
  "https://thumbs.dreamstime.com/b/beautiful-landscape-valley-alpine-mountains-small-houses-seefeld-rural-scene-majestic-picturesque-view-40712070.jpg";
function Home() {
  let [obj, setObj] = useState([]);
  let [post, setPost] = useState([]);
  const navigate = useNavigate();
  const axiosInstances = SetupAxiosInstances(navigate);

  async function fetchdata() {
    try{
      let res = await axiosInstances.get("/getAll");
      if(res.status == '200'){
        setObj(res.data);
        console.log(obj);
        console.log("data oj: ",res.data);
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
        console.log(post);
        console.log("data post: ",res.data.posts);
      }
    }catch(err){
    console.log("error in fetch all posts: ",err);
    }
  }

  useEffect(() => {
    fetchdata();
    fetchPostData();
  }, [])

  return (
    <div className="2xl:container flex px-4 py-2 bg-gray-300 h-auto">
      <div className="w-2/3 me-2 px-2 h-full">
       <div className="w-full h-14 p-2 flex justify-center bg-white rounded-t-2xl">
        <div className="rounded-3xl h-10 w-96 relative mr-4 cursor-pointer">
         <button className="left-1 top-1 px-2 absolute py-2"><FaSearch/></button>
         <input type="text" className="outline-0 h-full pl-10 pr-2 py-2 w-full rounded-3xl text-lg font-semibold text-center bg-gray-200" placeholder="search here........."/>
        </div>
        <div className="border-4 border-yellow-600 h-10 w-36 flex items-center rounded-lg cursor-pointer">
         <h2 className="text-2xl px-2"><FaPlus/></h2>
         <h2 className="text-xl font-semibold">Add Post</h2>
        </div>
       </div>
       <div className="bg-white p-2 mt-2 h-96 rounded-b-2xl w-full">
        {post && post.map((item,index)=>{
          return(
            <PostCard key={index} item={item} />
          )
        })}
       </div>
      </div>
      <div className="w-1/3 h-full bg-green-400">
       {obj && obj.map((item,index)=>{
        return(
          <Card key={index} item={item}/>
        )
       })}
      </div>
    </div>
  );
}
export default Home;
