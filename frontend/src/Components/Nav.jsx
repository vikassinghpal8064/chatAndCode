import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
function Nav() {
    return(
        <div className='bg-gray-400 h-16 flex justify-evenly items-center fixed w-full z-50 text-xl font-bold text-white top-0'>
        <Link to="/">HOME</Link>
        <Link to="/about" >ABOUT</Link>
        <Link to="/getAllFriends" >FRIENDS</Link>
        <Link to="/notifications">NOTIFICATIONS</Link>
        <Link to="/login">LOGIN</Link>
        <Link to="/signup">SIGNUP</Link>
      </div>
      )
}

export default Nav
