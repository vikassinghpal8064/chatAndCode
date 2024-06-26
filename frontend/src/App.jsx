import React from 'react'
import Signup from './Components/user/Signup'
import { Routes,Route } from 'react-router-dom'
import Nav from './Components/Nav'
import Home from './Components/Home'
import Login from './Components/user/Login'
import Friends from './Components/user/Friends'
import Chat from './Components/chat/Chat'
import Check from './Components/user/Check'
import AddPost from './Pages/Post/AddPost'
import ViewProfile from './Pages/Profile/ViewProfile'
import AddEducation from './Pages/Profile/AddEducation'
import UpdateEducation from './Pages/Profile/UpdateEducation'
import UpdateProfile from './Pages/Profile/UpdateProfile'
import NotifyCard from './Components/reusableComponents/NotifyCard'

function App() {
  return (
    <div>
     <Nav></Nav>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/friends' element={<Friends></Friends>}></Route>
        <Route path='/addpost' element={<AddPost></AddPost>}></Route>
        <Route path='/chat' element={<Chat></Chat>}></Route>
        <Route path='/check' element={<Check></Check>}></Route>
        <Route path='/ViewProfile/:id' element={<ViewProfile></ViewProfile>}></Route>
        <Route path='/getAllFriends' element={<Friends></Friends>}></Route>
        <Route path='/user/add-education' element={<AddEducation></AddEducation>}></Route>
        <Route path='/user/update-education' element={<UpdateEducation></UpdateEducation>}></Route>
        <Route path='/user/update-profile' element={<UpdateProfile></UpdateProfile>}></Route>
        <Route path='/notifications' element={<NotifyCard></NotifyCard>}></Route>
      </Routes>
      
    </div>
  )
}

export default App