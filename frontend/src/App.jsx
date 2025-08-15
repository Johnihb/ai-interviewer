import React from 'react'
import {  Routes , Route , Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<Navigate to='/' />} /> */}
      </Routes>
    </>
  )
}

export default App