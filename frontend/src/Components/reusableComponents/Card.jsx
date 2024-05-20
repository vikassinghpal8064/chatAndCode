import React from 'react'
import { Link } from 'react-router-dom'
function Card({item}) {
  return (
    <>
    <div
              className=" flex flex-col justify-center items-center mt-14"
              key={item._id}
            >
              <img
                className="rounded-full size-40"
                src={item.photo}
                alt=""
              />

              <h3>{item.firstName +" "+item.lastName}</h3>
              <Link to={`/ViewProfile/${item._id}`}>
              <button className="bg-cyan-400 w-auto border-blue-600 rounded-md">
                check profile
              </button>
              </Link>
           
            
            </div>
    </>
  )
}

export default Card