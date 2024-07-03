import React from 'react'
import Signup from './Components/user/Signup'
import { Routes,Route } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/user/Login'
import Friends from './Components/user/Friends'
import Chat from './Components/chat/Chat'
import AddPost from './Pages/Post/AddPost'
import ViewProfile from './Pages/Profile/ViewProfile'
import AddEducation from './Pages/Profile/AddEducation'
import UpdateEducation from './Pages/Profile/UpdateEducation'
import UpdateProfile from './Pages/Profile/UpdateProfile'
import NotifyCard from './Components/reusableComponents/NotifyCard'


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/addpost' element={<AddPost/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/ViewProfile/:id' element={<ViewProfile/>}/>
        <Route path='/friend-list' element={<Friends/>}/>
        <Route path='/user/add-education' element={<AddEducation/>}/>
        <Route path='/user/update-education' element={<UpdateEducation/>}/>
        <Route path='/user/update-profile' element={<UpdateProfile/>}/>
        <Route path='/notifications' element={<NotifyCard/>}/>
      </Routes>
    </div>
  )
}

export default App