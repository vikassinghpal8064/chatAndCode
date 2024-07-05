import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaRegThumbsUp ,FaRegThumbsDown,FaThumbsDown,FaThumbsUp,FaRegCommentAlt ,FaShare} from "react-icons/fa";
import SetupAxiosInstances from '../Instances/SetupAxiosInstances';
import CommentCard from './CommentCard';

function PostCard({item,user}) {
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
    <div className='w-full xs:px-2 md:px-4 py-1 px-2 xs:mb-2 sm:mb-3 md:mb-4 mb-2 rounded-lg bg-gray-100 group relative transition-all duration-300 ease-in-out'>
      <div className='flex justify-start xs:mb-1 mb-1'>
      <div className='xs:pr-1 xs:pt-2 sm:pr-2 sm:pt-1 pr-2 pt-1'>
          <button onClick={()=>{handleProfile(item.userId._id)}}>
          {item.userId.photo && !pictureLoad ?
      (
        <>
        <img src={item.userId.photo} onError={()=>setPictureLoad(true)} className='xs:w-10 xs:h-10 sm:w-12 sm:h-12 w-12 h-12 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='xs:w-10 xs:h-10 sm:w-12 sm:h-12 w-12 h-12 rounded-full border-black border-2'/>
        </>
      )}
          </button>
      </div>
      <div>
          <button onClick={()=>{handleProfile(item.userId._id)}}><h2 className='xs:text-xl sm:text-2xl text-lg font-semibold hover:underline hover:text-blue-400'>{item.userId.firstName} {item.userId.lastName && (item.userId.lastName)}</h2></button>
        <h2 className='xs:text-xs sm:text-sm text-xs text-gray-400'>{formatDate(item.createdAt)}</h2>
      </div>
      </div>
      <div>
      <h2 className='xs:text-lg sm:text-xl text-sm xxs:text-base font-semibold xs:pb-1 pb-2 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 ease-in-out'>{item.title}</h2>
      <div className='bg-gray-300 w-full xs:h-40 sm:h-50 md:h-60 h-35'>
      <img className='xs:h-40 sm:h-50 md:h-60 h-35 w-auto mx-auto' src={item.upload} />
      </div>
      <h2 className='xs:text-lg sm:text-xl text-sm xxs:text-base font-medium xs:py-1 sm:py-2 py-2 line-clamp-2 expand-text group-hover:line-clamp-none transition-all duration-300 ease-in-out'>{item.desc}</h2>
      </div>
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'h-auto' : 'h-0 group-hover:h-7 xs:group-hover:h-5 sm:group-hover:h-6 md:group-hover:h-7'}`}>
        <div className='h-full flex justify-evenly border-t-2 border-gray-300'>
          <div className='flex xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs'>
            <div className='flex items-center'>
            <p className='pr-1'>{likesCount}</p>
            {isLiked ? (
              <FaThumbsUp className='xs:mr-1 sm:mr-2 md:mr-3 lg:mr-4 text-blue-600' onClick={()=>{handleLike(item._id)}} />
            ):(
              <FaRegThumbsUp className='xs:mr-1 sm:mr-2 md:mr-3 lg:mr-4 text-blue-600' onClick={()=>{handleLike(item._id)}}></FaRegThumbsUp>
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
          <div className='flex items-center xs:text-sm sm:text-base md:text-lg lg:text-xl text-xs relative h-full' onClick={toggleDropdown}>
            <FaRegCommentAlt className='mr-1'></FaRegCommentAlt>
            <p>Comments {commentsCount}</p>
          </div>
          <div className='flex items-center xs:text-sm sm:text-base md:text-lg text-xs'>
            <FaShare className='mr-1'></FaShare>
            <p>Share</p>
          </div>
        </div>
      </div>
      {isOpen && (
              <div className='transition-all ease-in-out duration-500 w-full xs:h-48 sm:h-52 md:h-56 h-44 mt-2 relative'>
              <div className='w-full bg-gray-400 h-full rounded-lg p-2 overflow-y-auto pb-14' style={{scrollbarWidth:'none'}}>
              {allComment && allComment.map((item,index)=>{
                return (
                  <CommentCard item={item} key={item._id}/>
                )
              })}
              </div>
              <div className='absolute bottom-0 flex items-center justify-evenly bg-gray-400 xs:rounded-md rounded-md md:rounded-lg w-full xs:px-1 px-1 py-1'>
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
              <div className='xs:w-2/3 w-2/3 md:w-3/4'>
               <input type="text" className='h-full w-full xs:px-1 xs:py-2 md:p-2 p-1 text-center xs:rounded-md rounded-md md:rounded-lg text-sm xs:text-sm sm:text-base md:text-lg xs:outline-0' onChange={handleChange} placeholder={`${user?.firstName ?? ''} ${user?.lastName ?? ''} comment here ...`} value={comment}/>
              </div>
              <div>
                <button onClick={()=>{handleComment(item._id)}} className='bg-green-400 xs:px-1 xs:py-2 p-1  xs:rounded-md rounded-md md:rounded-lg md:p-2 md:text-lg text-green-800 text-sm xs:text-sm sm:text-base'>Comment</button>
              </div>
              </div>
              </div>
            )}
    </div>
  )
}

export default PostCard