import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
function Nav() {
    return(
        <div className='bg-orange-200 h-16 flex justify-evenly items-center'>
        <Link to="/">HOME</Link>
        <Link to="/friends" >FRIENDS</Link>
        <Link to="/notifications">NOTIFICATIONS</Link>
        <Link to="/about" >ABOUT</Link>
        <Link to="/login">LOGIN</Link>
        <Link to="/signup">SIGNUP</Link>
      </div>
      )
}
    

export default Nav
