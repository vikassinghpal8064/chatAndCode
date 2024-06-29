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
    <div className='w-full py-2 px-4 mb-4 rounded-lg bg-gray-100 group relative transition-all duration-300 ease-in-out'>
      <div className='flex justify-start mb-4'>
      <div className='pr-2 pt-1'>
          <button onClick={()=>{handleProfile(item.userId._id)}}>
          {item.userId.photo && !pictureLoad ?
      (
        <>
        <img src={item.userId.photo} onError={()=>setPictureLoad(true)} className='w-12 h-12 rounded-full border-black border-2'/>
        </>
      ):(
        <>
        <img src="/Assets/profile.png" className='w-12 h-12 rounded-full border-black border-2'/>
        </>
      )}
          </button>
      </div>
      <div>
          <button onClick={()=>{handleProfile(item.userId._id)}}><h2 className='text-2xl font-semibold hover:underline hover:text-blue-400'>{item.userId.firstName} {item.userId.lastName && (item.userId.lastName)}</h2></button>
        <h2 className='text-sm text-gray-400'>{formatDate(item.createdAt)}</h2>
      </div>
      </div>
      <div>
      <h2 className='text-xl font-semibold pb-2'>{item.title}</h2>
      <div className='bg-gray-300 w-full h-60'>
      <img className='h-60 w-auto mx-auto' src={item.upload} />
      </div>
      <h2 className='text-xl font-medium py-2 line-clamp-3 expand-text'>{item.desc}</h2>
      </div>
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'h-auto' : 'h-0 group-hover:h-7'}`}>
        <div className='h-full flex justify-evenly border-t-2 border-gray-300'>
          <div className='flex text-lg'>
            <div className='flex items-center'>
            <p className='pr-1'>{likesCount}</p>
            {isLiked ? (
              <FaThumbsUp className='mr-4 text-blue-600' onClick={()=>{handleLike(item._id)}} />
            ):(
              <FaRegThumbsUp className='mr-4 text-blue-600' onClick={()=>{handleLike(item._id)}}></FaRegThumbsUp>
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
          <div className='flex items-center text-lg relative h-full' onClick={toggleDropdown}>
            <FaRegCommentAlt className='mr-1'></FaRegCommentAlt>
            <p>Comments {commentsCount}</p>
          </div>
          <div className='flex items-center text-lg'>
            <FaShare className='mr-1'></FaShare>
            <p>Share</p>
          </div>
        </div>
      </div>
      {isOpen && (
              <div className='transition-all ease-in-out duration-500 w-full h-56 mt-2 relative'>
              <div className='w-full bg-gray-400 h-full rounded-lg p-2 overflow-y-auto pb-14' style={{scrollbarWidth:'none'}}>
              {allComment && allComment.map((item,index)=>{
                return (
                  <CommentCard item={item} key={item._id}/>
                )
              })}
              </div>
              <div className='absolute bottom-0 flex items-center justify-evenly bg-gray-400 rounded-lg w-full px-2 py-1'>
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
              <div className='w-9/12'>
               <input type="text" className='h-full w-full p-2 text-center rounded-lg' onChange={handleChange} placeholder={`${user?.firstName ?? ''} ${user?.lastName ?? ''} comment here ...`} value={comment}/>
              </div>
              <div>
                <button onClick={()=>{handleComment(item._id)}} className='bg-green-400 p-2 rounded-lg text-green-800'>Comment</button>
              </div>
              </div>
              </div>
            )}
    </div>
  )
}

export default PostCard