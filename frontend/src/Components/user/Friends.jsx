import React, { useEffect, useState } from 'react'
import axios from "axios"
function Friends() {
    let [friends, setFriends]= useState([]);
    useEffect(()=>{
      async function fetchData(){
        let res= await axios.get("http://localhost/getAllFriends");
        setFriends([...friends,...res.data]);
        console.log(friends);
      }
    })
  return (
    <div></div>
  )
}

export default Friends