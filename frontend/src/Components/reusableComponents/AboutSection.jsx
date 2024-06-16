import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
function AboutSection() {
  return (
        <div className="absolute h-full top-10 left-0 w-full bg-white border rounded-lg shadow-lg z-50">
          <Link to={'/user/profile'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">My hello</Link>
          <Link to={'/user/my-posts'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Myhow are you</Link>
          <Link to={'/user/add-post'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Add Post</Link>
          <Link to={'/user/notifications'} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Notifications</Link>
        </div>
  );
}

export default AboutSection