import React from 'react'
import Signup from './Components/user/Signup'
import { Routes,Route } from 'react-router-dom'
import Nav from './Components/Nav'
import Home from './Components/Home'
import Login from './Components/user/Login'
import Friends from './Components/user/Friends'
import Chat from './Components/chat/Chat'
import Check from './Components/user/Check'
function App() {
  return (
    <div>
     <Nav></Nav>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/friends' element={<Friends></Friends>}></Route>
        <Route path='/chat' element={<Chat></Chat>}></Route>
        <Route path='/check' element={<Check></Check>}></Route>
      </Routes>
      
    </div>
  )
}

export default App