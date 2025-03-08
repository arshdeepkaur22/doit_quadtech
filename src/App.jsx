import React from 'react'
import Navbar from './components/Navbar'
import Content from './components/Content'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Login from './components/Login'

const App = () => {

  const[profile,setProfile]=useState(false)

  const isAuthenticated = useSelector((state) => state.tasks.isAuthenticated);

 
  if (!isAuthenticated) {
    return <Login />;
  }
 

  return (
    <div>
      <Navbar profile={profile} setProfile={setProfile}/>
      <Content profile={profile}/>
    </div>
  )
}

export default App