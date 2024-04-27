import React from 'react'
import Signup from './Components/user/Signup'
import { Routes,Route } from 'react-router-dom'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/signup' element={<Signup></Signup>}></Route>
      </Routes>
      
    </div>
  )
}

export default App