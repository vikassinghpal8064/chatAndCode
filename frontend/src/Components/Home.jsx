import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "./reusableComponents/Card";
import { FaSearch ,FaPlus} from "react-icons/fa";
import SetupAxiosInstances from "./Instances/SetupAxiosInstances";
import PostCard from "./reusableComponents/PostCard";
import Nav from "./Nav";

function Home() {
  let [obj, setObj] = useState([]);
  let [post, setPost] = useState([]);
  let parentRef = useRef(null);
  const [childWidth, setChildWidth] = useState('100%');
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
  
  useEffect(()=>{
    const handleResize = () => {
      if (parentRef.current) {
        const parentWidth = parentRef.current.clientWidth;
        setChildWidth(`${parentWidth - 16}px`);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])
  return (
    <>
    <Nav/>
     <div className="w-full sm:w-11/12 md:w-10/12 lg:w-4/5 xl:w-2/3 flex flex-col px-2 py-2 mx-auto justify-between bg-gray-200 xs:relative xs:top-10 sm:top-12 md:top-14 lg:top-16 h-screen xs:h-screen-72 z-50" ref={parentRef} style={{overflowX:'hidden',scrollbarWidth:'none'}}>
      <div className="xs:fixed xs:top-12 sm:top-14 md:top-16 lg:top-18 lg:mt-2 bg-white h-12 flex justify-between items-center rounded-md" style={{width:childWidth}}>
      <div className="w-3/4 sm:w-2/3 h-12 flex justify-center items-center">
        <div className="rounded-md h-8 s:h-10 xms:h-8 w-32 xxs:w-40 xs:w-48 s:w-56 sm:w-52 sd:w-60 md:w-64 relative mr-2 cursor-pointer ml:w-80 lg:w-88">
         <button className="left-1 top-1 px-1 absolute py-2 text-xs xms:text-sm s:text-base sm:text-lg sd:text-xl"><FaSearch/></button>
         <input type="text" className="outline-0 h-full pl-7 sm:pl-10 pr-2 py-2 w-32 xxs:w-40 xs:w-48 s:w-56 sm:w-52 sd:w-60 md:w-64 rounded-md text-xs xms:text-sm font-semibold text-center bg-gray-200 s:text-base sm:text-lg sd:text-xl ml:w-80 lg:w-88" placeholder="search here........."/>
        </div>
        <Link to={'/addpost'}>
        <div className="border-4 border-yellow-600 h-10 w-20 xxs:w-24 xms:w-28 sd:w-32 lg:w-36 flex items-center rounded-md cursor-pointer">
         <h2 className="text-xs xms:text-sm px-2 s:text-base sd:text-lg lg:text-xl"><FaPlus/></h2>
         <h2 className="text-xs xms:text-sm font-semibold s:text-base sd:text-lg lg:text-xl">Add Post</h2>
        </div>
        </Link>
      </div>
      <div className="w-1/4 sm:w-1/3 h-12 flex justify-center items-center text-xs xms:text-sm pr-1 font-semibold s:text-base sm:text-lg sd:text-xl ml:text-2xl">
       Trending Users
      </div>
      </div>
     <div className="w-full flex justify-between xs:relative xs:top-14">
      <div className="xs:w-3/4 sm:w-2/3 w-3/4 xs:me-1 me-1 xs:px-1 md:pl-2 md:pr-5 px-1 overflow-y-auto h-screen-72 xs:h-screen-136" style={{scrollbarWidth:'none'}}>
      <div className="bg-white xs:p-1 p-2 mb-2 h-auto xs:rounded-lg sm:rounded-xl rounded-lg w-full min-h-screen-72 xs:min-h-screen-136">
        {post && post.map((item,index)=>{
          return(
            <PostCard key={index} item={item} user={user}/>
          )
        })}
        <div className=" w-full xs:h-6 sm:h-8 h-6 flex justify-center items-center">
         <h2 className="xs:text-xl text-2xl font-semibold flex mb-2">Page 
          <ul className="pl-2 gap-2 xs:text-lg text-xl flex items-center justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`hover:text-blue-600 hover:underline ${currentPage === index + 1 ? "xs:text-xl text-2xl text-blue-600" : "text-gray-500"}`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</li>
          ))}
          </ul>
         </h2>
        </div>
       </div>
      </div>
      <div className="xs:w-1/4 sm:w-1/3 md:pr-2 w-1/4 overflow-y-auto h-screen-72 xs:h-screen-136" style={{scrollbarWidth:'none'}}>
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
