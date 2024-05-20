import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ViewProfile from "./reusableComponents/ViewProfile";
import Card from "./reusableComponents/Card";
let message = "hii i am traveling to europe";
// let imageUrl ="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg";
let imageUrl =
  "https://thumbs.dreamstime.com/b/beautiful-landscape-valley-alpine-mountains-small-houses-seefeld-rural-scene-majestic-picturesque-view-40712070.jpg";
function Home() {
  let [obj, setObj] = useState([]);
  let [post, setPost] = useState([]);
  console.log(obj);
  useEffect(() => {
    async function fetchdata() {
      let data = await axios.get("http://localhost:8080/getAll");
      console.log(data);
      setObj([...obj, ...data.data]);
      console.log(obj);
    }
    fetchdata();
  }, []);
  useEffect(() => {
    try{

      async function fetchPostData() {
        let data = await axios.get("http://localhost:8080/allUsers");
        console.log(data);
        setPost([...post, ...data.data]);
        console.log(post);
      }
      fetchPostData();
    }catch(err){
      console.log({"error":err});
    }
  }, []);
   function handleChat(){
    
   }
  return (
    <div className="flex justify-evenly">
      <div className="bg-yellow-400 rounded-md h-auto w-2/4 mt-10 overflow-y-auto flex flex-col">
        <div className=" ml-24 mt-10 max-w-sm rounded overflow-hidden shadow-lg bg-green-200 mb-4">
          <img src={imageUrl} alt="Card" className="w-full" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Message</div>
            <p className="text-gray-700 text-base">{message}</p>
          </div>
        </div>
        {/* Additional Card */}
       
      </div>
      {/* right box */}
      <div className="bg-slate-400  w-1/4 mt-10">
        {obj.map((item, index) => {
          return (
            <Card item={item} key={item._id}></Card>
          );
        })}
      </div>
    </div>
  );
}
export default Home;
