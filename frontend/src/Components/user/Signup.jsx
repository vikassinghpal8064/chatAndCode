import React from 'react'

function Signup() {
  
  return (
    <div>
        <form action="/" method=''>
            <div>

            <label htmlFor="firstName">firstName</label>
            <input id='firstName' type="text" />
            </div>
            
            <div>

            <label htmlFor="lastName">lastName</label>
            <input id='lastName' type="text" />
            </div>

             <div>
             
            <label htmlFor="email">email</label>
            <input id='email' type="text" />
            </div>   
             
             <div>

            <label htmlFor="password">password</label>
            <input id='password' type="password" />
             </div>

        </form>
    </div>
  )
}

export default Signup