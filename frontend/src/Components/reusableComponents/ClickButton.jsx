import React from 'react'

function ClickButton({name,handleClick}) {
  return ( 
   <button className='bg-orange-400 rounded-md' onClick={handleClick}>
  {name}
   </button>
  )
}

export default ClickButton
