import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaRegThumbsUp ,FaRegThumbsDown,FaThumbsDown,FaThumbsUp,FaRegCommentAlt ,FaShare} from "react-icons/fa";
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import ProfileCommentCard from './ProfileCommentCard';

function ProfilePostCard({item,user}) {
  let [pictureLoad,setPictureLoad] = useState(false);
  let [profile , setProfile] = useState({});
  const [animateLike, setAnimateLike] = useState(false);
  const [animateDisLike, setAnimateDisLike] = useState(false);
  let [likesCount,setLikesCount] = useState(item.likes.length);
  let [dislikesCount,setDislikesCount] = useState(item.dislikes.length);
  let [commentsCount,setCommentsCount] = useState(item.comments.length);
  let [allComment,setAllComment] = useState(item.comments);
  let [isLiked,setIsLiked] = useState(false);
  let [isDisLiked,setIsDisLiked] = useState(false);
  let [comment,setComment] = useState('');
  let [isOpen,setIsOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
   
  let navigate = useNavigate();
  let axiosInstances = SetupAxiosInstances(navigate);

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

  async function handleLike(id){
  await axiosInstances.get(`/like/post/${id}`)
  .then((res)=>{
   if(res.data.message == "post liked successfully"){
    setLikesCount(likesCount + 1);
    setIsLiked(true);
    if(isDisLiked){
      setDislikesCount(dislikesCount - 1);
      setIsDisLiked(false);
    }
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 3000);
   }else if(res.data.message == "already liked"){
    alert("you already liked this post.");
   }
  })
  .catch((e)=>{
    if(e.response.data.message == "User not found"){
     console.log("user not found: ",e.message);
    }else if(e.response.data.message == "Post not found"){
    console.log("post not found: ",e.message);
    }else{
      console.log("internal server error: ",e);
    }
  })
  }
  
  async function handleDisLike(id){
    await axiosInstances.get(`/dislike/post/${id}`)
    .then((res)=>{
      if(res.data.message == "post disliked successfully"){
        setDislikesCount(dislikesCount + 1);
        setIsDisLiked(true);
        if(isLiked){
          setLikesCount(likesCount - 1);
          setIsLiked(false);
        }
       setAnimateDisLike(true);
       setTimeout(() => setAnimateDisLike(false), 3000);
      }else if(res.data.message == "already disliked"){
       alert("you already disliked this post.");
      }
     })
     .catch((e)=>{
       if(e.response.data.message == "User not found"){
        console.log("user not found: ",e.message);
       }else if(e.response.data.message == "Post not found"){
       console.log("post not found: ",e.message);
       }else{
         console.log("internal server error: ",e);
       }
     })
  }
  
  async function handleChange(e){
    e.preventDefault();
    setComment(e.target.value);
  }

  async function handleComment(id){
    if(comment !== ''){
    await axiosInstances.post(`/comment/${id}`,{comment})
    .then((res)=>{
    if(res.data.message == "Comment is added"){
      setCommentsCount( commentsCount + 1);
      setAllComment(res.data.comments);
      setComment('');
      alert("comment added successfully");
    }
    })
    .catch((e)=>{
      if(e.response.data.message == "User not found"){
        console.log("user not found: ",e.message);
       }else if(e.response.data.message == "Post not found"){
       console.log("post not found: ",e.message);
       }else{
         console.log("internal server error: ",e);
       }
    })
    }
  }

  async function toggleDropdown(){
    setIsOpen(!isOpen);
  }
  useEffect(()=>{
    if(item.likes){
      const likedId = item.likes.map(like => like.likedBy);
      setIsLiked(likedId.includes(userId));
    }else{
      setIsLiked(false);
    }
    if(item.dislikes){
      const dislikedId = item.dislikes.map(dislike => dislike.dislikedBy);
      setIsDisLiked(dislikedId.includes(userId));
    }else{
      setIsDisLiked(false);
    }
  },[]);

  return (
    <div className='mx-1 py-1 sm:mb-4 lg:mb-4 rounded-lg bg-gray-100 group relative transition-all duration-300 ease-in-out sm:px-2 md:px-1 xl:px-2 2xl:px-3' style={{width:'calc(100% - 8px)'}}>
      <div className='flex justify-start sm:mb-1'>
      <div className='sm:pr-2 sm:pt-1'>
          <button onClick={()=>{handleProfile(item.userId._id)}}>
          {item.userId.photo && !pictureLoad ?
      (
        <>
        <img src={item.userId.photo} onError={()=>setPictureLoad(true)} className='sm:w-12 sm:h-12 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='sm:w-12 sm:h-12 2xl:h-14 2xl:w-14 rounded-full border-black border-2'/>
        </>
      )}
          </button>
      </div>
      <div>
          <button onClick={()=>{handleProfile(item.userId._id)}}><h2 className='sm:text-2xl md:text-xl xl:text-2xl font-semibold hover:underline hover:text-blue-400'>{item.userId.firstName} {item.userId.lastName && (item.userId.lastName)}</h2></button>
        <h2 className='sm:text-base md:text-sm xl:text-base text-gray-400'>{formatDate(item.createdAt)}</h2>
      </div>
      </div>
      <div>
      <h2 className='sm:text-xl md:text-lg xl:text-xl font-semibold md:pb-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 ease-in-out'>{item.title}</h2>
      <div className='bg-gray-300 w-full sm:h-56 xl:h-60'>
      <img className='sm:h-56 xl:h-60 w-auto mx-auto' src={item.upload} />
      </div>
      <h2 className='sm:text-xl md:text-lg xl:text-xl font-medium sm:py-2 line-clamp-2 expand-text group-hover:line-clamp-none transition-all duration-300 ease-in-out'>{item.desc}</h2>
      </div>
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'h-auto' : 'h-0 sm:group-hover:h-7'}`}>
        <div className='h-full flex justify-evenly border-t-2 border-gray-300'>
          <div className='flex sm:text-xl md:text-lg lg:text-base xl:text-lg 2xl:text-xl'>
            <div className='flex items-center'>
            <p className='pr-1'>{likesCount}</p>
            {isLiked ? (
              <FaThumbsUp className='sm:mr-2 lg:mr-1 xl:mr-2 text-blue-600' onClick={()=>{handleLike(item._id)}} />
            ):(
              <FaRegThumbsUp className='sm:mr-2 lg:mr-1 xl:mr-2 text-blue-600' onClick={()=>{handleLike(item._id)}}></FaRegThumbsUp>
            )}
            </div>
            <div className='flex items-center'>
            <p className='pr-1'>{dislikesCount}</p>
            {isDisLiked ? (
              <FaThumbsDown className='text-red-600' onClick={()=>{handleDisLike(item._id)}} />
            ):(
              <FaRegThumbsDown className='text-red-600' onClick={()=>{handleDisLike(item._id)}}></FaRegThumbsDown>
            )}
            </div>
            {animateLike && (
            <FaThumbsUp className='like-animation' />
          )}
          {animateDisLike && (
            <FaThumbsDown className='dislike-animation' />
          )}
          </div>
          <div className='flex items-center sm:text-xl md:text-lg lg:text-base xl:text-lg 2xl:text-xl relative h-full' onClick={toggleDropdown}>
            <FaRegCommentAlt className='mr-1'></FaRegCommentAlt>
            <p>Comments {commentsCount}</p>
          </div>
          <div className='flex items-center sm:text-lg md:text-base lg:text-sm xl:text-base 2xl:text-lg'>
            <FaShare className='mr-1'></FaShare>
            <p>Share</p>
          </div>
        </div>
      </div>
      {isOpen && (
              <div className='transition-all ease-in-out duration-500 w-full lg:h-56 md:h-52 sm:h-56 mt-2 relative'>
              <div className='w-full bg-gray-400 h-full rounded-lg p-2 overflow-y-auto pb-14' style={{scrollbarWidth:'none'}}>
              {allComment && allComment.map((item,index)=>{
                return (
                  <ProfileCommentCard item={item} key={item._id}/>
                )
              })}
              </div>
              <div className='absolute bottom-0 flex items-center justify-evenly bg-gray-400 sm:rounded-lg md:rounded-md lg:rounded-lg w-full px-1 py-1'>
              <div>
              {user.photo && !pictureLoad ?
      (
        <>
        <img src={user.photo} onError={()=>setPictureLoad(true)} className='w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-8 h-8 rounded-full border-black border-2 bg-gray-100'/>
        </>
      )}
      
              </div>
              <div className='sm:w-3/4'>
               <input type="text" className='h-full w-full sm:p-2 text-center sm:rounded-lg md:rounded-md sm:text-lg md:text-base xl:text-lg outline-0' onChange={handleChange} placeholder={`${user?.firstName ?? ''} ${user?.lastName ?? ''} comment here ...`} value={comment}/>
              </div>
              <div>
                <button onClick={()=>{handleComment(item._id)}} className='bg-green-400 sm:rounded-md sm:p-2 text-green-800 sm:text-base md:text-sm xl:text-base'>Comment</button>
              </div>
              </div>
              </div>
            )}
    </div>
  )
}

export default ProfilePostCard