import React from 'react'
import Signup from './Components/user/Signup'
import { Routes,Route } from 'react-router-dom'
import Nav from './Components/Nav'
function App() {
  return (
    <div>
     <Nav>Home</Nav>
      <Routes>
        <Route path='/signup' element={<Signup></Signup>}></Route>
      </Routes>
      
    </div>
  )
}

export default App