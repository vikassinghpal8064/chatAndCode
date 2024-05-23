import React from 'react';
import { Link } from 'react-router-dom';

function Card({ item }) {
  // console.log("item:", item);
  return (
    <div  className="flex flex-col justify-center items-center mt-14 p-6 bg-white shadow-lg rounded-lg" key={item._id}>
      <img
        className="rounded-full w-40 h-40 object-cover"
        src={item.photo}
        alt={`${item.firstName} ${item.lastName}`}
      />
      <h3 className="mt-4 text-xl font-semibold">{item.firstName} {item.lastName}</h3>
      <div className='flex flex-col gap-3 mt-4'>
        <Link to={`/ViewProfile/${item._id}`}>
          <button className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
            Check Profile
          </button>
        </Link>
        <Link to="/chat">
          <button className="bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-500 transition duration-300">
            Chat
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Card;
